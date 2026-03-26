"use client";

import Link from "next/link";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-6">
      <div className="text-center max-w-xl w-full">
        
        {/* Animated 404 */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="text-[10rem] md:text-[12rem] font-black bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent select-none"
        >
          404
        </motion.h1>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-3xl md:text-4xl font-bold text-gray-800 -mt-10"
        >
          Page Not Found
        </motion.h2>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.8, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-gray-500 mt-4 text-lg"
        >
          Sorry, the page you’re looking for doesn’t exist or has been moved.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link
            href="/"
            className="cursor-pointer flex items-center justify-center gap-2 bg-black text-white px-8 py-3 rounded-xl font-semibold hover:bg-gray-900 transition-all shadow-md hover:scale-105"
          >
            <FiHome /> Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="cursor-pointer flex items-center justify-center gap-2 border border-gray-300 px-8 py-3 rounded-xl font-semibold text-gray-700 hover:bg-gray-100 transition-all hover:scale-105"
          >
            <FiArrowLeft /> Go Back
          </button>
        </motion.div>

        {/* Divider */}
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-400 mb-3">
            You might be looking for:
          </p>

          {/* Links */}
          <div className="flex flex-wrap justify-center gap-4">
            {[
              { name: "Best Sellers", href: "/best-sellers" },
              { name: "New Arrivals", href: "/new-arrivals" },
              { name: "Help Center", href: "/customer-service" },
            ].map((item, i) => (
              <Link
                key={i}
                href={item.href}
                className="text-sm font-medium text-orange-500 hover:text-orange-600 hover:underline transition"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
