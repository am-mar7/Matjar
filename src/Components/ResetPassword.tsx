"use client";
import { useRef, useState, useEffect } from "react";
import { useFormik } from "formik";
import { Link , useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import axios from "axios";

export default function ResetPassword() {
  const { t, i18n } = useTranslation();
  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [submittingCode, setSubmittingCode] = useState<boolean>(false);
  const navigate = useNavigate();

  // Auto-focus first box when reset code fields appear
  useEffect(() => {
    if (codeSent) inputsRef.current[0]?.focus();
  }, [codeSent]);

  // called automatically when all 6 digits entered
  const onComplete = (finalCode: string) => {
    console.log("Verification code entered:", finalCode);
    setSubmittingCode(true); // show spinner

    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/verifyResetCode", {
        resetCode: finalCode,
      })
      .then(({ data }) => {
        console.log(data);
        navigate("/resetPasswordForm", { state: { email: formik.values.email } });
      })
      .catch((response) => {
        console.log(response);
        setApiError(response.response.data.message);
      })
      .finally(() => setSubmittingCode(false));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value.replace(/\D/g, ""); // digits only
    if (!value) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (index < 5) {
      inputsRef.current[index + 1]?.focus();
    } else if (newCode.every((digit) => digit !== "")) {
      const finalCode = newCode.join("");
      onComplete(finalCode);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    // 🟡 Better Backspace handling
    if (e.key === "Backspace") {
      const newCode = [...code];
      if (code[index]) {
        newCode[index] = "";
        setCode(newCode);
      } else if (index > 0) {
        newCode[index - 1] = "";
        setCode(newCode);
        inputsRef.current[index - 1]?.focus();
      }
      e.preventDefault();
    }
  };

  const formik = useFormik({
    initialValues: { email: "" },
    validationSchema: Yup.object({
      email: Yup.string()
        .email(t("reset.errors.invalidEmail"))
        .required(t("reset.errors.emailRequired")),
    }),
    onSubmit: handleReset,
  });

  function handleReset(values: { email: string }) {
    setApiError(null);
    setLoading(true);
    axios
      .post("https://ecommerce.routemisr.com/api/v1/auth/forgotPasswords", values)
      .then((response) => {
        console.log(response);
        setCodeSent(true);
      })
      .catch(() => setApiError("This account doesn't exist"))
      .finally(() => setLoading(false));
  }

  useEffect(() => () => { inputsRef.current = [] }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-slate-100 px-4"
      dir={i18n.dir()} // RTL / LTR handled dynamically
    >
      <div className="w-full max-w-md bg-slate-50 shadow-xl rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">
          {t("reset.title")}
        </h2>

        {/* Email form */}
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="relative">
            <input
              id="email"
              type="email"
              placeholder=" "
              {...formik.getFieldProps("email")}
              className="peer block w-full rounded-lg border border-slate-300 bg-transparent px-2.5 pt-4 pb-2.5 text-sm text-slate-900 placeholder-transparent focus:border-slate-900 focus:ring-1 focus:ring-slate-900 focus:outline-none"
            />
            <label
              htmlFor="email"
              className="absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-white px-1 text-sm text-slate-500 duration-300 
                peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100
                peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-slate-900 peer-focus:px-1"
            >
              {t("reset.email")}
            </label>
            {formik.touched.email && formik.errors.email && (
              <p className="mt-1 text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          <button
            type="submit"
            className="cursor-pointer w-full rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-slate-800 transition"
          >
            {loading ? <i className="fas fa-spinner fa-spin"></i> : t("reset.submit")}
          </button>
        </form>

        {/* Success */}
        {codeSent && !apiError && (
          <p className="bg-green-100 text-center mt-4 text-green-800 rounded-md p-2">
            {t("reset.codesent")}
          </p>
        )}

        {/* Code input section */}
        {codeSent && (
          <div className="flex justify-center gap-2 mt-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="w-10 h-12 border-2 border-gray-300 rounded-lg flex items-center justify-center
                focus-within:border-blue-500 transition-all duration-150"
              >
                {submittingCode ? (
                  <i className="fas fa-spinner fa-spin text-gray-600"></i>
                ) : (
                  <input
                    type="text"
                    maxLength={1}
                    value={code[i]}
                    ref={(el) => { inputsRef.current[i] = el;}}
                    onChange={(e) => handleChange(e, i)}
                    onKeyDown={(e) => handleKeyDown(e, i)}
                    className="w-full h-full text-center text-xl font-semibold bg-transparent outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Error */}
        {apiError && (
          <p className="mt-4 rounded-md bg-red-100 p-2 text-center text-sm text-red-600">
            {apiError}
          </p>
        )}

        {/* Footer */}
        <p className="text-sm text-slate-600 mt-6 text-center">
          {t("reset.rememberPassword")}{" "}
          <Link to="/login" className="text-slate-900 font-semibold hover:underline">
            {t("reset.login")}
          </Link>
        </p>
      </div>
    </div>
  );
}
