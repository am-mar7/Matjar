import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useMemo, useState } from "react";

import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Users, ShoppingBag, DollarSign, CheckCircle } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const StatCard = ({ icon, title, value, color }: any) => (
  <motion.div
    className={`p-6 font-bold text-white rounded-2xl bg-gradient-to-tl ${color} shadow-lg`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.45 }}
  >
    <div className="flex items-center justify-between">
      <div>
        <h3 className="text-sm text-slate-100/90">{title}</h3>
        <p className="text-3xl font-bold mt-2 text-slate-50">{value}</p>
      </div>
      <div className="p-3 bg-slate-900/20 rounded-xl">{icon}</div>
    </div>
  </motion.div>
);

export default function Dashboard() {
  const { t } = useTranslation();
  const [updateTime, setUpdateTime] = useState(6000);
  const [visibleCount, setVisibleCount] = useState(10);

  // 🧾 Fetch Orders
  const {
    data: orders,
    isLoading: isOrdersLoading,
    error: ordersError,
    isError: isOrdersError,
  } = useQuery({
    queryKey: ["Orders"],
    queryFn: () => axios.get("https://ecommerce.routemisr.com/api/v1/orders"),
    refetchInterval: updateTime,
    refetchIntervalInBackground: true,
  });

  // 🧑‍💻 Fetch Users
  const {
    data: users,
    isLoading: isUsersLoading,
    error: usersError,
    isError: isUsersError,
  } = useQuery({
    queryKey: ["Users"],
    queryFn: () => axios.get("https://ecommerce.routemisr.com/api/v1/users/"),
    refetchInterval: updateTime,
    refetchIntervalInBackground: true,
  });

  const allOrders = orders?.data?.data || [];
  const allUsers = users?.data?.users || [];

  const chartData = useMemo(() => {
    const monthCounts: Record<string, number> = {
      Jan: 0,
      Feb: 0,
      Mar: 0,
      Apr: 0,
      May: 0,
      Jun: 0,
      Jul: 0,
      Aug: 0,
      Sep: 0,
      Oct: 0,
      Nov: 0,
      Dec: 0,
    };

    allOrders.forEach((order: any) => {
      if (order.createdAt) {
        const date = new Date(order.createdAt);
        const month = date.toLocaleString("default", { month: "short" });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      }
    });

    return Object.entries(monthCounts).map(([month, count]) => ({
      month,
      count,
    }));
  }, [allOrders]);

  const totalOrders = orders?.data?.results || allOrders.length || 0;
  const totalUsers = users?.data?.totalUsers || allUsers.length || 0;

  const recentOrders = [...allOrders]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, visibleCount);

  const recentUsers = [...allUsers]
    .sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, visibleCount);

  // derived stats for StatCard
  console.log("all Orders", allOrders);

  const totalRevenue = allOrders.reduce(
    (sum: number, o: any) => sum + (Number(o.totalOrderPrice) || 0),
    0
  );

  const paidOrders = allOrders.filter((o: any) => o.isPaid).length;

  const paidPercent =
    totalOrders > 0 ? ((paidOrders / 40) * 100).toFixed(1) : "0.0";

  if (isUsersError || isOrdersError) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] text-center text-red-400 space-y-4">
        <div className="bg-red-900/30 border border-red-700 p-6 rounded-2xl max-w-md w-full">
          <h2 className="text-2xl font-semibold mb-2">
            ⚠️ {t("dashboard.errorTitle")}
          </h2>
          <p className="text-sm text-slate-900">
            {t("dashboard.errorMessage")}
          </p>
          <div className="mt-4 text-red-900 text-xs space-y-2">
            {ordersError && <p>{ordersError.message}</p>}
            {usersError && <p>{usersError.message}</p>}
          </div>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 bg-red-600 hover:bg-red-700 transition text-white cursor-pointer font-medium px-4 py-2 rounded-lg"
          >
            {t("dashboard.retry")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-50 text-slate-900">
      {/* Main Content */}
      <main className="flex-1 py-6 space-y-8">
        {/* Toggler for mobile */}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl font-semibold text-slate-800">
            {t("dashboard.heading")}
          </h1>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <label htmlFor="interval" className="text-slate-600 text-sm">
              {t("dashboard.refreshInterval")}
            </label>
            <input
              id="interval"
              type="number"
              value={updateTime / 100}
              onChange={(e) => setUpdateTime(Number(e.target.value) * 100)}
              className="max-w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t("dashboard.totalUsers")}
            value={
              isUsersLoading ? <span className="loader"></span> : totalUsers
            }
            color="from-sky-500 to-sky-700"
            icon={<Users size={28} className="text-sky-300" />}
          />
          <StatCard
            title={t("dashboard.totalOrders")}
            value={
              isOrdersLoading ? <span className="loader"></span> : totalOrders
            }
            color="from-purple-500 to-purple-800"
            icon={<ShoppingBag size={28} className="text-purple-300" />}
          />
          <StatCard
            title={t("dashboard.totalRevenue_last40")}
            value={
              isOrdersLoading ? (
                <span className="loader"></span>
              ) : (
                `$${totalRevenue.toLocaleString()}`
              )
            }
            color="from-emerald-500 to-emerald-800"
            icon={<DollarSign size={28} className="text-emerald-300" />}
          />
          <StatCard
            title={t("dashboard.paidOrders_last40")}
            value={
              isOrdersLoading ? (
                <span className="loader"></span>
              ) : (
                `${paidPercent}%`
              )
            }
            color="from-amber-500 to-amber-800"
            icon={<CheckCircle size={28} className="text-amber-300" />}
          />
        </div>

        {/* Chart */}
        <div className="bg-slate-100 p-5 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="text-lg mb-4 text-slate-800">
            {t("dashboard.monthlyOrders")}
          </h3>
          <div className="w-full overflow-x-auto">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="month" stroke="#475569" />
                <YAxis stroke="#475569" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    color: "#0f172a",
                  }}
                  labelStyle={{ color: "#0ea5a5" }}
                />
                <Line
                  type="monotone"
                  dataKey="count"
                  stroke="#0369a1"
                  strokeWidth={2}
                  activeDot={{ r: 6, fill: "#06b6d4" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Data header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center">
          <h3 className="text-lg text-slate-800">
            {t("dashboard.recentData")}
          </h3>
          <div className="flex items-center gap-2 text-sm">
            <label className="text-slate-600">{t("dashboard.show")}</label>
            <input
              type="number"
              min={5}
              value={visibleCount}
              onChange={(e) => setVisibleCount(Number(e.target.value))}
              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded text-slate-900 focus:outline-none"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
          {/* Users (flex-col cards) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto shadow-sm flex flex-col">
            <h4 className="text-slate-800 mb-3">
              🧑‍💻 {t("dashboard.recentUsers", { count: visibleCount })}
            </h4>
            {isUsersLoading ? (
              <div className="flex flex-col gap-3 max-h-[50rem] overflow-scroll scrollbar-hide pr-2">
                {Array.from({ length: 10 }).map((_, idx) => {
                  return (
                    <Skeleton
                      key={idx}
                      width={"100%"}
                      height={40}
                      className="rounded-2xl"
                    ></Skeleton>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[50rem] overflow-scroll scrollbar-hide pr-2">
                {recentUsers.map((u: any) => (
                  <div
                    key={u._id}
                    className="p-3 rounded-lg border border-slate-100 hover:shadow-md transition bg-white"
                  >
                    <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className="font-semibold text-slate-800">
                            {u.name || t("dashboard.unknown")}
                          </p>
                          <span className="text-xs text-slate-500">
                            ({u.role || "user"})
                          </span>
                        </div>
                        <p className="text-sm text-slate-600">{u.email}</p>
                      </div>
                      {/* date  */}
                      <p className="text-xs text-slate-500 mt-1">
                        {t("dashboard.joined")}:{" "}
                        {u.createdAt
                          ? new Date(u.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Orders (flex-col cards) */}
          <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto shadow-sm flex flex-col">
            <h4 className="text-slate-800 mb-3">
              📦 {t("dashboard.recentOrders", { count: visibleCount })}
            </h4>
            {isOrdersLoading ? (
              <div className="flex flex-col gap-3 max-h-[50rem] overflow-scroll scrollbar-hide pr-2">
                {Array.from({ length: 10 }).map((_, idx) => {
                  return (
                    <Skeleton
                      key={idx}
                      width={"100%"}
                      height={80}
                      className="rounded-4xl"
                    ></Skeleton>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col gap-3 max-h-[50rem] overflow-scroll scrollbar-hide pr-2">
                {recentOrders.map((o: any) => (
                  <div
                    key={o._id}
                    className="p-3 rounded-lg border border-slate-100 hover:shadow-md transition bg-white"
                  >
                    <Link to="/admin/orderdetails" state={o}>
                      {" "}
                      <div className="flex flex-col sm:flex-row justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-800">
                            {o.user?.name || t("dashboard.unknown")}
                          </p>
                          <p className="text-sm text-slate-600">
                            {t("dashboard.items")}:{" "}
                            {Array.isArray(o.cartItems)
                              ? o.cartItems.reduce(
                                  (acc: number, item: { count: number }) =>
                                    acc + (Number(item.count) || 0),
                                  0
                                )
                              : "-"}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">
                            {t("dashboard.address")}:{" "}
                            {o.shippingAddress?.address ||
                              o.shippingAddress?.details ||
                              "-"}
                          </p>
                          <p className="text-sm">
                            {t("dashboard.date")}:{" "}
                            <span className="text-slate-600">
                              {o.createdAt
                                ? new Date(o.createdAt).toLocaleDateString()
                                : "-"}
                            </span>
                          </p>
                        </div>

                        <div className="text-right flex flex-col items-end gap-1">
                          <p className="text-sm text-slate-600">
                            {t("dashboard.payment")}:{" "}
                            <span className="font-medium text-slate-800">
                              {o.paymentMethodType || "-"}
                            </span>
                          </p>
                          <p className="text-sm text-slate-600">
                            {t("dashboard.total")}:{" "}
                            <span className="font-medium text-slate-800">
                              ${o.totalOrderPrice}
                            </span>
                          </p>
                          <div className="mt-2">
                            {o.isPaid ? (
                              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-emerald-100 text-emerald-800">
                                {t("dashboard.paid")}
                              </span>
                            ) : (
                              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">
                                {t("dashboard.unpaid")}
                              </span>
                            )}
                            {o.orderStatus && (
                              <span className="ml-2 inline-block px-2 py-1 text-xs font-semibold rounded bg-slate-100 text-slate-800">
                                {o.orderStatus}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
