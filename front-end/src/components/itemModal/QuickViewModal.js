"use client";

import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import { useDispatch } from "react-redux";
import decode from "../../../utils/tokenDecoded/decoded";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { FiShoppingCart, FiArrowRight, FiCheckCircle, FiLoader } from "react-icons/fi";
import Image from "next/image";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LOGINMODAL from "../login_Modal/LoginModal";
import { useRouter } from "next/navigation";

const QuickViewModal = ({ product, onClose }) => {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [status, setStatus] = useState("idle");
  const dispatch = useDispatch();

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!product) return null;

  const cartHandler = async (isBuyNow = false) => {
    if (isBuyNow) {
      const token = localStorage.getItem("isAuth");
      const decoded_token = decode(token);
      if (!decoded_token?.id) {
        setShowLoginPrompt(true);
        return;
      }
      router.push(`/checkout?mode=buy-now&productId=${product._id}&quantity=${quantity}`);
      return;
    }

    setStatus("loading");
    try {
      await dispatch(fetchAddItem({ productId: product._id, quantity }));
      setStatus("success");
      setTimeout(() => { setStatus("idle"); onClose(); }, 1500);
    } catch (error) {
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/40 backdrop-blur-[2px] p-4">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
        className="absolute inset-0" onClick={onClose} 
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-[850px] rounded-[2rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row border border-white/20"
      >
        <AnimatePresence mode="wait">
          {!showLoginPrompt ? (
            <>
              {/* IMAGE SECTION - COMPACT */}
              <div className="w-full md:w-[40%] bg-slate-50 dark:bg-slate-800/50 p-8 flex items-center justify-center relative">
                <div className="relative w-full aspect-square group">
                  <Image
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    className="object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 p-8 md:p-10 flex flex-col">
                <button 
                  onClick={onClose} 
                  className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <FaTimes size={18} />
                </button>

                <div className="mb-auto">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-blue-600 mb-2 block">Quick View</span>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2 leading-tight">
                    {product.title}
                  </h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed line-clamp-3 mb-6">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-8">
                    <span className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">Per Unit</span>
                  </div>
                </div>

                {/* CONTROLS */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-red-500"
                      >
                        <FaMinus size={12} />
                      </button>
                      <div className="w-12 text-center overflow-hidden">
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={quantity}
                            initial={{ y: 5, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -5, opacity: 0 }}
                            className="block font-bold text-lg dark:text-white tabular-nums"
                          >
                            {quantity}
                          </motion.span>
                        </AnimatePresence>
                      </div>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-white dark:hover:bg-slate-700 transition-all text-slate-500 hover:text-blue-500"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                    
                    <div className="pr-4 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Subtotal</p>
                      <p className="font-black text-xl dark:text-white">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => cartHandler(false)}
                      disabled={status !== "idle"}
                      className={`flex-1 h-12 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all 
                        ${status === "success" 
                          ? "bg-green-500 text-white" 
                          : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90"}`}
                    >
                      {status === "loading" ? <FiLoader className="animate-spin" /> : 
                       status === "success" ? <FiCheckCircle /> : <FiShoppingCart />}
                      {status === "success" ? "Done" : "Add"}
                    </button>

                    <button
                      onClick={() => cartHandler(true)}
                      className="flex-[1.5] h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <span>Checkout</span>
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full p-8"><LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} isNested={true} /></div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);