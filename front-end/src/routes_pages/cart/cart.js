"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { FiShoppingBag, FiLock } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import { useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";
import EmptyCartView from "@/components/emptyCard/EmptyCartView";
import CartItem from "@/components/cartItems/CartItem";

export default function CartPage() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // New state to prevent empty screen flicker
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  // --- REDUX STATE ---
  const cartData = useSelector((state) => state?.cartSlice?.items?.cart || {});
  const items = useSelector(
    (state) => state?.cartSlice?.items?.cart?.items || [],
  );

  useEffect(() => {
    setIsClient(true);

    // Give Redux Persist or the Store a tiny moment to hydrate the data
    // This stops the "EmptyCartView" from showing for a split second on refresh
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [items]);

  const tax = 79;

  // 1. Show Loader while the page is mounting OR while Redux is still "empty" during hydration
  if (!isClient || isLoading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  // --- CALCULATIONS ---
  const subtotal = Number(cartData?.totalPrice || 0);
  const discount = Number(cartData?.discountAmount || 0);
  const finalPrice = Number(cartData?.finalPrice || 0);
  const totalWithTax = (finalPrice + tax).toFixed(2);

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 md:py-12 font-sans text-slate-900 mt-[150px] ">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-2">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">
              <FiShoppingBag />
              <span>Your Selection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Shopping Cart<span className="text-primary">.</span>
            </h1>
          </div>
          {items.length > 0 && (
            <p className="text-slate-500 font-medium text-sm md:text-base">
              {items.length} premium items in your bag
            </p>
          )}
        </div>

        {/* Main Content: Check if items actually exist after the loading phase */}
        {items.length === 0 ? (
          <EmptyCartView exploreProducts={true} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Left Side: Cart Items List */}
            <div className="lg:col-span-8">
              <CartItem
                items={items}
                updatingId={updatingId}
                setUpdatingId={setUpdatingId}
                removingId={removingId}
                setRemovingId={setRemovingId}
              />
            </div>

            {/* Right Side: Order Summary sticky sidebar */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-4xl md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 sticky top-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tight">
                  Order Summary
                </h2>

                <div
                  className={`space-y-4 mb-8 transition-opacity duration-300 ${updatingId || removingId ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">
                      ${subtotal.toFixed(2)}
                    </span>
                  </div>

                  {discount > 0 && (
                    <div className="flex justify-between items-center bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold">
                      <span>Total Savings</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Estimated Tax</span>
                    <span className="text-slate-900 font-bold">
                      ${tax.toFixed(2)}
                    </span>
                  </div>

                  <div className="h-px bg-slate-100 my-4" />

                  <div className="mt-4">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Amount
                    </p>
                    <p className="text-3xl font-black text-slate-900 leading-none mt-1">
                      ${totalWithTax}
                    </p>
                  </div>
                </div>

                <Link href="/checkout">
                  <button
                    disabled={!!updatingId || !!removingId}
                    className="cursor-pointer group w-full bg-primary text-white py-4 md:py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-black active:scale-[0.98] transition-all mb-6 disabled:bg-slate-300 disabled:cursor-not-allowed"
                  >
                    <FiLock />
                    Proceed to Checkout
                  </button>
                </Link>

                <Link
                  href="/"
                  className="group flex justify-center items-center gap-2 text-slate-400 hover:text-[#ff6600] font-bold text-sm transition-colors"
                >
                  <BsArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
