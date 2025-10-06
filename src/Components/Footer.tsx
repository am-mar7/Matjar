import { motion } from "framer-motion";
import { FaFacebook, FaLinkedin, FaGithub, FaCode } from "react-icons/fa";
import { useTranslation } from "react-i18next";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative overflow-hidden bg-slate-950 text-slate-300 py-12 mt-20">
      {/* Cyan Gradient Light */}
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent"></div>
      <div className="absolute -top-10 left-1/2 w-[60vw] h-[60vw] bg-cyan-500/10 rounded-full blur-3xl -translate-x-1/2"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        {/* Logo / Name */}
        <motion.h2
          className="text-4xl sm:text-5xl font-extrabold text-white mb-4 tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          Matjar
        </motion.h2>

        {/* Tagline */}
        <motion.p
          className="max-w-xl text-slate-400 mb-8 text-sm sm:text-base leading-relaxed"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {t("footerTagline")}
        </motion.p>

        {/* Social Icons */}
        <motion.div
          className="flex gap-6 mb-10"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <a
            href="https://www.linkedin.com/in/ammar-alaa-am77"
            target="_blank"
            rel="noreferrer"
            className="group relative"
            aria-label="LinkedIn"
          >
            <FaLinkedin className="text-2xl text-slate-400 group-hover:text-cyan-400 transition transform group-hover:-translate-y-1" />
          </a>

          <a
            href="https://github.com/am-mar7"
            target="_blank"
            rel="noreferrer"
            className="group relative"
            aria-label="GitHub"
          >
            <FaGithub className="text-2xl text-slate-400 group-hover:text-cyan-400 transition transform group-hover:-translate-y-1" />
          </a>

          <a
            href="https://codeforces.com/profile/ammaralaa470"
            target="_blank"
            rel="noreferrer"
            className="group relative"
            aria-label="Codeforces"
          >
            <FaCode className="text-2xl text-slate-400 group-hover:text-cyan-400 transition transform group-hover:-translate-y-1" />
          </a>

          <a
            href="https://www.facebook.com"
            target="_blank"
            rel="noreferrer"
            className="group relative"
            aria-label="Facebook"
          >
            <FaFacebook className="text-2xl text-slate-400 group-hover:text-cyan-400 transition transform group-hover:-translate-y-1" />
          </a>
        </motion.div>

        {/* Divider */}
        <div className="h-[1px] w-3/4 bg-slate-700/50 mb-6"></div>

        {/* Signature */}
        <motion.p
          className="text-slate-500 text-xs sm:text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 1 }}
        >
          © {new Date().getFullYear()}{" "}
          <span className="text-cyan-400 font-semibold">Matjar</span>.{" "}
          {t("footerBuilt")}{" "}
          <a
            href="https://github.com/am-mar7"
            className="text-cyan-400 hover:text-cyan-300 transition font-medium"
            target="_blank"
            rel="noreferrer"
          >
            Ammar Alaa Omar
          </a>
        </motion.p>
      </div>

      {/* Decorative bottom glow */}
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
    </footer>
  );
}
