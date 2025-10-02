import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
  .use(HttpBackend) // يجيب الترجمة من public/locales
  .use(LanguageDetector) // يقرأ اللغة من localStorage أو المتصفح
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: true,
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}/translation.json", // 👈 مكان ملفات الترجمة
    },
  });

export default i18n;
