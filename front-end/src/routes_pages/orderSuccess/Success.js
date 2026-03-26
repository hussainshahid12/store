"use client";

import React, { useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { HiCheck, HiArrowRight, HiShoppingBag } from "react-icons/hi2";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";

// 1. Move the logic into a internal component
const SuccessContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id") || "ORD-0000";

  useEffect(() => {
    dispatch(fetchCartItems());
  }, [dispatch]);

  // Animation variants
  const containerVars = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, staggerChildren: 0.1 },
    },
  };

  const itemVars = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <motion.div
        variants={containerVars}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[480px] bg-white border border-gray-200 shadow-xl rounded-[2.5rem] overflow-hidden"
      >
        <div className="pt-14 pb-8 px-10 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-400 mb-6"
          >
            <HiCheck className="h-10 w-10 text-white" />
          </motion.div>

          <motion.h1
            variants={itemVars}
            className="text-3xl font-bold text-gray-900 mb-3"
          >
            Payment Received
          </motion.h1>
          <motion.p
            variants={itemVars}
            className="text-gray-500 text-sm leading-relaxed"
          >
            Thank you for your purchase. Your order is being prepared for
            shipment.
          </motion.p>
        </div>

        {/* Order ID Section */}
        <motion.div variants={itemVars} className="px-10 mb-8">
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 flex justify-between items-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Order ID
            </span>
            <span className="font-mono text-sm font-bold text-black">
              {orderId}
            </span>
          </div>
        </motion.div>

        <div className="px-10 pb-10 space-y-3">
          <motion.div variants={itemVars}>
            <Link
              href={`/track-order`}
              className="flex items-center justify-center w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98]"
            >
              Track Order
              <HiArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </motion.div>

          <motion.div variants={itemVars}>
            <Link
              href="/"
              className="flex items-center justify-center w-full bg-white text-gray-600 py-4 rounded-xl font-bold border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98]"
            >
              <HiShoppingBag className="mr-2 h-4 w-4" />
              Return to Shop
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// 2. Wrap the component in Suspense for the export
const SuccessClient = () => {
  return (
    <Suspense 
        fallback={
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-pulse text-gray-400 font-medium">Loading receipt...</div>
            </div>
        }
    >
      <SuccessContent />
    </Suspense>
  );
};

export default SuccessClient;