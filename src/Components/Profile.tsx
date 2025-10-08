import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { UserContext } from "../Context/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";

export default function Profile() {
  const { t } = useTranslation();
  const userCtx = useContext(UserContext);
  const navigator = useNavigate();
  const [editingName, setEditingName] = useState(false);
  const [editingEmail, setEditingEmail] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [passwordApiError, setPasswordApiError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [profile, setProfile] = useState({
    name:
      userCtx?.userName ||
      (localStorage.getItem("userName")
        ? JSON.parse(localStorage.getItem("userName")!)
        : ""),
    email: localStorage.getItem("userEmail")
      ? JSON.parse(localStorage.getItem("userEmail")!)
      : "",
  });
  const headers = {
    token: localStorage.getItem("userToken")
      ? localStorage.getItem("userToken")
      : "",
  };
  const yupSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, t("signup.errors.nameShort"))
      .max(20, t("signup.errors.nameLong"))
      .required(t("signup.errors.nameRequired")),
    email: Yup.string()
      .email(t("signup.errors.emailInvalid"))
      .required(t("signup.errors.emailRequired")),
  });
  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string().required(t("profile.errors.currentRequired")),

    password: Yup.string()
      .min(8, t("signup.errors.passwordPattern"))
      .notOneOf([Yup.ref("currentPassword")], t("profile.errors.passwordSame")) // 👈 الشرط الجديد
      .required(t("profile.errors.newRequired")),

    rePassword: Yup.string()
      .oneOf([Yup.ref("password")], t("profile.errors.passwordMatch"))
      .required(t("profile.errors.confirmRequired")),
  });
  const formik = useFormik({
    initialValues: { name: profile.name, email: profile.email },
    validationSchema: yupSchema,
    onSubmit: handleUpdate,
  });
  const changePasswordFormik = useFormik({
    initialValues: {
      currentPassword: "",
      password: "",
      rePassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: handleChangePassword,
  });

  function handleLogout() {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    userCtx?.setUserName(null);
    navigator("/");
  }

  function handleUpdate(values: {
    name?: string;
    email?: string;
    phone?: string;
  }) {
    console.log(localStorage.getItem("userToken"));
    console.log(values);
    setLoading(true);
    axios
      .put("https://ecommerce.routemisr.com/api/v1/users/updateMe/", values, {
        headers,
      })
      .then(({ data }) => {
        localStorage.setItem("userName", JSON.stringify(data.user.name));
        localStorage.setItem("userEmail", JSON.stringify(data.user.email));
        userCtx?.setUserName(data.user.name);
        setProfile({ name: data.user.name, email: data.user.email });
      })
      .catch(({ response }) => {
        console.log(response.data);
        setApiError(response.data?.errors?.msg);
      })
      .finally(() => {
        setEditingName(false);
        setEditingEmail(false);
        setLoading(false);
      });
  }

  function handleChangePassword(values: {
    currentPassword: string;
    password: string;
    rePassword: string;
  }) {
    console.log("aloooooooooooooo", values);
    setLoading(true);
    axios
      .put(
        "https://ecommerce.routemisr.com/api/v1/users/changeMyPassword",
        values,
        { headers }
      )
      .then(({ data }) => {
        console.log(data);
        localStorage.setItem("userToken", data.token);
        setPasswordApiError(null);
      })
      .catch(({ response }) => {
        console.log(response, response?.data?.errors?.msg);
        setPasswordApiError(response?.data?.errors?.msg);
      })
      .finally(() => {
        setLoading(false);
        resetPasswordForm();
      });
  }

  function resetPasswordForm() {
    changePasswordFormik.values.currentPassword = "";
    changePasswordFormik.values.password = "";
    changePasswordFormik.values.rePassword = "";
    changePasswordFormik.touched.password = false;
    changePasswordFormik.touched.rePassword = false;
    changePasswordFormik.touched.currentPassword = false;
    setShowPasswordForm(false);
  }
  useEffect(() => {
    console.log(profile.name.slice(1 , profile.name.length-1));
  }, [profile.name]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-lg overflow-hidden md:flex flex-col md:flex-row">
        {/* LEFT SECTION */}
        <div className="md:w-1/3 bg-slate-100 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-200">
          <h2 className="text-lg  sm:text-2xl font-bold text-slate-900 mb-3">
            {t("profile.welcomeBack", {
              name:
                profile.name[0] === '"'
                  ? profile.name.slice(1, profile.name.length - 1)
                  : profile.name || t("profile.user"),
            })}
          </h2>
          <p className="text-sm text-slate-600 mb-6">{t("profile.subtitle")}</p>

          <nav className="space-y-3">
            <Link
              to="/cart"
              className="flex items-center gap-3 rounded-lg p-3 bg-white hover:bg-slate-50 border border-slate-200 transition-all"
            >
              <i className="fa fa-shopping-cart text-slate-700"></i>
              <span className="font-medium text-slate-800">
                {t("profile.cart")}
              </span>
            </Link>

            <Link
              to="/favorites"
              className="flex items-center gap-3 rounded-lg p-3 bg-white hover:bg-slate-50 border border-slate-200 transition-all"
            >
              <i className="fa fa-heart text-rose-600"></i>
              <span className="font-medium text-slate-800">
                {t("profile.wishlist")}
              </span>
            </Link>
          </nav>

          <div className="mt-8">
            <button
              onClick={handleLogout}
              className="cursor-pointer w-full rounded-lg bg-red-500 text-white py-2 hover:bg-red-600 transition-colors"
            >
              {t("profile.logout")}
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="md:w-2/3 p-4 sm:p-6 md:p-8 overflow-auto">
          <h3 className="text-xl font-semibold text-slate-900 mb-4">
            {t("profile.accountInfo")}
          </h3>

          {/* NAME */}
          <div className="bg-white border rounded-lg p-4 sm:p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-300 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1 w-full">
                <div className="text-sm text-slate-500">
                  {t("profile.labels.name")}
                </div>
                {editingName ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 w-full">
                    <input
                      type="text"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      name="name"
                      className="w-full sm:flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                    {/*save and cancel buttons*/}
                    <div className="flex gap-1.5 my-2 sm:my-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate({ name: formik.values.name })
                        }
                        className="cursor-pointer px-4 py-2 text-sm sm:text-md rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          t("profile.saveBtn")
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingName(false);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm sm:text-md rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-shrink-0"
                      >
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-slate-900 text-lg font-semibold truncate w-full">
                    {profile.name[0] === '"' ? profile.name.slice(1 , profile.name.length-1) : profile.name  || (
                      <span className="text-slate-400">
                        {t("profile.notSet")}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!editingName && (
                <button
                  onClick={() => setEditingName(true)}
                  className="cursor-pointer text-slate-500 hover:text-slate-800 transition flex-shrink-0 mt-2 sm:mt-0"
                >
                  <i className="fa fa-pen"></i>
                </button>
              )}
            </div>
          </div>

          {/* EMAIL */}
          <div className="bg-white border rounded-lg p-4 sm:p-5 mb-5 shadow-sm hover:shadow-md transition-all duration-300 w-full">
            <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
              <div className="flex-1 w-full">
                <div className="text-sm text-slate-500">
                  {t("profile.labels.email")}
                </div>
                {editingEmail ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-2 w-full">
                    <input
                      type="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      name="email"
                      className="w-full sm:flex-1 border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                    {/* save and cancel buttons  */}
                    <div className="flex gap-1.5 my-2 sm:my-0">
                      <button
                        type="button"
                        onClick={() =>
                          handleUpdate({ email: formik.values.email })
                        }
                        className="cursor-pointer px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex-shrink-0"
                      >
                        {loading ? (
                          <i className="fas fa-spinner fa-spin"></i>
                        ) : (
                          t("profile.saveBtn")
                        )}
                      </button>

                      <button
                        onClick={() => {
                          setEditingEmail(false);
                        }}
                        className="cursor-pointer px-4 py-2 text-sm sm:text-md rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-shrink-0"
                      >
                        {t("profile.cancel")}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-1 text-slate-900 text-lg font-semibold truncate w-full">
                    {profile.email || (
                      <span className="text-slate-400">
                        {t("profile.notSet")}
                      </span>
                    )}
                  </div>
                )}
              </div>

              {!editingEmail && (
                <button
                  onClick={() => setEditingEmail(true)}
                  className="cursor-pointer text-slate-500 hover:text-slate-800 transition flex-shrink-0 mt-2 sm:mt-0"
                >
                  <i className="fa fa-pen "></i>
                </button>
              )}
            </div>
          </div>

          {/* Email API Error */}
          {apiError && (
            <div className="mb-4 rounded-md bg-red-100 p-3 text-sm text-red-600 border border-red-200">
              {apiError}
            </div>
          )}

          {/* CHANGE PASSWORD */}
          <div className="mt-4">
            <button
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              className="cursor-pointer text-blue-600 hover:text-blue-800 font-medium transition-colors"
            >
              {t("profile.changePassword")}
            </button>

            {showPasswordForm && (
              <form onSubmit={changePasswordFormik.handleSubmit}>
                <div className="mt-4 bg-slate-50 p-4 sm:p-5 rounded-xl space-y-3 border border-slate-200 shadow-sm transition-all duration-300 w-full">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="currentPassword"
                      id="currentPassword"
                      value={changePasswordFormik.values.currentPassword}
                      onChange={changePasswordFormik.handleChange}
                      onBlur={changePasswordFormik.handleBlur}
                      placeholder={t("profile.placeholders.currentPassword")}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                    <i
                      onClick={() => setShowPassword(!showPassword)}
                      className={`fa ${
                        showPassword ? "fa-eye-slash" : "fa-eye"
                      } absolute right-3 top-3 text-slate-500 cursor-pointer`}
                    ></i>
                  </div>
                  {changePasswordFormik.touched.currentPassword &&
                    changePasswordFormik.errors.currentPassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {changePasswordFormik.errors.currentPassword}
                      </p>
                    )}
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="password"
                      id="password"
                      value={changePasswordFormik.values.password}
                      onChange={changePasswordFormik.handleChange}
                      onBlur={changePasswordFormik.handleBlur}
                      placeholder={t("profile.placeholders.password")}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                    <i
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className={`fa ${
                        showNewPassword ? "fa-eye-slash" : "fa-eye"
                      } absolute right-3 top-3 text-slate-500 cursor-pointer`}
                    ></i>
                  </div>
                  {changePasswordFormik.touched.password &&
                    changePasswordFormik.errors.password && (
                      <p className="mt-1 text-xs text-red-500">
                        {changePasswordFormik.errors.password}
                      </p>
                    )}

                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="rePassword"
                      id="rePassword"
                      value={changePasswordFormik.values.rePassword}
                      onChange={changePasswordFormik.handleChange}
                      onBlur={changePasswordFormik.handleBlur}
                      placeholder={t("profile.placeholders.rePassword")}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-600"
                    />
                    <i
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className={`fa ${
                        showConfirmPassword ? "fa-eye-slash" : "fa-eye"
                      } absolute right-3 top-3 text-slate-500 cursor-pointer`}
                    ></i>
                  </div>
                  {changePasswordFormik.touched.rePassword &&
                    changePasswordFormik.errors.rePassword && (
                      <p className="mt-1 text-xs text-red-500">
                        {changePasswordFormik.errors.rePassword}
                      </p>
                    )}
                  {/* save and cancel buttons  */}
                  <div className="flex gap-1.5 my-2 sm:my-0">
                    <button
                      type="submit"
                      className="cursor-pointer sm:w-auto bg-blue-600 text-white rounded-lg px-6 py-2 hover:bg-blue-700 transition-colors"
                    >
                      {loading ? (
                        <i className="fas fa-spinner fa-spin"></i>
                      ) : (
                        t("profile.saveBtn")
                      )}
                    </button>

                    <button
                      onClick={resetPasswordForm}
                      className="cursor-pointer px-4 py-2 text-sm sm:text-md rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors flex-shrink-0"
                    >
                      {t("profile.cancel")}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {passwordApiError && (
              <div className="my-4 rounded-md bg-red-100 p-3 text-sm text-red-600 border border-red-200">
                {passwordApiError}
              </div>
            )}
          </div>

          <p className="text-sm text-slate-500 mt-6">{t("profile.hint")}</p>
        </div>
      </div>
    </div>
  );
}
