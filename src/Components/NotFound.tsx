import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 text-center px-6">
      {/* Animated icon */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <div className="text-[9rem] font-extrabold text-slate-800 select-none">
          404
        </div>
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.15, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <i className="fa-solid fa-circle-exclamation text-[7rem] text-slate-500"></i>
        </motion.div>
      </motion.div>

      {/* Text */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-3xl md:text-4xl font-bold text-slate-800 mt-4"
      >
        Oops! Page Not Found
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text-slate-600 mt-3 max-w-md"
      >
        The page you’re looking for might have been moved, deleted, or doesn’t exist anymore.
      </motion.p>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="inline-block bg-slate-800 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-slate-700 active:scale-95 transition-all shadow-md"
        >
          Back to Home
        </Link>
      </motion.div>
    </div>
  );
}
