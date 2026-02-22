"use client";
import Link from "next/link";
import { useState } from "react";
import { FiShoppingBag, FiLock } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import Loader from "@/components/loader/Loader";
import EmptyCartView from "@/components/emptyCard/EmptyCartView";
import CartItem from "@/components/cartItems/CartItem";

export default function CartPage() {
  const dispatch = useDispatch();

  // --- REDUX STATE ---
  const cartData = useSelector((state) => state.cartSlice?.items?.cart);
  const items = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );

  // --- LOCAL CONTROL STATES ---
  const [updatingId, setUpdatingId] = useState(null); // For quantity updates
  const [removingId, setRemovingId] = useState(null); // For item removal
  const [isReady, setIsReady] = useState(false);

  // useEffect(() => {
  //   const loadData = async () => {
  //     await dispatch(fetchCartItems());
  //     setIsReady(true);
  //   };
  //   loadData();
  // }, [dispatch]);

  const tax = 79;

  // Only show full-page loader for initial data fetch
  // if (!isReady) {
  //   return (
  //     <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center">
  //       <Loader />
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-[#f8fafc] py-6 md:py-12 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-2">
          <div>
            <div className="flex items-center gap-2 text-[#ff6600] font-bold text-[10px] md:text-sm uppercase tracking-widest mb-1 md:mb-2">
              <FiShoppingBag />
              <span>Your Selection</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
              Shopping Cart<span className="text-[#ff6600]">.</span>
            </h1>
          </div>
          {items.length > 0 && (
            <p className="text-slate-500 font-medium text-sm md:text-base">
              {items.length} premium items in your bag
            </p>
          )}
        </div>

        {items.length === 0 ? (
          <EmptyCartView />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* --- ITEMS LIST --- */}
            <CartItem
              items={items}
              updatingId={updatingId}
              setUpdatingId={setUpdatingId}
              removingId={removingId}
              setRemovingId={setRemovingId}
            />

            {/* --- SIDEBAR --- */}
            <div className="lg:col-span-4">
              <div className="bg-white rounded-[2rem] md:rounded-[2.5rem] border border-slate-200 p-6 md:p-8 sticky top-10 shadow-sm">
                <h2 className="text-xl md:text-2xl font-black mb-6 md:mb-8 tracking-tight">
                  Order Summary
                </h2>

                <div
                  className={`space-y-4 mb-8 transition-opacity duration-300 ${updatingId || removingId ? "opacity-50" : "opacity-100"}`}
                >
                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Subtotal</span>
                    <span className="text-slate-900 font-bold">
                      ${cartData?.totalPrice?.toFixed(2)}
                    </span>
                  </div>

                  {cartData?.discountAmount > 0 && (
                    <div className="flex justify-between items-center bg-emerald-50 text-emerald-700 px-4 py-3 rounded-xl text-sm font-bold">
                      <span>Total Savings</span>
                      <span>-${cartData?.discountAmount?.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-slate-500 font-medium text-sm">
                    <span>Estimated Tax</span>
                    <span className="text-slate-900 font-bold">${tax}</span>
                  </div>

                  <div className="h-px bg-slate-100 my-4" />

                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Total Amount
                    </p>
                    <p className="text-3xl font-black text-slate-900 leading-none mt-1">
                      ${(Number(cartData?.finalPrice || 0) + tax).toFixed(2)}
                    </p>
                  </div>
                </div>

                <button
                  disabled={!!updatingId || !!removingId}
                  className="group w-full bg-slate-900 text-white py-4 md:py-5 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-xl hover:bg-black active:scale-[0.98] transition-all mb-6 disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <FiLock className="group-hover:text-[#ff6600] transition-colors" />
                  Proceed to Checkout
                </button>

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
