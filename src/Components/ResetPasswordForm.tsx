import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useTranslation } from "react-i18next";

export default function ResetPasswordForm() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email; // ✅ Safe optional typing
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required"),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const formik = useFormik({
    initialValues: {
      password: "",
      rePassword: "",
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  function handleSubmit(values: {
    password: string;
    rePassword: string;
    email?: string;
  }) {
    console.log(email);
    const data = {
      newPassword: values.password,
      email: email,
    };
    setLoading(true);
    axios
      .put("https://ecommerce.routemisr.com/api/v1/auth/resetPassword", data)
      .then(({ data }) => {
        console.log(data);
        navigate("/login");
      })
      .catch((response) => {
        console.log(response);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    if (!email) {
      // Prevent direct access without email
      navigate("/resetPassword");
    }
  }, [email, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={formik.handleSubmit}
        className="w-full max-w-md bg-slate-50 p-8 rounded-xl shadow-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6 text-slate-900">
          {t("resetPasswordForm.title")}
        </h1>

        {/* New Password */}
        <div className="relative my-5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            {...formik.getFieldProps("password")}
            className="peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-slate-900 placeholder-transparent focus:border-blue-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`fa ${
              showPassword ? "fa-eye-slash" : "fa-eye"
            } absolute ${
              i18n.dir() === "ltr" ? "right-3" : "left-3"
            } top-3 text-slate-500 cursor-pointer`}
          ></i>
          <label
            htmlFor="password"
            className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-slate-50 px-1 text-sm text-slate-500 duration-300 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 
            peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1"
          >
            {t("resetPasswordForm.newPassword")}
          </label>
          {formik.touched.password && formik.errors.password && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.password}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="relative my-5">
          <input
            id="rePassword"
            type={showRePassword ? "text" : "password"}
            placeholder=" "
            {...formik.getFieldProps("rePassword")}
            className="peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-slate-900 placeholder-transparent focus:border-blue-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
          />
          <i
            onClick={() => setShowRePassword(!showRePassword)}
            className={`fa ${
              showRePassword ? "fa-eye-slash" : "fa-eye"
            } absolute ${
              i18n.dir() === "ltr" ? "right-3" : "left-3"
            } top-3 text-slate-500 cursor-pointer`}
          ></i>
          <label
            htmlFor="rePassword"
            className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-slate-50 px-1 text-sm text-slate-500 duration-300 
            peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 
            peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1"
          >
            {t("resetPasswordForm.confirmPassword")}
          </label>
          {formik.touched.rePassword && formik.errors.rePassword && (
            <p className="mt-1 text-xs text-red-500">
              {formik.errors.rePassword}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="cursor-pointer w-full mt-6 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            t("resetPasswordForm.submit")
          )}
        </button>
      </form>
    </div>
  );
}
