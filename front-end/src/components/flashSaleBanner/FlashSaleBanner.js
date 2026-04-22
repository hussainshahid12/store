"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiLightningBolt } from "react-icons/hi";

const FlashSaleBanner = () => {
  const [index, setIndex] = useState(0);

  const saleTexts = [
    "FLASH SALE: 30% OFF STOREWIDE",
    "LIMITED TIME: BOGO DEALS LIVE",
    "VIP ONLY: EARLY ACCESS OPEN",
    "FREE SHIPPING ON ALL ORDERS",
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % saleTexts.length);
    }, 2800);
    return () => clearInterval(timer);
  }, []);

  const springConfig = { type: "spring", stiffness: 400, damping: 30 };

  return (
    /* Added: fixed top-0 left-0 z-[100] */
    <div className="fixed top-0 left-0 w-full z-[100] bg-[#0F1117] py-2.5 sm:py-3 overflow-hidden border-b border-white/5">
      {/* Velocity Line */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500 to-transparent opacity-30"
      />

      <div className="max-w-[1400px] mx-auto px-4 flex items-center justify-between sm:justify-center gap-3 sm:gap-8">
        {/* Left Icon */}
        <div className="flex items-center gap-1.5 text-rose-500 shrink-0">
          <motion.div
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.9, 1.1, 0.9] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            <HiLightningBolt className="w-4 h-4 sm:w-5 sm:h-5" />
          </motion.div>
          <span className="hidden md:inline text-[9px] font-black tracking-[0.2em] uppercase text-white/40">
            Active
          </span>
        </div>

        {/* Center Text */}
        <div className="relative h-5 sm:h-7 flex items-center justify-center overflow-hidden flex-1 sm:flex-none">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={springConfig}
              className="flex items-center"
            >
              <h2
                className="text-white text-center whitespace-nowrap font-black tracking-tight sm:tracking-[0.1em] 
                           text-[11px] xs:text-[13px] sm:text-sm lg:text-base"
              >
                {saleTexts[index].split(" ").map((word, i) => (
                  <span
                    key={i}
                    className={`inline-block mr-1.5 ${
                      word.includes("%") || word === "FREE" || word === "BOGO"
                        ? "text-rose-500"
                        : "text-white"
                    }`}
                  >
                    {word}
                  </span>
                ))}
              </h2>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default FlashSaleBanner;
