"use client";

import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import { useDispatch } from "react-redux";
import decode from "../../../utils/tokenDecoded/decoded";
import { FaTimes } from "react-icons/fa";
import { FiShoppingCart } from "react-icons/fi";
import Image from "next/image";
import { memo, useState } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import LOGINMODAL from "../login_Modal/LoginModal";

const QuickViewModal = ({ product, onClose }) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const dispatch = useDispatch();

  const cartHandler = (item) => {
    const token = decode();
    if (!token?.id) {
      setShowLoginPrompt(true); // Switch view to Login inside THIS modal
      return;
    }
    dispatch(fetchAddItem({ productId: item._id }));
    toast.success("Item added to cart");
    onClose();
  };

  if (!product) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative border border-white/10"
      >
        {/* Global Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 p-2  dark:bg-slate-800 rounded-full text-gray-300 hover:text-black  transition-all cursor-pointer"
        >
          <FaTimes size={16} />
        </button>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {!showLoginPrompt ? (
              /* --- PRODUCT VIEW --- */
              <motion.div
                key="product"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-800/40 rounded-[2rem] overflow-hidden">
                  <Image
                    src={product.thumbnail || "https://via.placeholder.com/300"}
                    alt={product.title}
                    fill
                    className="object-contain p-8"
                  />
                </div>
                <div>
                  <h3 className="text-2xl font-black dark:text-white">
                    {product.title}
                  </h3>
                  <p className="text-slate-500 text-sm mt-2 line-clamp-2">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-3xl font-black text-primary">
                    ${product.price}
                  </span>
                  <button
                    onClick={() => cartHandler(product)}
                    className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-bold hover:opacity-90 transition-all cursor-pointer"
                  >
                    <FiShoppingCart /> Add to Cart
                  </button>
                </div>
              </motion.div>
            ) : (
              /* --- LOGIN VIEW (NO SEPARATE MODAL) --- */
              <motion.div
                key="login"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                {/* We pass isNested so LoginModal doesn't show its own background */}
                <LOGINMODAL
                  setShowLoginPrompt={setShowLoginPrompt}
                  isNested={true}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);
