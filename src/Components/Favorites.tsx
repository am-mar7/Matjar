import { useEffect, useState } from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useWishList } from "../Context/WishListContext";

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

export default function Favorites() {
  const [fav, setFav] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const { removefromWishList } = useWishList();

  const container: Variants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const item: Variants = {
    hidden: { opacity: 0, y: 8 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: "easeOut" },
    },
  };

  function getFav() {
    const token = localStorage.getItem("userToken");
    if (!token) return;

    axios
      .get("https://ecommerce.routemisr.com/api/v1/wishlist", {
        headers: { token },
      })
      .then(({ data }) => {
        setFav(data.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }

  function handleDelete(id: string) {
    const newFav = fav.filter((product) => product.id != id);
    setFav(newFav);
    const userToken = localStorage.getItem("userToken");
    if (userToken) removefromWishList(userToken, id);
  }

  useEffect(() => {
    if (localStorage.getItem("userToken")) getFav();
  }, []);

  // user not logged in
  if (!localStorage.getItem("userToken")) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[70vh] text-center px-4">
        <div className="bg-slate-50 shadow-lg rounded-2xl p-10 max-w-md w-full transition-all duration-500 hover:shadow-xl">
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-full p-5">
              <i className="fa-solid fa-user-lock text-4xl text-slate-600"></i>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            {t("notLoggedInTitle")}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed">
            {t("notLoggedInDesc")}
          </p>
          <Link
            to="/login"
            className="inline-block px-8 py-3 bg-slate-800 text-white text-lg font-medium rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-300 shadow-md"
          >
            {t("goToLogin")}
          </Link>
          <p className="text-slate-400 text-sm mt-4">
            {t("noAccount")}{" "}
            <Link
              to="/signup"
              className="text-slate-700 font-semibold hover:underline"
            >
              {t("signUpHere")}
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="max-w-7xl font-bold text-slate-800 my-10 text-2xl md:text-4xl">
        {t("yourWishlist")}
      </h1>
      <div className="product-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-4 max-w-7xl bg-slate-100 p-5 lg:p-10 rounded-2xl">
        {loading &&
          Array.from({ length: 15 }).map((_, idx) => (
            <div key={idx} className="p-3">
              <div className="bg-white rounded-2xl shadow-md overflow-hidden p-4">
                <div className="h-[16rem]">
                  <Skeleton width={200} height="100%" className="rounded-xl" />
                </div>
                <div className="mt-4 space-y-2">
                  <Skeleton height={18} />
                  <Skeleton height={18} />
                  <Skeleton height={18} />
                </div>
              </div>
            </div>
          ))}

        {!loading && fav.length > 0 && (
          <AnimatePresence>
            <motion.div
              className="contents cursor-pointer"
              variants={container}
              initial="hidden"
              animate="show"
              exit="hidden"
            >
              {fav.map((product, idx) => (
                <motion.div
                  layout
                  variants={item}
                  key={product.id || idx}
                  className="p-3"
                >
                  <Link
                    to={`/productdetails/${product?.category?.name}/${product.id}`}
                    className="relative"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleDelete(product.id);
                      }}
                      className={`absolute top-3 cursor-pointer left-3 z-10 bg-white/70 hover:bg-white text-slate-600 hover:text-red-700 rounded-full p-2`}
                    >
                      <i className="fa-solid fa-trash" />
                    </button>
                    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group/card">
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
                            {product.price} {t("egp")}
                          </span>

                          <span className="flex items-center gap-1 text-xs md:text-sm 2xl:text-md text-yellow-500 font-medium">
                            {product.ratingsAverage}
                            <i className="fas fa-star" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {!loading && fav.length === 0 && (
          <div className="p-6 col-span-full">
            <div className="max-w-xl mx-auto text-center text-slate-600">
              <p className="text-lg font-semibold">{t("noFavYet")}</p>
              <p className="mt-2 text-sm">{t("noFavDesc")}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
