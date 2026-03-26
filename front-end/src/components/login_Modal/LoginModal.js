import React from "react";
import { FiArrowRight } from "react-icons/fi";
import { FaTimes, FaLock } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

// Added isNested prop
const LOGINMODAL = ({ setShowLoginPrompt, isNested = false }) => {
  
  // This is the core content of the login prompt
  const LoginContent = (
    <div className={`${isNested ? "" : "bg-white w-full max-w-sm rounded-[2.5rem] p-10 shadow-2xl relative z-[1001]"} text-center`}>
      {!isNested && (
        <button
          onClick={() => setShowLoginPrompt(false)}
          className="absolute top-6 right-6 text-gray-300 hover:text-black cursor-pointer"
        >
          <FaTimes />
        </button>
      )}
      
      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
        <FaLock className="text-primary text-3xl" />
      </div>
      
      <h3 className="text-2xl font-black mb-2 text-zinc-900">
        Sign In Required
      </h3>
      
      <p className="text-zinc-500 text-sm mb-8 px-4">
        Log in to your account to add items to your cart and proceed to checkout.
      </p>
      
      <div className="flex flex-col gap-3">
        <Link
          href="/login"
          className="w-full bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:shadow-lg transition-all active:scale-95"
        >
          Go to Login <FiArrowRight />
        </Link>
        
        <button
          onClick={() => setShowLoginPrompt(false)}
          className="text-zinc-400 text-[10px] font-black uppercase tracking-widest mt-2 cursor-pointer hover:text-primary transition-colors"
        >
          {isNested ? "← Back to Product" : "Continue Browsing"}
        </button>
      </div>
    </div>
  );

  // If nested inside another modal, don't render the fixed background/overlay
  if (isNested) {
    return LoginContent;
  }

  // Standard standalone modal behavior
  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowLoginPrompt(false)}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
        >
          {LoginContent}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LOGINMODAL;