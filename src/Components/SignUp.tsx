import { useContext, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { UserContext } from "../Context/UserContext";
import { useTranslation } from "react-i18next";
import i18n from "../i18next";
const superUserEmail = import.meta.env.VITE_SUPER_EMAIL

export default function SignUp() {
  const { t } = useTranslation();

  const yupSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("signup.errors.nameShort"))
      .max(20, t("signup.errors.nameLong"))
      .required(t("signup.errors.nameRequired")),
    email: Yup.string()
      .email(t("signup.errors.emailInvalid"))
      .required(t("signup.errors.emailRequired")),
    phone: Yup.string()
      .matches(/^01[0125][0-9]{8}$/, t("signup.errors.phoneInvalid"))
      .required(t("signup.errors.phoneRequired")),
    password: Yup.string()
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        t("signup.errors.passwordPattern")
      )
      .required(t("signup.errors.passwordRequired")),
    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], t("signup.errors.passwordMismatch"))
      .required(t("signup.errors.rePasswordRequired")),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      rePassword: "",
    },
    validationSchema: yupSchema,
    onSubmit: handleRegister,
  });

  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);
  const navigator = useNavigate();
  const user = useContext(UserContext);

  function handleRegister(values: {
    email: string;
    name: string;
    phone: string;
    password: string;
    rePassword: string;
  }) {
    setLoading(true);
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/signup", values)
      .then(({ data }) => {
        const role = data?.user?.email === superUserEmail ? "admin" : "user";
        user?.setUserName(data?.user?.name);
        user?.setRole(role);
        localStorage.setItem("userToken", data.token);
        localStorage.setItem("userName", data.user.name);
        localStorage.setItem("userEmail", values.email);        
        localStorage.setItem("role", role);        
        values.email === superUserEmail ? navigator("/Admin") : navigator("/");       
      })
      .catch((response) => {
        setApiError(response?.response?.data?.message || response.message);
      })
      .finally(() => setLoading(false));
  }

  const inputClass =
    "peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-slate-900 placeholder-transparent focus:border-blue-900 focus:ring-1 focus:ring-slate-900 focus:outline-none";

  const labelClass =
    "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-slate-50 px-1 text-sm text-slate-500 duration-300 " +
    "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 " +
    "peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1";

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        className="w-full max-w-md rounded-xl bg-slate-50 p-8 shadow-lg"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <h1 className="mb-6 text-center text-2xl font-bold text-slate-900">
          {t("signup.title")}
        </h1>

        {/* Name */}
        <div className="relative my-5">
          <input
            id="name"
            type="text"
            placeholder=" "
            {...formik.getFieldProps("name")}
            className={inputClass}
          />
          <label htmlFor="name" className={labelClass}>
            {t("signup.name")}
          </label>
          <p className="mt-1 text-xs text-red-500">
            {formik.touched.name && formik.errors.name}
          </p>
        </div>

        {/* Phone */}
        <div className="relative my-5">
          <input
            id="phone"
            type="tel"
            placeholder=" "
            {...formik.getFieldProps("phone")}
            className={inputClass}
          />
          <label htmlFor="phone" className={labelClass}>
            {t("signup.phone")}
          </label>
          <p className="mt-1 text-xs text-red-500">
            {formik.touched.phone && formik.errors.phone}
          </p>
        </div>

        {/* Email */}
        <div className="relative my-5">
          <input
            id="email"
            type="email"
            placeholder=" "
            {...formik.getFieldProps("email")}
            className={inputClass}
          />
          <label htmlFor="email" className={labelClass}>
            {t("signup.email")}
          </label>
          <p className="mt-1 text-xs text-red-500">
            {formik.touched.email && formik.errors.email}
          </p>
        </div>

        {/* Password */}
        <div className="relative my-5">
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder=" "
            {...formik.getFieldProps("password")}
            className={inputClass}
          />
          <i
            onClick={() => setShowPassword(!showPassword)}
            className={`fa ${
              showPassword ? "fa-eye-slash" : "fa-eye"
            } absolute ${i18n.dir() === 'ltr' ? 'right-3' : 'left-3'} top-3 text-slate-500 cursor-pointer`}
          ></i>
          <label htmlFor="password" className={labelClass}>
            {t("signup.password")}
          </label>
          <p className="mt-1 text-xs text-red-500">
            {formik.touched.password && formik.errors.password}
          </p>
        </div>

        {/* Confirm Password */}
        <div className="relative my-5">
          <input
            id="rePassword"
            type={showRePassword ? "text" : "password"}
            placeholder=" "
            {...formik.getFieldProps("rePassword")}
            className={inputClass}
          />
          <i
            onClick={() => setShowRePassword(!showRePassword)}
            className={`fa ${
              showRePassword ? "fa-eye-slash" : "fa-eye"
            } absolute ${i18n.dir() === 'ltr' ? 'right-3' : 'left-3'} top-3 text-slate-500 cursor-pointer`}
          ></i>
          <label htmlFor="rePassword" className={labelClass}>
            {t("signup.confirmPassword")}
          </label>
          <p className="mt-1 text-xs text-red-500">
            {formik.touched.rePassword && formik.errors.rePassword}
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="cursor-pointer mt-6 w-full rounded-lg bg-slate-900 py-2.5 text-white hover:bg-slate-800 focus:ring-2 focus:ring-slate-600 disabled:opacity-70"
        >
          {loading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            t("signup.submit")
          )}
        </button>

        {/* Link */}
        <p className="mt-4 text-center text-sm text-slate-600">
          {t("signup.haveAccount")}{" "}
          <Link
            to="/Login"
            className="font-semibold text-slate-900 hover:underline"
          >
            {t("signup.login")}
          </Link>
        </p>

        {/* Error */}
        {apiError && (
          <p className="mt-4 rounded-md bg-red-100 p-2 text-center text-sm text-red-600">
            {apiError}
          </p>
        )}
      </form>
    </div>
  );
}
