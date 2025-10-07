import axios from "axios";
import type { Variants } from "framer-motion";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

type Product = {
  id: string;
  title: string;
  slug: string;
  imageCover: string;
  ratingsAverage: string | number;
  price: string | number;
  brand?: { name: string };
  category?: { name: string };
};

export default function Products() {
  const { t } = useTranslation();
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState<string>("all_products");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  async function getProducts() {
    setLoading(true);
    axios
      .get("https://ecommerce.routemisr.com/api/v1/products")
      .then(({ data }) => {
        setProducts(data.data);
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    getProducts();
  }, []);

  useEffect(() => {
    if (!products || products.length === 0) return;
    const setC = new Set<string>();
    setC.add("all_products");
    products.forEach((p) => {
      const name = p.category?.name?.trim();
      if (name) setC.add(name);
    });
    setCategories(Array.from(setC));
  }, [products]);

  // ✅ Typed motion variants
  const container: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.45,
        ease: "easeOut", // ✅ now fully type-safe
      },
    },
  };

  const visibleProducts =
    filter === "all_products"
      ? products
      : products.filter((p) => p.category?.name === filter);

  return (
    <>
      <h1 className="text-lg sm:text-2xl lg:text-4xl font-bold text-slate-800 py-10 text-center">
        {t("productsPage.heading")}
      </h1>

      <div className="flex justify-center gap-3 lg:gap-6 py-5 flex-wrap">
        {categories.length ? (
          categories.map((category, idx) => {
            const key = category === "all_products" ? "all_products" : category;
            const active = filter === key;
            return (
              <button
                key={idx}
                onClick={() => setFilter(key)}
                aria-pressed={active}
                className={`cursor-pointer font-semibold select-none
                  inline-flex items-center gap-2 px-4 py-2 rounded-full transition
                  ${
                    active
                      ? "bg-slate-800 text-white shadow-md"
                      : "bg-white text-slate-700"
                  }
                  ring-1 ring-slate-200 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-cyan-300`}
              >
                {key === "all_products" ? t("productsPage.filter_all") : key}
              </button>
            );
          })
        ) : (
          <>
            <Skeleton width={100} height={36} className="rounded-full" />
            <Skeleton width={100} height={36} className="rounded-full" />
            <Skeleton width={100} height={36} className="rounded-full" />
            <Skeleton width={100} height={36} className="rounded-full" />
          </>
        )}
      </div>

      <div className="flex justify-center sm:justify-center bg-slate-100 py-10">
        <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5 max-w-7xl">
          {loading &&
            Array.from({ length: 15 }).map((_, idx) => (
              <div key={idx} className="p-3">
                <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
                  <div className="h-[16rem]">
                    <Skeleton
                      width={200}
                      height="100%"
                      className="rounded-xl"
                    />
                  </div>
                  <div className="mt-4 space-y-2">
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                    <Skeleton height={18} />
                  </div>
                </div>
              </div>
            ))}

          {!loading && visibleProducts && visibleProducts.length > 0 ? (
            <AnimatePresence>
              <motion.div
                className="contents cursor-pointer"
                variants={container}
                initial="hidden"
                animate="show"
                exit="hidden"
                key={filter}
              >
                {visibleProducts.map((product, idx) => (
                  <motion.div
                    layout
                    variants={item}
                    key={product.id || idx}
                    className="p-3"
                  >
                    <div
                      className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card"
                      role="article"
                      aria-label={product.title}
                    >
                      <Link to={`/productdetails/${product?.category?.name}/${product.id}`}>
                        <div className="relative w-full h-[18rem] overflow-hidden">
                          <img
                            src={product.imageCover}
                            alt={product.slug}
                            className="w-full h-full object-cover transform group-hover/card:scale-105 transition-transform duration-500 ease-out"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300" />
                        </div>

                        <div className="p-4 sm:p-5 bg-slate-50 text-slate-800">
                          <h4 className="font-semibold text-sm sm:text-md 2xl:text-lg truncate">
                            {product.title
                              ?.trim()
                              .split(/\s+/)
                              .slice(0, 3)
                              .join(" ")}
                          </h4>

                          {product.brand?.name && (
                            <h6 className="text-sm font-semibold text-slate-500">
                              {product.brand.name}
                            </h6>
                          )}

                          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mt-2">
                            <span className="text-slate-600 font-semibold text-xs md:text-sm 2xl:text-md">
                              {product.price} {t("productsPage.currency")}
                            </span>

                            <span className="flex items-center gap-1 text-xs md:text-sm 2xl:text-md text-yellow-500 font-medium">
                              {product.ratingsAverage}
                              <i className="fas fa-star" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          ) : null}

          {!loading && visibleProducts && visibleProducts.length === 0 && (
            <div className="p-6 col-span-full">
              <div className="max-w-xl mx-auto text-center text-slate-600">
                <p className="text-lg font-semibold">
                  {t("productsPage.no_results_title")}
                </p>
                <p className="mt-2 text-sm">
                  {t("productsPage.no_results_desc")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
