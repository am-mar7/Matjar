import { useFormik } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { useCart } from "../Context/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

type CheckoutFormProps = {
  cartId: string;
};

type FormValues = {
  details: string;
  city: string;
  phone: string;
  paymentMethod: "paypal" | "cash";
};

export default function CheckoutForm({ cartId }: CheckoutFormProps) {
  const { createCheckoutSession, createCashOrder } = useCart();
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()

  async function handlePay(values: FormValues) {
    const shippingAddress = {
      details: values.details,
      city: values.city,
      phone: values.phone,
    };

    try {
      setLoading(true);

      if (values.paymentMethod === "paypal") {
        const res = await createCheckoutSession(cartId, shippingAddress);
        if (res?.status === "success") {
          window.location.href = res.session.url;
        }
      } else {
        // cash on delivery flow
        const res = await createCashOrder(cartId, shippingAddress);
        if (res?.status === "success") {
            navigate('/')
        }
        console.log("cash order result", res);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const formik = useFormik<FormValues>({
    initialValues: {
      details: "",
      city: "",
      phone: "",
      paymentMethod: "paypal",
    },
    validationSchema: Yup.object({
      details: Yup.string()
        .min(5, t("validation.addressMin"))
        .required(t("validation.addressRequired")),
      city: Yup.string().required(t("validation.cityRequired")),
      phone: Yup.string()
        .matches(/^01[0-9]{9}$/, t("validation.phoneInvalid"))
        .required(t("validation.phoneRequired")),
      paymentMethod: Yup.mixed().oneOf(["paypal", "cash"]).required(),
    }),
    onSubmit: handlePay,
  });

  return (
    <AnimatePresence mode="wait">
      <motion.form
        key="checkoutForm"
        onSubmit={formik.handleSubmit}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.4 }}
        className="mt-6 bg-white rounded-xl shadow-md p-5 space-y-4 border border-slate-200"
      >
        <h2 className="text-lg font-semibold text-slate-700">
          {t("checkout.title")}
        </h2>

        {/* Address */}
        <div>
          <label className="block mb-1 text-sm text-slate-600">
            {t("checkout.address")}
          </label>
          <input
            type="text"
            name="details"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.details}
            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-400"
            aria-invalid={Boolean(formik.touched.details && formik.errors.details)}
          />
          {formik.touched.details && formik.errors.details && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.details}</p>
          )}
        </div>

        {/* City */}
        <div>
          <label className="block mb-1 text-sm text-slate-600">
            {t("checkout.city")}
          </label>
          <input
            type="text"
            name="city"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.city}
            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-400"
            aria-invalid={Boolean(formik.touched.city && formik.errors.city)}
          />
          {formik.touched.city && formik.errors.city && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.city}</p>
          )}
        </div>

        {/* Phone */}
        <div>
          <label className="block mb-1 text-sm text-slate-600">
            {t("checkout.phone")}
          </label>
          <input
            type="tel"
            name="phone"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.phone}
            className="w-full border rounded-lg p-2 outline-none focus:ring-2 focus:ring-slate-400"
            aria-invalid={Boolean(formik.touched.phone && formik.errors.phone)}
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-red-500 text-sm mt-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* Payment method (radios) */}
        <fieldset className="mt-1">
          <legend className="text-sm text-slate-600 mb-2">
            {t("checkout.payment.label")}
          </legend>

          <div className="flex items-center gap-4">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="paypal"
                checked={formik.values.paymentMethod === "paypal"}
                onChange={formik.handleChange}
                className="form-radio"
              />
              <span className="text-sm">{t("checkout.payment.paypal")}</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="paymentMethod"
                value="cash"
                checked={formik.values.paymentMethod === "cash"}
                onChange={formik.handleChange}
                className="form-radio"
              />
              <span className="text-sm">{t("checkout.payment.cashOnDelivery")}</span>
            </label>
          </div>
        </fieldset>

        {/* Submit */}
        <div className="flex justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 disabled:opacity-50"
          >
            {loading ? t("checkout.processing") : t("checkout.proceed")}
          </button>
        </div>
      </motion.form>
    </AnimatePresence>
  );
}
