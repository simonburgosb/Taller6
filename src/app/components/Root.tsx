import { Outlet, Link, useLocation } from "react-router";
import { Book, Mic } from "lucide-react";
import { motion } from "motion/react";

export default function Root() {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const isMaxiLibro = location.pathname === "/maxilibro";

  return (
    <div className="min-h-screen bg-[#f6e5cf]">
      {/* Header */}
      <motion.header
        className="bg-[#28555a] py-6 px-8 shadow-lg"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex flex-col gap-1">
            <motion.h1
              className="text-4xl font-bold text-[#e9d1c2] leading-[40px]"
              style={{ fontFamily: 'Fraunces, serif', fontVariationSettings: "'SOFT' 0, 'WONK' 1" }}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Memoria Viva
            </motion.h1>
            <p className="text-sm text-[#f6e5cf] leading-5" style={{ fontFamily: 'Commissioner, sans-serif' }}>
              Santa Fé de Antioquia
            </p>
          </Link>

          {/* Navigation */}
          <nav className="bg-[#f6e5cf] rounded-full p-2 flex gap-3">
            <Link
              to="/"
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${
                isHome
                  ? "bg-[#4e7378] text-white shadow-lg"
                  : "text-[#0a1d1f]"
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <motion.div
                whileHover={{ rotate: [0, -10, 10, -10, 0] }}
                transition={{ duration: 0.5 }}
              >
                <Mic size={20} />
              </motion.div>
              Cabina
            </Link>
            <Link
              to="/maxilibro"
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-bold transition-colors ${
                isMaxiLibro
                  ? "bg-[#4e7378] text-white shadow-lg"
                  : "text-[#0a1d1f]"
              }`}
              style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
            >
              <motion.div
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.5 }}
              >
                <Book size={20} />
              </motion.div>
              MaxiLibro
            </Link>
          </nav>
        </div>
      </motion.header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}