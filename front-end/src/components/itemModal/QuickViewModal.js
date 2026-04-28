"use client";

import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import { useDispatch } from "react-redux";
import decode from "../../../utils/tokenDecoded/decoded";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { FiShoppingCart, FiArrowRight, FiCheckCircle, FiLoader, FiShoppingBag } from "react-icons/fi";
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
    <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center bg-slate-950/70 backdrop-blur-sm">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0"
      />

      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-slate-900 w-full md:max-w-[850px] md:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row h-[95vh] md:h-auto max-h-[95vh] md:max-h-[90vh]"
      >
        <AnimatePresence mode="wait">
          {!showLoginPrompt ? (
            <>
              {/* IMAGE SECTION */}
              <div className="w-full md:w-[45%] bg-slate-100 dark:bg-slate-800/50 p-6 md:p-12 flex items-center justify-center relative min-h-[300px] md:min-h-[450px] shrink-0">
                {/* FLOATING CLOSE BUTTON FOR MOBILE */}
                <button 
                  onClick={onClose} 
                  className="md:hidden absolute top-5 right-5 z-[60] p-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md rounded-full shadow-xl text-slate-900 dark:text-white active:scale-90 transition-transform"
                >
                  <FaTimes size={16} />
                </button>

                <div className="relative w-full h-full min-h-[250px]">
                  <Image
                    key={product._id}
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    priority
                    unoptimized
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* CONTENT SECTION */}
              <div className="flex-1 p-6 md:p-12 flex flex-col overflow-y-auto">
                {/* DESKTOP CLOSE BUTTON */}
                <button 
                  onClick={onClose} 
                  className="hidden md:flex absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all"
                >
                  <FaTimes size={22} />
                </button>

                <div className="mb-6 md:mb-auto">
                  <div className="flex items-center gap-2 mb-3 text-blue-600 dark:text-blue-400 font-bold text-[10px] uppercase tracking-[0.2em]">
                    <FiShoppingBag />
                    <span>Quick View</span>
                  </div>
                  
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-3 leading-tight tracking-tight">
                    {product.title}
                  </h2>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase">USD</span>
                  </div>
                </div>

                {/* CONTROLS (Sticky at bottom on mobile) */}
                <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 border border-slate-200/50 dark:border-slate-700/50">
                      <button 
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm"
                      >
                        <FaMinus size={10} className="dark:text-white" />
                      </button>
                      <span className="w-12 text-center font-black text-lg dark:text-white">{quantity}</span>
                      <button 
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm"
                      >
                        <FaPlus size={10} className="dark:text-white" />
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Subtotal</p>
                      <p className="font-black text-xl dark:text-white">${(product.price * quantity).toFixed(2)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3 pb-4 md:pb-0">
                    <button
                      onClick={() => cartHandler(false)}
                      disabled={status !== "idle"}
                      className={`flex-1 h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 
                        ${status === "success" 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-200 dark:border-slate-700 dark:text-white"}`}
                    >
                      {status === "loading" ? <FiLoader className="animate-spin" /> : 
                       status === "success" ? <FiCheckCircle size={18} /> : <FiShoppingCart size={18} />}
                      <span>{status === "success" ? "Added" : "Add"}</span>
                    </button>

                    <button
                      onClick={() => cartHandler(true)}
                      className="flex-[1.5] h-14 bg-blue-600 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <span>Checkout</span>
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-6">
              <LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} isNested={true} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);