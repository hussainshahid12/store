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

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
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
      router.push(
        `/checkout?mode=buy-now&productId=${product._id}&quantity=${quantity}`
      );
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
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white dark:bg-[#0f172a] w-full max-w-5xl md:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden flex flex-col md:flex-row h-[90vh] md:h-auto shadow-2xl relative"
      >
        <AnimatePresence mode="wait">
          {!showLoginPrompt ? (
            <>
              {/* LEFT: IMAGE SECTION */}
              <div className="w-full md:w-1/2 bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-6 md:p-12 relative border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800">
                <button
                  onClick={onClose}
                  className="md:hidden absolute top-4 right-4 z-50 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full shadow-md text-slate-600"
                >
                  <FaTimes size={18} />
                </button>

                <div className="absolute top-6 left-6 z-10">
                  <span className="flex items-center gap-1.5 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-tight shadow-lg">
                    <FiCheckCircle size={10} /> In Stock
                  </span>
                </div>

                {/* --- IMAGE CONTAINER --- */}
                {/* We use a forced height (h-[280px]) to ensure production CSS doesn't collapse it */}
                <div className="relative w-full h-[280px] md:h-[450px] flex items-center justify-center">
                  <Image
                    src={product.thumbnail || "/placeholder.png"}
                    alt={product.title || "Product"}
                    fill
                    priority={true} // CRITICAL for production modals
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-contain drop-shadow-2xl"
                    onLoadingComplete={(img) => console.log("Image Loaded")}
                  />
                </div>
              </div>

              {/* RIGHT: INFO SECTION */}
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="hidden md:flex justify-end p-4">
                  <button
                    onClick={onClose}
                    className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
                  >
                    <FaTimes size={20} className="text-slate-400" />
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 md:px-10 md:pt-0 pb-40 md:pb-10">
                  <span className="text-blue-600 dark:text-blue-400 font-bold text-[11px] uppercase tracking-[0.2em] mb-3 block">
                    {product.brand || "Premium Selection"}
                  </span>
                  <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white leading-tight mb-4">
                    {product.title}
                  </h2>

                  <div className="flex items-center gap-4 mb-6">
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      ${product.price?.toFixed(2)}
                    </span>
                    {product.discountPercentage > 0 && (
                      <span className="text-slate-400 line-through text-lg">
                        ${(product.price / (1 - product.discountPercentage / 100)).toFixed(2)}
                      </span>
                    )}
                  </div>

                  <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed">
                    {product.description}
                  </p>
                </div>

                {/* ACTION BAR */}
                <div className="absolute bottom-0 left-0 right-0 md:relative bg-white/90 dark:bg-[#0f172a]/90 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 p-6 md:p-10 space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Price</p>
                      <p className="text-2xl font-black dark:text-white">${(product.price * quantity).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center bg-slate-100 dark:bg-slate-900 rounded-2xl p-1.5 border border-slate-200 dark:border-slate-700">
                      <button
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <FaMinus size={12} />
                      </button>
                      <span className="w-12 text-center font-bold text-lg dark:text-white">{quantity}</span>
                      <button
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-10 h-10 flex items-center justify-center text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <FaPlus size={12} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => cartHandler(false)}
                      disabled={loader}
                      className="flex-1 h-14 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all disabled:opacity-50"
                    >
                      <FiShoppingCart size={18} />
                      <span>{loader ? "Adding..." : "Add to Cart"}</span>
                    </button>
                    <button
                      onClick={() => cartHandler(true)}
                      className="flex-[1.5] h-14 bg-blue-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-[0.98] transition-all hover:bg-blue-700"
                    >
                      Buy Now <FiArrowRight />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="w-full flex flex-col items-center justify-center p-10 bg-white dark:bg-slate-900 min-h-[400px]">
               <button 
                onClick={() => setShowLoginPrompt(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"
               >
                 <FaTimes size={24} />
               </button>
               <LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} isNested={true} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default memo(QuickViewModal);