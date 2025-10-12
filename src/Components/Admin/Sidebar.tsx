import { Menu, X, LogOut } from "lucide-react";
import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";
import { UserContext } from "../../Context/UserContext";

export default function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const currentLang = i18n.language || "en";
  const userCtx = useContext(UserContext);
  const navigate = useNavigate();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLangOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("userToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("role");
    userCtx?.setUserName(null);
    userCtx?.setRole(null);
    navigate("/login");
    setSidebarOpen(false);
  };

  const navLinks = [
    {
      to: "/admin",
      label: t("dashboard.dashboard"),
      color: "text-emerald-300",
    },
    {
      to: "/admin/orders",
      label: t("dashboard.orders"),
      color: "text-amber-300",
    },
    { to: "/admin/users", label: t("dashboard.users"), color: "text-sky-300" },
  ];

  return (
    <>
      {/* MOBILE TOGGLER */}
      {!sidebarOpen && (
        <button
          aria-expanded={sidebarOpen}
          aria-controls="admin-sidebar"
          onClick={() => setSidebarOpen(true)}
          className="sm:hidden fixed top-4 left-4 z-[70] flex items-center gap-2 px-3 py-2 bg-slate-800/95 text-white rounded-lg shadow-lg backdrop-blur"
          title={t("dashboard.menu")}
        >
          <Menu size={18} />
          <span className="text-sm">{t("dashboard.menu")}</span>
        </button>
      )}

      {/* SIDEBAR */}
      <aside
        id="admin-sidebar"
        className={`fixed sm:sticky top-0 left-0 sm:z-50 h-screen w-60 bg-slate-800/95 border-r border-slate-700 transform transition-transform duration-300 shadow-xl flex flex-col justify-between
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
          }`}
        style={{ zIndex: 60 }}
      >
        {/* Header + Links */}
        <div>
          <div className="p-5 flex justify-between items-center border-b border-slate-700">
            <h2 className="text-xl font-semibold text-slate-50">
              {t("dashboard.heading")}
            </h2>

            <button
              className="sm:hidden text-slate-200 p-1 rounded hover:bg-slate-700/50"
              onClick={() => setSidebarOpen(false)}
              aria-label={t("dashboard.close")}
              title={t("dashboard.close")}
            >
              <X size={18} />
            </button>
          </div>

          <nav className="flex flex-col space-y-3 p-5 text-slate-100">
            {navLinks.map((link, i) => (
              <NavLink
                key={i}
                to={link.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `transition-colors duration-200 px-2 py-1 rounded ${
                    isActive
                      ? "font-semibold bg-slate-700/40"
                      : "hover:bg-slate-700/20"
                  } ${link.color}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-700 p-4 space-y-3 relative">
          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded-lg transition"
          >
            <LogOut size={18} />
            <span>{t("profile.logout")}</span>
          </button>

          {/* Language Switcher */}
          <div>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="w-full flex justify-between items-center bg-slate-700/30 hover:bg-slate-700/50 px-3 py-2 rounded-lg text-slate-100 transition"
            >
              <span>{currentLang.toUpperCase()}</span>
              <i className="fa-solid fa-angle-down text-sm"></i>
            </button>

            {langOpen && (
              <div className="absolute bottom-14 left-4 right-4 bg-slate-800 border border-slate-600 rounded-lg shadow-lg text-slate-100">
                {["en", "ar"]
                  .filter((lng) => lng !== currentLang)
                  .map((lng) => (
                    <button
                      key={lng}
                      onClick={() => changeLanguage(lng)}
                      className="w-full text-left px-3 py-2 hover:bg-slate-700 transition"
                    >
                      {lng.toUpperCase()}
                    </button>
                  ))}
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-50 sm:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
