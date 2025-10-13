// src/components/HeroSection.tsx
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import BrandsSkeleton from "./skeletonCompnentx/BrandsSkeleton";
import homebg1 from "../assets/Images/homebg1.jpeg";
import homebg2 from "../assets/Images/homebg2.jpeg";
import homebg3 from "../assets/Images/homebg3.jpeg";
import homebg4 from "../assets/Images/homebg4.jpeg";
import CategoriesSkeleton from "./skeletonCompnentx/CategoriesSkeleton";
import {
  FaTruck,
  FaMoneyBillWave,
  FaHeadset,
  FaShieldAlt,
} from "react-icons/fa";
import ProductsSlider from "./ProductsSlider";
import { Link } from "react-router-dom";

const images: string[] = [homebg1, homebg2, homebg3, homebg4];

function Home() {
  const { t } = useTranslation();
  const [index, setIndex] = useState<number>(0);
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const features = [
    {
      icon: <FaTruck className="text-4xl text-cyan-400" />,
      title: t("features.free_delivery"),
      desc: t("features.free_delivery_desc"),
    },
    {
      icon: <FaMoneyBillWave className="text-4xl text-cyan-400" />,
      title: t("features.money_return"),
      desc: t("features.money_return_desc"),
    },
    {
      icon: <FaHeadset className="text-4xl text-cyan-400" />,
      title: t("features.online_support"),
      desc: t("features.online_support_desc"),
    },
    {
      icon: <FaShieldAlt className="text-4xl text-cyan-400" />,
      title: t("features.reliable"),
      desc: t("features.reliable_desc"),
    },
  ];

  function getCategories() {
    // if (localStorage.getItem("categories")) {
    //   setCategories(JSON.parse(localStorage.getItem("categories") || "[]"));
    //   return;
    // }
    setCategoriesLoading(true);
    axios
      .get("https://ecommerce.routemisr.com/api/v1/categories")
      .then(({ data }) => {
        console.log("categories", data);
        setCategories(data.data);
        // localStorage.setItem("categories", JSON.stringify(data.data));
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => {
        setCategoriesLoading(false);
      });
  }
  function getBrands() {
    // if (localStorage.getItem("brands")) {
    //   setBrands(JSON.parse(localStorage.getItem("brands") || "[]"));
    //   return;
    // }
    setBrandsLoading(true);
    axios
      .get("https://ecommerce.routemisr.com/api/v1/brands")
      .then(({ data }) => {
        console.log("brands", data);
        setBrands(data.data);
        // localStorage.setItem("brands", JSON.stringify(data.data));
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => {
        setBrandsLoading(false);
      });
  }
  function getProducts() {
    axios
      .get("https://ecommerce.routemisr.com/api/v1/products")
      .then(({ data }) => {
        console.log("products", data.data);
        setProducts(data.data);
      })
      .catch((response) => {
        console.log(response);
      });
  }
  useEffect(() => {
    getCategories();
    getBrands();
    getProducts();
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 4000); // change every 4s
    return () => clearInterval(id);
  }, []);

  return (
    <>
      <section
        aria-label={t("hero_aria")}
        className="relative min-h-[70vh] sm:min-h-[75vh] md:min-h-[85vh] overflow-hidden bg-slate-950 flex items-center"
      >
        {/* Background slider */}
        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            className="absolute inset-0 bg-center bg-cover"
            style={{ backgroundImage: `url(${images[index]})` }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            aria-hidden="true"
          />
        </AnimatePresence>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/95 via-slate-900/70 to-transparent" />

        {/* Main content - Better mobile padding */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <motion.h3
              className="text-cyan-400 tracking-widest uppercase text-xs sm:text-sm mb-2 sm:mb-3"
              initial={{ y: -15, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7 }}
            >
              {t("hero_tag")}
            </motion.h3>

            <motion.h1
              className="text-white font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight mb-3 sm:mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.9 }}
            >
              {t("hero_title")}
            </motion.h1>

            <motion.p
              className="text-slate-200 text-sm sm:text-base md:text-lg mb-6 sm:mb-7 max-w-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.9 }}
            >
              {t("hero_subtitle")}
            </motion.p>

            <motion.div
              className="flex flex-col xs:flex-row gap-3 sm:gap-4"
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <Link to='products'
                className="cursor-pointer text-center text-sm sm:text-base md:text-lg bg-cyan-500 hover:bg-cyan-600 text-white py-3 px-6 sm:px-8 rounded-full font-semibold shadow-lg transition-all duration-300 hover:scale-105"
                aria-label={t("hero_shop_now")}
              >
                {t("hero_shop_now")}
              </Link >

              <Link to='about'
                className="cursor-pointer text-center text-sm sm:text-base md:text-lg border-2 border-slate-500 text-slate-200 py-3 px-6 sm:px-8 rounded-full hover:bg-slate-800 hover:border-slate-400 transition-all duration-300"
                aria-label={t("hero_learn_more")}
              >
                {t("hero_learn_more")}
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer text */}
        <motion.div
          className="absolute bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 text-slate-400 text-xs tracking-widest uppercase"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          {t("hero_footer")}
        </motion.div>
      </section>

      <section className="bg-gradient-to-t from-slate-700 to-slate-950 py-6 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold mb-8 text-cyan-400">
            {t("features.headline")}
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((f, idx) => (
              <div
                key={idx}
                className="flex cursor-pointer hover:scale-105 ease-in-out flex-col md:flex-row gap-4 items-center p-6 bg-slate-800 rounded-xl hover:bg-slate-700 transition-transform duration-400"
              >
                <div className="flex-shrink-0">{f.icon}</div>
                <div>
                  <h3 className="text-white text-center md:text-start font-semibold text-lg md:text-xl mb-1">
                    {f.title}
                  </h3>
                  <p className="text-cyan-400  text-center md:text-start text-sm md:text-base">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="flex justify-center items-center py-8 sm:py-10 lg:py-16">
        {!categoriesLoading ? (
          <div className="max-w-7xl">
            <h2 className="text-2xl mt-10 sm:text-3xl font-bold text-center mb-8 text-gray-900">
              {t("categories")}
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 px-5 py-10">
              {categories.map(
                (category: {
                  image: string;
                  id: string;
                  slug: string;
                  name: string;
                }) => (
                  <Link to={`/products`} state={{category:category.name}}>
                    <div
                      key={category.id || category.slug || category.name}
                      className="bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    >
                      <div className="w-full h-40 sm:h-48 md:h-62 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={category.image}
                          alt={category.slug}
                        />
                      </div>
                      <h4 className="text-center text-lg font-semibold mt-3 mb-4 text-slate-800">
                        {category.name}
                      </h4>
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        ) : (
          <CategoriesSkeleton cards={8} />
        )}
      </section>

      <section className="flex items-start justify-center py-8 sm:py-10 lg:py-16 bg-slate-100">
        <div className="max-w-7xl overflow-hidden w-full">
          <h2 className="text-2xl sm:text-3xl font-bold mx-5 mt-10 mb-6 text-gray-900">
            {t("brands")}
          </h2>

          <div className="relative">
            {/* Scroll Container */}
            <div className="flex overflow-x-auto gap-4 px-5 py-6 snap-x snap-mandatory scrollbar-hide">
              {!brandsLoading ? (
                brands.map(
                  (brand: {
                    name: string;
                    slug: string;
                    id: string;
                    image: string;
                  }) => (
                    <div
                      key={brand.id || brand.slug || brand.name}
                      className="flex-shrink-0 w-32 sm:w-36 md:w-40 lg:w-44 2xl:w-48 snap-start bg-white rounded-xl shadow-md overflow-hidden transform transition-transform hover:scale-105 hover:shadow-xl cursor-pointer"
                    >
                      <div className="w-full h-20 sm:h-28 md:h-32 overflow-hidden">
                        <img
                          className="w-full h-full object-cover"
                          src={brand.image}
                          alt={brand.slug}
                        />
                      </div>
                      <h4 className="text-center text-sm sm:text-base font-semibold mt-2 mb-3 text-slate-800">
                        {brand.name}
                      </h4>
                    </div>
                  )
                )
              ) : (
                <BrandsSkeleton cards={10} />
              )}
            </div>

            {/* Gradient Hint */}
            <div className="pointer-events-none absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-slate-300 via-slate-200 to-transparent"></div>

            {/* Scroll Hint */}
            <div className="absolute flex text-sm sm:text-md 2xl:text-lg -bottom-10 left-1/2 transform -translate-x-1/2 items-center gap-2 text-slate-500">
              <span className="animate-bounce">←</span>
              <span>{t("scroll for more")}</span>
              <span className="animate-bounce">→</span>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-14 flex justify-center bg-slate-50">
        <div className="w-full max-w-7xl px-5 md:px-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-slate-900 relative w-fit mx-auto after:absolute after:left-0 after:bottom-[-6px] after:h-[3px] after:w-full after:bg-cyan-500 after:rounded-full">
            {t("bestSeller")}
          </h2>

          {products && (
            <div className="slider-container group relative mt-5 sm:mt-10 cursor-pointer">
              <ProductsSlider
                setter={(val: any) => val}
                products={products}
              ></ProductsSlider>
              <div className="absolute flex text-sm sm:text-md 2xl:text-lg -bottom-10 left-1/2 transform -translate-x-1/2 items-center gap-2 text-slate-500">
                <span className="animate-bounce">←</span>
                <span className="text-sm sm:text-lg">
                  {t("scroll for more")}
                </span>
                <span className="animate-bounce">→</span>
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default Home;
