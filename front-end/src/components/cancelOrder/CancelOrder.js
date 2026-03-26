"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyOrderCancel,
  fetchMyTrackOrder,
} from "../../../lib/features/orderSlice/orderSlice";
import toast from "react-hot-toast";
import { removeParam } from "../../../utils/queryParams/params";
import { getParam } from "../../../utils/queryParams/params";

const CancelOrder = ({ setIsModalOpen }) => {
  const dispatch = useDispatch();

  const confirmCancellation = async () => {
    try {
      const order_id = getParam();

      await dispatch(fetchMyOrderCancel(order_id)).unwrap();

      toast.success("Order canceled successfully");

      setIsModalOpen(false);

      // // refresh order status
      // dispatch(fetchMyTrackOrder(order_id));
    } catch (err) {
      toast.error(err?.message || "Failed to cancel order");
    }
  };
  const backHandler = () => {
    setIsModalOpen(false);
    removeParam();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsModalOpen(false)}
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ duration: 0.25 }}
          className="relative bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl text-center"
        >
          {/* Icon */}
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <HiOutlineExclamationTriangle className="w-8 h-8 text-red-500" />
          </div>

          {/* Title */}
          <h3 className="text-xl font-black mb-2">Cancel Order?</h3>

          {/* Message */}
          <p className="text-slate-500 text-sm mb-8 leading-relaxed">
            This action cannot be undone. Are you sure you want to cancel order
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={confirmCancellation}
              className="w-full py-4 bg-red-500 text-white rounded-2xl font-bold hover:bg-red-600 transition-colors"
            >
              Yes, Cancel Order
            </button>

            <button
              onClick={() => backHandler()}
              className="w-full py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-colors"
            >
              Go Back
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CancelOrder;
