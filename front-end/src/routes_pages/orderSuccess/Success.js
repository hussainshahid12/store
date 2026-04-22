"use client";

import React, { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import {
  HiCheck,
  HiArrowRight,
  HiShoppingBag,
  HiOutlineClipboardDocumentCheck,
  HiOutlineArrowPath,
} from "react-icons/hi2";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";

// 1. The Internal Content Component
const SuccessContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();

  // Get order ID from URL or provide a placeholder
  const orderId = searchParams.get("order_id") || "ORD-7721902";

  useEffect(() => {
    // Refresh cart items to ensure the UI reflects the now-empty cart
    dispatch(fetchCartItems());

    // Smooth scroll to top on mount
    window.scrollTo(0, 0);
  }, [dispatch]);

  // Animation Variants
  const containerVars = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative min-h-screen w-full bg-[#FDFDFD] flex flex-col items-center py-12 px-6">
      {/* Abstract Background Shapes for a "Professional" feel */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[300px] h-[300px] rounded-full bg-green-50/50 blur-3xl" />
        <div className="absolute bottom-[10%] left-[-5%] w-[250px] h-[250px] rounded-full bg-blue-50/50 blur-3xl" />
      </div>

      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="relative z-10 w-full max-w-[520px] bg-white border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] rounded-[2.5rem]"
      >
        {/* Animated Top Progress Accent */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
          className="h-1.5 bg-gradient-to-r from-green-400 to-emerald-500 rounded-t-full"
        />

        <div className="pt-12 pb-8 px-8 md:px-12 text-center">
          {/* Success Checkmark Circle */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-50 mb-6"
          >
            <div className="w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-lg shadow-green-200">
              <HiCheck className="h-8 w-8 text-white stroke-[2]" />
            </div>
          </motion.div>

          <motion.h1
            variants={itemVars}
            className="text-3xl font-extrabold text-gray-900 mb-3 tracking-tight"
          >
            Thank You!
          </motion.h1>

          <motion.p
            variants={itemVars}
            className="text-gray-500 text-base mb-8 leading-relaxed"
          >
            Your order has been received and is now being processed. Check your
            email for the receipt.
          </motion.p>

          {/* Receipt-style Order Info */}
          <motion.div
            variants={itemVars}
            className="bg-gray-50 rounded-3xl p-5 border border-gray-100 flex flex-col gap-3 mb-8"
          >
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                Order Number
              </span>
              <span className="font-mono font-bold text-gray-900">
                {orderId.slice(-8).toUpperCase()}
              </span>
            </div>
            <div className="h-[1px] w-full border-t border-dashed border-gray-200" />
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-400 font-medium uppercase tracking-wider text-[10px]">
                Status
              </span>
              <span className="flex items-center gap-1.5 text-emerald-600 font-bold bg-emerald-50 px-3 py-1 rounded-full text-xs">
                <HiOutlineArrowPath className="animate-spin-slow h-3 w-3" />
                Processing
              </span>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <motion.div
              variants={itemVars}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href="/track-order"
                className="flex items-center justify-center w-full bg-gray-900 text-white py-4.5 rounded-2xl font-bold shadow-xl shadow-gray-200 hover:bg-black transition-all h-[56px]"
              >
                Track My Order
                <HiArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </motion.div>

            <motion.div
              variants={itemVars}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <Link
                href="/"
                className="flex items-center justify-center w-full bg-white text-gray-600 py-4.5 rounded-2xl font-bold border border-gray-200 hover:bg-gray-50 transition-all h-[56px]"
              >
                <HiShoppingBag className="mr-2 h-4 w-4" />
                Back to Shopping
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="pb-10 px-8 text-center">
          <p className="text-[11px] text-gray-400 flex items-center justify-center gap-1">
            <HiOutlineClipboardDocumentCheck className="h-3 w-3" />
            Secure checkout by YourBrand™
          </p>
        </div>
      </motion.div>
    </div>
  );
};

// 2. Main Export with Error Boundary / Suspense
const SuccessClient = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-gray-200 border-t-green-500 rounded-full animate-spin" />
            <span className="text-gray-400 text-sm font-medium">
              Loading Confirmation...
            </span>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessClient;
