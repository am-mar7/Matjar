import { useEffect, useState } from "react";
import { useCart } from "../Context/CartContext";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import emptyCart from "../assets/Images/EmptyCart.png";
import CheckoutForm from "./CheckoutForm";

type CartItemType = {
  count: number;
  price: number;
  _id: string;
  product: {
    brand: { name: string };
    category: { name: string };
    id: string;
    imageCover: string;
    ratingsAverage: number;
    title: string;
  };
};

export default function Cart() {
  const {
    getLoggedUserCart,
    updateCartItemCount,
    removeItemFromCart,    
  } = useCart();
  const [products, setProducts] = useState<CartItemType[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [sessionId, setSessionId] = useState<string>("");
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);

  async function getCart() {
    setLoading(true);
    const res = await getLoggedUserCart();  
    setProducts(res.products);
    setTotal(res.totalCartPrice);
    setSessionId(res._id);
    console.log(res._id);
    setLoading(false);
  }
  async function updateCart(productId: string, count: number) {
    await updateCartItemCount(productId, count);
  }

  async function removeItem(productId: string) {
    // Remove item from UI first
    setProducts((prev) => prev.filter((p) => p.product.id !== productId));
    const res = await removeItemFromCart(productId);
    setTotal(res.totalCartPrice);
  }

  useEffect(() => {
    getCart();
  }, []);

  // If user not logged in
  if (!localStorage.getItem("userToken")) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full border border-slate-200"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-full p-6 shadow-inner">
              <i className="fa-solid fa-user-lock text-5xl text-slate-600"></i>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
            {t("notLoggedInTitle")}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-base">
            {t("notLoggedInDesc2")}
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-3 bg-slate-800 text-white text-lg font-semibold rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-300 shadow-md"
          >
            {t("goToLogin")}
          </Link>
          <p className="text-slate-400 text-sm mt-6">
            {t("noAccount")}{" "}
            <Link
              to="/signup"
              className="text-slate-700 font-semibold hover:underline"
            >
              {t("signUpHere")}
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 sm:px-10 py-10">
      <div className="max-w-6xl mx-auto">
        {loading ? (
          // Skeleton Loading
          <div>
            <Skeleton
              width={250}
              height={40}
              className="my-5 rounded-2xl"
            ></Skeleton>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              <div className="lg:col-span-2 space-y-6">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-5"
                  >
                    <Skeleton height={100} width={100} borderRadius="0.75rem" />
                    <div className="flex-1 space-y-2">
                      <Skeleton height={20} width="60%" />
                      <Skeleton height={15} width="40%" />
                      <Skeleton height={15} width="50%" />
                      <Skeleton height={25} width="30%" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="hidden lg:block">
                <div className="sticky top-24">
                  <div className="bg-white rounded-2xl shadow-md p-6 border border-slate-100 space-y-4">
                    <Skeleton height={30} width="60%" />
                    <Skeleton height={20} width="90%" />
                    <Skeleton height={20} width="70%" />
                    <Skeleton height={20} width="85%" />
                    <Skeleton height={45} width="100%" borderRadius="0.75rem" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : products.length === 0 ? (
          // Empty Cart
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <img
              src={emptyCart}
              alt="Empty Cart"
              className="w-56 mb-6 opacity-80"
            />
            <h2 className="text-2xl font-semibold text-slate-700 mb-2">
              {t("cartEmptyTitle")}
            </h2>
            <p className="text-slate-500 mb-6">{t("cartEmptyDesc")}</p>
            <Link
              to="/products"
              className="bg-slate-800 text-white px-6 py-3 rounded-xl hover:bg-slate-700 transition-all shadow-sm"
            >
              {t("shopNow")}
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold text-slate-800 mb-8">
              {t("shoppingCart")}
            </h1>
            {/* Cart Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              {/* Items */}
              <div className="lg:col-span-2 space-y-6 max-h-[75vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-300 scrollbar-track-transparent hover:scrollbar-thumb-slate-400">
                {products.map((item) => (
                  <motion.div
                    key={item._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-5 hover:shadow-lg transition-shadow"
                  >
                    <img
                      src={item.product.imageCover}
                      alt={item.product.title}
                      className="w-24 h-24 object-contain rounded-xl border border-slate-200"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold text-slate-800 line-clamp-2">
                          {item.product.title}
                        </h3>
                        {/* deleting button  */}
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-slate-400 hover:text-red-600 transition-all cursor-pointer"
                          title={t("removeItem")}
                        >
                          <i className="fa-solid fa-trash text-lg"></i>
                        </button>
                      </div>

                      <p className="text-sm text-slate-500">
                        {item.product.category.name} • {item.product.brand.name}
                      </p>
                      {/* rating starts  */}
                      <p className="text-slate-600 mt-1">
                        {Array.from({ length: 5 }).map((_, idx) => (
                          <span
                            key={idx}
                            className={`inline-flex items-center gap-2 ${
                              idx + 1 < item.product.ratingsAverage
                                ? "text-yellow-500"
                                : "text-gray-400"
                            } font-semibold text-sm`}
                          >
                            <i className="fas fa-star" />
                          </span>
                        ))}
                        <span className="mx-2">
                          {item.product.ratingsAverage}
                        </span>
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-slate-900 font-bold text-sm sm:text-lg">
                          {item.price} EGP
                        </span>
                        {/* count section  */}
                        <div className="flex items-center gap-3 text-sm sm:text-lg">
                          {/* decrease button  */}
                          <button
                            onClick={() => {
                              if (item.count > 1) {
                                updateCart(item.product.id, item.count - 1);
                                item.count -= 1;
                                setTotal(total - item.price);
                              } else removeItem(item.product.id);
                            }}
                            className={`cursor-pointer w-8 h-8 rounded-full font-bold ${
                              item.count === 1
                                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                : "bg-slate-100 text-slate-800 hover:bg-slate-200"
                            } transition-all`}
                          >
                            −
                          </button>

                          <span className="text-slate-700 font-medium">
                            {item.count}
                          </span>
                          {/* increase button  */}
                          <button
                            onClick={() => {
                              updateCart(item.product.id, item.count + 1);
                              item.count += 1;
                              setTotal(total + item.price);
                            }}
                            className="cursor-pointer w-8 h-8 rounded-full bg-slate-100 text-slate-800 font-bold hover:bg-slate-200"
                          >
                            +
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Checkout Summary */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <div>
                  <div className="bg-white shadow-lg rounded-2xl p-6 border border-slate-100">
                    <h3 className="text-2xl font-bold text-slate-800 mb-4">
                      {t("orderSummary")}
                    </h3>
                    <div className="flex justify-between text-slate-600 mb-3">
                      <span>{t("subtotal")}</span>
                      <span>{total} EGP</span>
                    </div>
                    <div className="flex justify-between text-slate-600 mb-3">
                      <span>{t("shipping")}</span>
                      <span>{t("free")}</span>
                    </div>
                    <hr className="my-4 border-slate-200" />
                    <div className="flex justify-between text-slate-900 font-bold text-lg mb-6">
                      <span>{t("total")}</span>
                      <span>{total} EGP</span>
                    </div>
                    <button onClick={() => setShowForm((prev) => !prev)} className="w-full cursor-pointer bg-slate-800 text-white py-3 rounded-xl text-lg font-semibold hover:bg-slate-700 transition-all shadow-md">
                    {showForm ? t('HideBtn') : t('checkoutBtn')}
                    </button>
                  </div>
                </div>
                {showForm && <CheckoutForm cartId={sessionId} />}
              </motion.div>

              
            </div>
          </>
        )}
      </div>
    </div>
  );
}
