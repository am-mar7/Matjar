import { useLocation, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function OrderDetails() {
  const { state: order } = useLocation();
  const { t } = useTranslation();

  if (!order) {
    return (
      <div className="p-10 text-center text-slate-500 bg-slate-50 min-h-screen flex items-center justify-center">
        {t("dashboard.noOrderFound")}
      </div>
    );
  }

  return (
    <div className="py-6 lg:p-10 bg-slate-50 min-h-screen text-slate-800">
      {/* Header */}
      <div className="flex gap-5 flex-col sm:flex-row sm:justify-between sm:items-center border-b border-slate-200 pb-4 mb-8">
        <h1 className="text-lg sm:text-2xl font-semibold text-emerald-600">
          {t("dashboard.orderDetails")}
        </h1>
        <Link
          to="/admin/orders"
          className="text-sm text-emerald-600 hover:text-emerald-500 transition"
        >
          ← {t("dashboard.backToOrders")}
        </Link>
      </div>

      {/* Info sections */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* User Info */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">
            {t("dashboard.userInfo")}
          </h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">{t("dashboard.name")}:</span> {order.user.name}</p>
            <p><span className="font-medium">{t("dashboard.email")}:</span> {order.user.email}</p>
            <p><span className="font-medium">{t("dashboard.phone")}:</span> {order.user.phone}</p>
          </div>
        </section>

        {/* Shipping Info */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">
            {t("dashboard.shippingInfo")}
          </h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">{t("dashboard.address")}:</span> {order.shippingAddress.details}</p>
            <p><span className="font-medium">{t("dashboard.city")}:</span> {order.shippingAddress.city}</p>
            <p><span className="font-medium">{t("dashboard.phone")}:</span> {order.shippingAddress.phone}</p>
          </div>
        </section>

        {/* Payment Info */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">
            {t("dashboard.paymentInfo")}
          </h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">{t("dashboard.method")}:</span> {order.paymentMethodType}</p>
            <p><span className="font-medium">{t("dashboard.paid")}:</span> {order.isPaid ? t("dashboard.yes") : t("dashboard.no")}</p>
            <p><span className="font-medium">{t("dashboard.delivered")}:</span> {order.isDelivered ? t("dashboard.yes") : t("dashboard.no")}</p>
            <p><span className="font-medium">{t("dashboard.paidAt")}: </span> {order.paymentMethodType === 'cash' ? '----' :new Date(order.paidAt).toLocaleString()}</p>
          </div>
        </section>

        {/* Summary */}
        <section className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-emerald-600 mb-3">
            {t("dashboard.summary")}
          </h2>
          <div className="space-y-1 text-sm">
            <p><span className="font-medium">{t("dashboard.tax")}:</span> ${order.taxPrice}</p>
            <p><span className="font-medium">{t("dashboard.shipping")}:</span> ${order.shippingPrice}</p>
            <p><span className="font-medium">{t("dashboard.total")}:</span> ${order.totalOrderPrice}</p>
          </div>
        </section>
      </div>

      {/* Cart Items */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-emerald-600 mb-4">
          {t("dashboard.items")}
        </h2>
        <div className="space-y-4">
          {order.cartItems.map((item: any, idx: number) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center gap-4 border-b border-slate-100 pb-3"
            >
              <img
                src={item.product.imageCover}
                alt={item.product.title}
                className="w-16 h-16 rounded-lg object-cover ring-1 ring-slate-200"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-800">{item.product.title}</p>
                <p className="text-sm text-slate-500">
                  {item.product.brand?.name} • {item.product.category?.name}
                </p>
              </div>
              <p className="font-semibold text-emerald-600">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
