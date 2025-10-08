"use client";
import { useFormik } from "formik";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import axios from "axios";

export default function Login() {
  const { t , i18n} = useTranslation();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const navigator = useNavigate();
  const user = useContext(UserContext);
  const [showPassword, setShowPassword] = useState(false);
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("login.errors.invalidEmail"))
        .required(t("login.errors.emailRequired")),
      password: Yup.string().required(t("login.errors.passwordRequired")),
    }),
    onSubmit: handleLogin,
  });

  function handleLogin(values: { email: string; password: string }) {
    setLoading(true);

    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signin", values)
      .then(({ data }) => {
        user?.setUserName(data?.user?.name);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", JSON.stringify(data.user.name));
        localStorage.setItem("userEmail", JSON.stringify(values.email));
        navigator("/");
      })
      .catch((response) => {
        console.log(response);

        setApiError(response?.response?.data?.message);
      })
      .finally(() => setLoading(false));
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-slate-50 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {t("login.title")}
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              {...formik.getFieldProps("email")}
              className="peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-blue-900 placeholder-transparent focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
            <label
              htmlFor="email"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-slate-500 duration-300 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1"
            >
              {t("login.email")}
            </label>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <div className="py-1 m-0">
            <Link className="text-blue-600" to="/resetPassword">
              {t("login.forgetPassword")}
            </Link>
          </div>

          {/* Password */}
          <div className="relative">
            <input
              id="password"
              type={showPassword?"text":"password"}
              placeholder=" "
              {...formik.getFieldProps("password")}
              className="peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-slate-900 placeholder-transparent focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
            <i
              onClick={() => setShowPassword(!showPassword)}
              className={`fa ${
                showPassword ? "fa-eye-slash" : "fa-eye"
              } absolute ${i18n.dir() === 'ltr' ? 'right-3' :'left-3'} top-3 text-slate-500 cursor-pointer`}
            ></i>
            <label
              htmlFor="password"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-slate-500 duration-300 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1"
            >
              {t("login.password")}
            </label>
            {formik.touched.password && formik.errors.password && (
              <p className="mt-1 text-xs text-red-500">
                {formik.errors.password}
              </p>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="cursor-pointer w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition"
          >
            {loading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              t("login.submit")
            )}
          </button>
        </form>

        {/* Footer */}
        <p className="text-sm text-slate-600 mt-6 text-center">
          {t("login.noAccount")}{" "}
          <Link
            to="/signup"
            className="text-slate-900 font-semibold hover:underline"
          >
            {t("login.signup")}
          </Link>
        </p>

        {/* Error */}
        {apiError && (
          <p className="mt-4 rounded-md bg-red-100 p-2 text-center text-sm text-red-600">
            {apiError}
          </p>
        )}
      </div>
    </div>
  );
}
