"use client";

import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import { useDispatch } from "react-redux";
import decode from "../../../utils/tokenDecoded/decoded";
import { FaTimes, FaPlus, FaMinus } from "react-icons/fa";
import { FiShoppingCart, FiArrowRight, FiCheckCircle } from "react-icons/fi";
import Image from "next/image";
import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LOGINMODAL from "../login_Modal/LoginModal";
import { useRouter } from "next/navigation";

const QuickViewModal = ({ product, onClose }) => {
  const router = useRouter();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  // Prevent background scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, []);

  if (!product) return null;

  const cartHandler = async (isBuyNow = false) => {
    if (isBuyNow) {
      let token = localStorage.getItem("isAuth");
      const decoded_token = decode(token);
      if (!decoded_token?.id) {
        setShowLoginPrompt(true);
        return;
      }
      router.push(`/checkout?mode=buy-now&productId=${product._id}&quantity=${quantity}`);
    } else {
      setLoader(true);
      await dispatch(fetchAddItem({ productId: product._id, quantity }));
      setLoader(false);
      setQuantity(1);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-[999] flex items-end md:items-center justify-center bg-slate-900/70 backdrop-blur-md p-0 md:p-4">
      <motion.div
        initial={{ y: "100%", opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: "100%", opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="bg-white dark:bg-[#0f172a] w-full max-w-5xl md:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto shadow-2xl relative"
      >
        <AnimatePresence mode="wait">
          {!showLoginPrompt ? (
            <>
              {/* LEFT: IMAGE SECTION */}
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 md:p-12 relative border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <button onClick={onClose} className="md:hidden absolute top-4 right-4 z-50 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md text-slate-600">
                  <FaTimes size={18} />
                </button>

                {/* IMAGE FIX: Forced height container + Priority loading */}
                <div className="relative w-full h-[250px] md:h-[400px] flex items-center justify-center">
                  <Image
                    key={product._id} 
                    src={product.thumbnail }
                    alt={product.title }
                    fill
                    priority={true} // Forces instant load in production
                    unoptimized={true} // Bypasses Next.js proxy if it's failing
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                  />
                </div>
              </div>

              {/* RIGHT: INFO SECTION */}
              <div className="flex-1 flex flex-col overflow-hidden relative p-6 md:p-10">
                <button onClick={onClose} className="hidden md:block absolute top-4 right-4 z-50 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors">
                  <FaTimes size={20} className="text-slate-400" />
                </button>

                <div className="flex-1 overflow-y-auto pb-40 md:pb-0">
                  <h2 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight">
                    {product.title}
                  </h2>
                  <div className="flex items-baseline gap-3 mb-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">${product.price?.toFixed(2)}</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed">{product.description}</p>
                </div>

                {/* STICKY ACTION BAR */}
                <div className="absolute bottom-0 left-0 right-0 md:relative bg-white/95 dark:bg-[#0f172a]/95 border-t border-slate-100 dark:border-slate-800 p-4 md:mt-8 md:p-0 space-y-4 z-20">
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black dark:text-white">${(product.price * quantity).toFixed(2)}</span>
                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-xl p-1 border border-slate-200 dark:border-slate-700">
                      <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="p-2 active:scale-75"><FaMinus size={10} /></button>
                      <span className="w-8 text-center font-bold dark:text-white">{quantity}</span>
                      <button onClick={() => setQuantity(q => q + 1)} className="p-2 active:scale-75"><FaPlus size={10} /></button>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    {/* BUTTON FIX: Added flex-shrink-0 and min-width handling */}
                    <button
                      onClick={() => cartHandler(false)}
                      disabled={loader}
                      className="flex-1 min-w-0 h-12 md:h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all disabled:opacity-50 px-2"
                    >
                      <FiShoppingCart className="shrink-0" />
                      <span className="truncate">{loader ? "Adding..." : "Add to Cart"}</span>
                    </button>
                    <button
                      onClick={() => cartHandler(true)}
                      className="flex-[1.5] min-w-0 h-12 md:h-14 bg-blue-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 transition-all px-2"
                    >
                      <span className="truncate">Buy Now</span>
                      <FiArrowRight className="shrink-0" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full p-8 bg-white dark:bg-slate-900"><LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} isNested={true} /></div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);