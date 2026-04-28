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
  const [status, setStatus] = useState("idle"); // idle | loading | success
  const dispatch = useDispatch();

  // Prevent background scroll
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
      setTimeout(() => {
        setStatus("idle");
        onClose();
      }, 1500);
    } catch (error) {
      setStatus("idle");
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-950/50 backdrop-blur-sm p-4 md:p-6">
      {/* Backdrop */}
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        onClick={onClose}
        className="absolute inset-0 cursor-pointer"
      />

      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white dark:bg-slate-900 w-full max-w-[850px] rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 flex flex-col md:flex-row border border-white/10"
      >
        <AnimatePresence mode="wait">
          {!showLoginPrompt ? (
            <>
              {/* LEFT: IMAGE SECTION (Fixed visibility logic) */}
              <div className="w-full md:w-[45%] bg-slate-50 dark:bg-slate-800/50 p-8 flex items-center justify-center relative min-h-[300px] md:min-h-[450px]">
                <div className="relative w-full h-full min-h-[250px]">
                  <Image
                    key={product._id}
                    src={product.thumbnail}
                    alt={product.title}
                    fill
                    priority
                    unoptimized // Forces image to show even if next.config isn't perfect
                    className="object-contain mix-blend-multiply dark:mix-blend-normal drop-shadow-2xl"
                    sizes="(max-width: 768px) 100vw, 40vw"
                  />
                </div>
                
                {/* Mobile Category Tag */}
                <div className="absolute top-6 left-6">
                   <span className="bg-white/80 dark:bg-slate-900/80 backdrop-blur px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-500 shadow-sm">
                    {product.category || 'Premium'}
                   </span>
                </div>
              </div>

              {/* RIGHT: CONTENT SECTION */}
              <div className="flex-1 p-8 md:p-12 flex flex-col relative">
                <button 
                  onClick={onClose} 
                  className="absolute top-8 right-8 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all bg-slate-100 dark:bg-slate-800 rounded-full md:bg-transparent"
                >
                  <FaTimes size={18} />
                </button>

                <div className="mb-auto">
                  <div className="flex items-center gap-2 mb-4 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-widest">
                    <FiShoppingBag />
                    <span>Quick View</span>
                  </div>
                  
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tight">
                    {product.title}
                  </h2>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-4">
                    {product.description}
                  </p>

                  <div className="flex items-baseline gap-2 mb-10">
                    <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">
                      ${product.price?.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">USD</span>
                  </div>
                </div>

                {/* CONTROLS AREA */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between bg-slate-100/50 dark:bg-slate-800/50 rounded-2xl p-2 border border-slate-200/50 dark:border-slate-700/50">
                    <div className="flex items-center gap-1">
                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(q => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm text-slate-500 hover:text-red-500 transition-colors"
                      >
                        <FaMinus size={10} />
                      </motion.button>
                      
                      <div className="w-12 text-center">
                        <AnimatePresence mode="wait">
                          <motion.span 
                            key={quantity}
                            initial={{ y: 5, opacity: 0 }} 
                            animate={{ y: 0, opacity: 1 }} 
                            exit={{ y: -5, opacity: 0 }}
                            className="block font-black text-lg dark:text-white tabular-nums"
                          >
                            {quantity}
                          </motion.span>
                        </AnimatePresence>
                      </div>

                      <motion.button 
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setQuantity(q => q + 1)}
                        className="w-10 h-10 flex items-center justify-center rounded-xl bg-white dark:bg-slate-700 shadow-sm text-slate-500 hover:text-blue-500 transition-colors"
                      >
                        <FaPlus size={10} />
                      </motion.button>
                    </div>
                    
                    <div className="pr-4 text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Subtotal</p>
                      <p className="font-black text-xl dark:text-white tracking-tight">
                        ${(product.price * quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => cartHandler(false)}
                      disabled={status !== "idle"}
                      className={`flex-1 h-14 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 
                        ${status === "success" 
                          ? "bg-emerald-500 border-emerald-500 text-white" 
                          : "border-slate-200 dark:border-slate-700 dark:text-white hover:border-slate-900 dark:hover:border-white"}`}
                    >
                      {status === "loading" ? <FiLoader className="animate-spin" /> : 
                       status === "success" ? <FiCheckCircle size={18} /> : <FiShoppingCart size={18} />}
                      <span>{status === "loading" ? "Adding" : status === "success" ? "Added" : "Add to Cart"}</span>
                    </button>

                    <button
                      onClick={() => cartHandler(true)}
                      className="flex-[1.4] h-14 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95 transition-all"
                    >
                      <span>Direct Checkout</span>
                      <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full p-12 flex flex-col items-center justify-center min-h-[400px]">
              <LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} isNested={true} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);