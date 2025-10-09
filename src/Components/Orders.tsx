import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { AnimatePresence, motion } from "framer-motion";

type CartItem = {
  count: number;
  _id: string;
  price: number;
  product: {
    id: string;
    imageCver?: string;
    imageCover?: string;
    title: string;
  };
  id: string;
};

type OrderType = {
  _id?: string;
  createdAt?: string;
  status?: string;
  cartItems?: CartItem[];
  totalOrderPrice?: number;
  paymentMethodType?: string;
  shippingAddress?: {
    city?: string;
    details?: string;
    phone?: string;
  };
};

export default function Orders() {
  const { t } = useTranslation();

  const [cartOwner, setCartOwner] = useState<string | null | undefined>(
    undefined
  );
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  async function getCartOwner(token: string) {
    try {
      const { data } = await axios.get(
        "https://ecommerce.routemisr.com/api/v1/auth/verifyToken",
        { headers: { token } }
      );
      // res may be object { cartOwner: "id", ... } depending on your API
      setCartOwner(data?.decoded?.id || null);
      console.log(data);
    } catch (error) {
      console.error("getCartOwner error", error);
    }
  }

  async function getOrders(cartOwnerId: string) {
    try {
      const { data } = await axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders/user/${cartOwnerId}`,
        {
          headers: { token: localStorage.getItem("userToken") || "" },
        }
      );
      // data might be { data: [...] } or array directly
      console.log(data);
      const ordersArr = Array.isArray(data) ? data : data?.data ?? [];
      setOrders(ordersArr);
    } catch (error) {
      console.error("getOrders error", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("userToken");
    if (token) {
      getCartOwner(token);
    }
  }, []);

  useEffect(() => {
    if (cartOwner) {
      getOrders(cartOwner);
    }
  }, [cartOwner]);

  // Not logged in
  if (!localStorage.getItem("userToken")) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[80vh] text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.35 }}
          className="bg-white/70 backdrop-blur-md shadow-2xl rounded-2xl p-10 max-w-md w-full border border-slate-200"
        >
          <div className="flex justify-center mb-6">
            <div className="bg-slate-100 rounded-full p-6 shadow-inner">
              <i className="fa-solid fa-user-lock text-5xl text-slate-600"></i>
            </div>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 mb-4 tracking-tight">
            {t("orders.notLoggedTitle")}
          </h2>
          <p className="text-slate-600 mb-8 leading-relaxed text-base">
            {t("orders.notLoggedDesc")}
          </p>
          <Link
            to="/login"
            className="inline-block px-10 py-3 bg-slate-800 text-white text-lg font-semibold rounded-xl hover:bg-slate-700 active:scale-95 transition-all duration-300 shadow-md"
          >
            {t("orders.goToLogin")}
          </Link>
          <p className="text-slate-400 text-sm mt-6">
            {t("orders.noAccount")}{" "}
            <Link
              to="/signup"
              className="text-slate-700 font-semibold hover:underline"
            >
              {t("orders.signUpHere")}
            </Link>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl shadow-md p-5">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Skeleton height={20} width="30%" />
                    <div className="mt-3">
                      <Skeleton height={14} width="50%" />
                    </div>
                  </div>
                  <div className="w-36">
                    <Skeleton height={30} width="100%" />
                  </div>
                </div>
                <div className="mt-4">
                  <Skeleton height={80} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No orders */}
        {!loading && orders && orders.length === 0 && (
          <div className="bg-white rounded-2xl p-10 shadow-md text-center">
            <div className="text-slate-600 mb-4">
              <i className="fa-regular fa-box-open text-4xl" />
            </div>
            <h2 className="text-2xl font-semibold text-slate-800 mb-2">
              {t("orders.noOrdersTitle")}
            </h2>
            <p className="text-slate-500 mb-6">{t("orders.noOrdersDesc")}</p>
            <Link
              to="/products"
              className="inline-block px-6 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
            >
              {t("orders.shopNow")}
            </Link>
          </div>
        )}

        {/* Orders list (single-column grid) */}
        {!loading && orders && orders.length > 0 && (
          <div className="max-w-7xl">
            <h1 className="text-3xl font-bold text-slate-800 mb-6">
              {t("orders.title")}
            </h1>
            <div className="grid grid-cols-1 gap-6">
              {orders.map((order: any , idx) => {
                const id =
                  order._id ??
                  order.id ??
                  order.cartOwner ??
                  Math.random().toString();
                const createdAt =
                  order.createdAt ?? order.createdAtDate ?? order.date ?? "";
                const status =
                  order.status ?? (order.isPaid ? "paid" : "pending");
                const items: CartItem[] =
                  order.cartItems && Array.isArray(order.cartItems)
                    ? order.cartItems
                    : order.items && Array.isArray(order.items)
                    ? order.items
                    : [];
                const total =
                  order.totalOrderPrice ??
                  order.total ??
                  // fallback: sum item.price * count
                  items.reduce(
                    (s, it) => s + (it.price ?? 0) * (it.count ?? 0),
                    0
                  );

                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white rounded-2xl shadow-md p-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-6">
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <div className="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm">
                              {t(`orders.status.${status}`) || status}
                            </div>
                            <div>
                              <div className="text-slate-800 font-semibold">
                                {t("orders.orderId")}:{" "}
                                <span className="font-medium text-slate-600">
                                  {idx+1}
                                </span>
                              </div>
                              <div className="text-sm text-slate-500">
                                {t("orders.placedOn")}:{" "}
                                {createdAt
                                  ? new Date(createdAt).toLocaleString()
                                  : "-"}
                              </div>
                            </div>
                          </div>

                          <div className="text-right flex gap-5 sm:block">
                            <div className="text-slate-900 font-bold">
                              {t("orders.total")}: {total} EGP
                            </div>
                            <div className="text-sm text-slate-500">
                              {items.length} {t("orders.items")}
                            </div>
                          </div>
                        </div>

                        {/* expandable details */}
                        <AnimatePresence initial={false}>
                          {expandedId === id && (
                            <motion.div
                              key="details"
                              initial={{ opacity: 0, height: 0, y: -10 }}
                              animate={{ opacity: 1, height: "auto", y: 0 }}
                              exit={{ opacity: 0, height: 0, y: 0 }}
                              transition={{ duration: 0.2 }}
                              className="mt-4 border-t pt-4 overflow-hidden"
                            >
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {/* Left section – items */}
                                <div className="md:col-span-2 space-y-3">
                                  {items.map((it) => (
                                    <motion.div
                                      key={it._id || it.id || it.product?.id}
                                      initial={{ opacity: 0, y: 5 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      transition={{ duration: 0.25 }}
                                      className="flex items-center gap-4 bg-slate-50 rounded-lg p-3"
                                    >
                                      <img
                                        src={
                                          it.product?.imageCover ??
                                          it.product?.imageCver ??
                                          "/placeholder.png"
                                        }
                                        alt={it.product?.title}
                                        className="w-16 h-16 object-cover rounded-md"
                                      />
                                      <div className="flex-1">
                                        <div className="font-semibold text-slate-800">
                                          {it.product?.title}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                          {it.count} × {it.price} EGP
                                        </div>
                                      </div>
                                    </motion.div>
                                  ))}
                                </div>

                                {/* Right section – shipping & payment */}
                                <motion.div
                                  initial={{ opacity: 0, y: 5 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ duration: 0.25, delay: 0.1 }}
                                  className="space-y-3"
                                >
                                  <div>
                                    <div className="text-sm text-slate-500">
                                      {t("orders.shippingAddress")}
                                    </div>
                                    <div className="text-sm text-slate-700">
                                      {order.shippingAddress?.details ?? "-"}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                      {order.shippingAddress?.city ?? "-"}
                                    </div>
                                    <div className="text-sm text-slate-500">
                                      {order.shippingAddress?.phone ?? "-"}
                                    </div>
                                  </div>

                                  <div>
                                    <div className="text-sm text-slate-500">
                                      {t("orders.paymentMethod")}
                                    </div>
                                    <div className="text-sm text-slate-700">
                                      {order.paymentMethodType ??
                                        order.paymentMethod ??
                                        "-"}
                                    </div>
                                  </div>
                                </motion.div>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              setExpandedId(expandedId === id ? null : id)
                            }
                            className="text-sm px-3 py-2 cursor-pointer rounded-md bg-slate-800 text-white hover:bg-slate-700"
                          >
                            {expandedId === id
                              ? t("orders.hideDetails")
                              : t("orders.viewDetails")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
