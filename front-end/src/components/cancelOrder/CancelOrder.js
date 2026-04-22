"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrderCancel } from "../../../lib/features/orderSlice/orderSlice";
import toast from "react-hot-toast";
import { removeParam, getParam } from "../../../utils/queryParams/params";
import Loader from "../loader/Loader";

const CancelOrder = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();

  /**
   * Safe Selector:
   * We use optional chaining (?.) and a fallback (|| {}) to prevent the
   * "Cannot destructure property 'isLoading' of undefined" error.
   * Make sure 'order' matches the key in your store.js reducer object.
   */
  const { isLoading } = useSelector((state) => state?.orderSlice) || {};

  const confirmCancellation = async () => {
    try {
      const order_id = getParam();
      if (!order_id) {
        toast.error("Order ID not found");
        return;
      }

      // unwrap() allows the catch block to handle the error if the API fails
      await dispatch(fetchMyOrderCancel(order_id)).unwrap();

      toast.success("Order canceled successfully");
      setIsModalOpen(false);
      removeParam();
    } catch (err) {
      toast.error(err?.message || "Failed to cancel order");
    }
  };

  const backHandler = () => {
    if (isLoading) return; // Prevent closing while action is in progress
    setIsModalOpen(false);
    removeParam();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Background Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={backHandler}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
      />

      {/* Modal Container */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.2 }}
        className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center overflow-hidden"
      >
        {/* Professional Loader Overlay - Only shows during dispatch */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px]"
            >
              {/* <Loader /> */}
              <p className="mt-4 text-sm font-bold text-slate-600 animate-pulse">
                Processing ...
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Modal Icon */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500" />
        </div>

        {/* Text Content */}
        <h3 className="text-xl font-black mb-2 text-slate-800">
          Cancel Order?
        </h3>
        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          This action cannot be undone. Are you sure you want to cancel this
          order?
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button
            disabled={isLoading}
            onClick={confirmCancellation}
            className={`w-full py-4 bg-red-500 text-white rounded-2xl font-bold transition-all active:scale-95 
              ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"}`}
          >
            {isLoading ? "Please wait..." : "Yes, Cancel Order"}
          </button>

          <button
            disabled={isLoading}
            onClick={backHandler}
            className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors disabled:opacity-50"
          >
            Go Back
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default CancelOrder;
