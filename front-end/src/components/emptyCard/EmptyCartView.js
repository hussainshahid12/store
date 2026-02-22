import React from "react";
import { FiShoppingBag, FiShoppingCart } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import Link from "next/link";

const EmptyCartView = () => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="relative mb-8">
      <div className="absolute inset-0 bg-orange-100 rounded-full blur-2xl opacity-50 scale-150"></div>
      <div className="relative w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-xl border border-slate-50">
        <FiShoppingBag size={48} className="text-[#ff6600]" />
      </div>
    </div>
    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">
      Your cart is empty<span className="text-[#ff6600]">.</span>
    </h2>
    <p className="text-slate-500 font-medium max-w-sm mb-10 leading-relaxed">
      It looks like you haven&apos;t added any premium items to your selection
      yet. Start exploring our collection to find something special.
    </p>
    <Link
      href="/"
      className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold shadow-xl hover:bg-black transition-all active:scale-95"
    >
      <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
      Explore Products
    </Link>
  </div>
);

export default EmptyCartView;
