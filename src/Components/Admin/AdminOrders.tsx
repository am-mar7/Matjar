import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import Skeleton from "react-loading-skeleton";
import { Loader2 } from "lucide-react";
import { Link } from "react-router-dom";


export default function AdminOrders() {
  const { t } = useTranslation();
  const [updateTime, setUpdateTime] = useState(30000);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(40);
  let {
    data: orders,
    isLoading: isOrdersLoading,
    error: ordersError,
    isError: isOrdersError,
    isFetching,
  } = useQuery({
    queryKey: ["Orders", page, pageSize],
    queryFn: () =>
      axios.get(
        `https://ecommerce.routemisr.com/api/v1/orders?page=${page}&&limit=${pageSize}`
      ),
    refetchInterval: updateTime,
    refetchIntervalInBackground: true,
  });
  console.log("page size", pageSize, orders?.data.metadata);

  const totalPages = orders?.data?.metadata?.numberOfPages;
  if (isOrdersError) {
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
    <div className="py-5">
      <div className="flex justify-center">
        <div className="max-w-7xl w-full ">
          <div className="flex flex-col sm:flex-row w-full justify-between">
            {/* title  */}
            <div className="py-5">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
                {t("dashboard.totalOrders")}
              </h1>
              <div className="mt-2 text-sm text-slate-600 flex items-center gap-3">
                <span className="rounded px-2 py-1 bg-slate-100 text-slate-800 font-medium">
                  {isOrdersLoading || isFetching ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="animate-spin" size={14} />{" "}
                      {t("dashboard.loading")}
                    </span>
                  ) : (
                    `${orders?.data.results} ${t("dashboard.results") ?? ""}`
                  )}
                </span>
                {/* fetch status small badge */}
                {isFetching && !isOrdersLoading && (
                  <span className="text-xs text-slate-500">
                    · {t("dashboard.updating")}
                  </span>
                )}
              </div>
            </div>
            <div className="flex gap-4 sm:gap-6 items-center justify-center "></div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4 sm:mt-0 my-5 sm:my-10">
              <label className="flex items-center gap-2">
                <span className="text-sm">Show</span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="ml-2 py-1 bg-white border border-slate-400 px-2 rounded text-sm"
                  aria-label="Page size"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={40}>40</option>
                  <option value={50}>50</option>
                </select>
              </label>
              <div className="flex gap-2 items-center">
                <label htmlFor="interval" className="text-slate-600 text-sm">
                  {t("dashboard.refreshInterval")}
                </label>
                <input
                  id="interval"
                  type="number"
                  value={updateTime / 100}
                  onChange={(e) => setUpdateTime(Number(e.target.value) * 100)}
                  className="max-w-20 px-2 py-1 bg-white border border-slate-400 rounded text-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1">
            {/* Orders (flex-col cards) */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 overflow-x-auto shadow-sm flex flex-col">
              {isOrdersLoading ? (
                <div className="flex flex-col gap-3  overflow-scroll scrollbar-hide pr-2">
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
                <div className="flex flex-col gap-3 overflow-scroll scrollbar-hide pr-2">
                  {orders?.data?.data.map((o: any) => (
                    <div
                      key={o._id}
                      className="p-3 rounded-lg border border-slate-100 hover:shadow-md transition bg-white"
                    >
                      <Link to='/admin/orderdetails' state={o}>
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

                          <div className="text-right flex flex-col sm:items-end gap-1">
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
        </div>
      </div>
      {/* pagination  */}
      <div className="flex justify-center gap-2 my-5">
        <button
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
          className="cursor-pointer px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-200"
        >
          {t("dashboard.prev")}
        </button>
        <p className="cursor-pointer px-4 py-2 border rounded-md disabled:opacity-50 hover:bg-slate-200">
          {page}
        </p>
        <button
          disabled={page === totalPages}
          onClick={() => {
            setPage((p) => p + 1);
          }}
          className="px-4 cursor-pointer py-2 border rounded-md disabled:opacity-50 hover:bg-slate-200"
        >
          {t("dashboard.next")}
        </button>
      </div>
    </div>
  );
}
