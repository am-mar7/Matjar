import { useContext, useState } from "react";
import { UserContext } from "../../Context/UserContext";
import { Link, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const user = useContext(UserContext);
  const [isOpen, setIsOpen] = useState(false);
  const [lang, setLang] = useState<string>(i18n.language || "en");
  const [langOpen, setLangOpen] = useState(false);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLang(lng);
    setLangOpen(false);
  };

  return (
    <header className="bg-slate-50 text-slate-950 shadow-md">
      <div className="flex justify-between items-center px-4 sm:px-6 py-3 sm:py-4">
        {/* Logo */}
        <Link to='/'>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide hover:scale-105 transition">
            {t('logo')}
          </h1>
        </Link>

        {/* Desktop Links */}
        <nav className="hidden md:flex gap-8">
          {["home", "products", "about", "cart", "favorites"].map((item, idx) => (
            <NavLink
              key={idx}
              to={item === "home" ? "/" : `/${item}`}
              className={({ isActive }) =>
                `relative text-base font-medium transition-all ${
                  isActive ? "text-blue-600" : "text-slate-950"
                } hover:text-blue-600`
              }
            >
              {t(item)}
            </NavLink>
          ))}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* User Icon */}
          <Link
            to={user?.userName ? '/Profile': '/login'}
            className="hover:bg-black/10 py-1 px-1.5 rounded-lg text-slate-950 hover:text-blue-600 transition text-lg sm:text-xl"
          >
            <i className="fa-solid fa-user "></i>
          </Link>

          {/* Separator */}
          <div className="w-[1px] h-6 bg-slate-400/50"></div>

          {/* Lang Dropdown */}
          <div className="relative">
            <button
              onClick={() => setLangOpen((prev) => !prev)}
              className="px-3 py-1 text-sm sm:text-base hover:bg-black/10 cursor-pointer hover:text-blue-600 text-slate-950 rounded-lg transition"
            >
              {lang.toUpperCase()}
            </button>

            {langOpen && (
              <div className="absolute z-50 right-0 mt-2 w-24 bg-white rounded-lg shadow-lg overflow-hidden text-sm">
                <button
                  className="w-full px-3 py-2 bg-slate-50 text-slate-950 font-semibold cursor-pointer"
                  onClick={() => changeLanguage(lang)}
                >
                  {lang.toUpperCase()}
                </button>
                {["en", "ar"]
                  .filter((lng) => lng !== lang)
                  .map((lng) => (
                    <button
                      key={lng}
                      className="w-full px-3 py-2 hover:bg-slate-100 text-slate-700 cursor-pointer"
                      onClick={() => changeLanguage(lng)}
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden text-slate-950 hover:bg-slate-200 p-2 rounded-lg transition"
          >
            <i className="fa-solid fa-bars text-lg sm:text-xl"></i>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed top-0 right-0 h-screen w-3/4 max-w-[280px] bg-black/50 backdrop-blur-md p-6 shadow-xl z-50 flex flex-col"
          >
            {/* Close button */}
            <button
              onClick={() => setIsOpen(false)}
              className="self-end text-slate-50 hover:text-red-400 transition"
            >
              <i className="fa-solid fa-xmark text-xl sm:text-2xl"></i>
            </button>

            {/* Links */}
            <nav className="flex flex-col gap-5 mt-10 text-sm sm:text-base">
              {["home", "products", "about", "cart", "favorites"].map((item, idx) => (
                <Link
                  key={idx}
                  to={item === "home" ? "/" : `/${item}`}
                  className="text-slate-50 hover:text-cyan-300 transition"
                  onClick={() => setIsOpen(false)}
                >
                  {t(item)}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
