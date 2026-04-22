"use client";

import React, { useState } from "react";
import { FiTrash2, FiMinus, FiPlus, FiLoader } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";
import Image from "next/image";
import {
  fetchCartUdateQnty,
  fetchCartItemRmove,
} from "../../../lib/features/cartSlice/cart";

const CartItem = ({
  items,
  updatingId,
  setUpdatingId,
  removingId,
  setRemovingId,
}) => {
  const dispatch = useDispatch();
  const [qty, setQty] = useState({});

  const updateQty = async (productId, type, currentQty) => {
    const currentVal = qty[productId] || currentQty;
    const newVal =
      type === "inc" ? currentVal + 1 : Math.max(1, currentVal - 1);

    if (newVal === currentVal) return;

    setQty((prev) => ({ ...prev, [productId]: newVal }));
    setUpdatingId(productId);

    try {
      await dispatch(
        fetchCartUdateQnty({ productId, quantity: newVal }),
      ).unwrap();
    } catch (error) {
      toast.error("Update failed");
      setQty((prev) => ({ ...prev, [productId]: currentQty }));
    } finally {
      setUpdatingId(null);
    }
  };

  const removeItem = async (productId) => {
    setRemovingId(productId);
    try {
      await dispatch(fetchCartItemRmove({ productId })).unwrap();
      toast.success("Item removed");
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="lg:col-span-8 space-y-6">
      <Toaster position="top-right" />

      {items.map((item) => {
        // Use productId consistently across all logic to prevent hydration/key errors
        const currentItemQty = qty[item.productId] || item.quantity;
        const isRemoving = removingId === item.productId;
        const isUpdating = updatingId === item.productId;

        return (
          <div
            key={item.productId} // FIX: Unique Key Issue Resolved
            className={`relative group bg-white rounded-2xl ring-1 ring-slate-200/60 p-4 md:p-5 flex flex-row items-center gap-5 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/40 hover:ring-slate-300 ${
              isRemoving
                ? "opacity-40 grayscale pointer-events-none"
                : "opacity-100"
            }`}
          >
            {/* Image Container */}
            <div className="relative w-24 h-24 md:w-28 md:h-28 flex-shrink-0 bg-slate-50 rounded-xl overflow-hidden border border-slate-100">
              <Image
                src={item.image}
                alt={item.title}
                fill
                sizes="112px"
                className="object-contain p-2 transition-transform duration-500 group-hover:scale-105"
                priority
              />
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col justify-between self-stretch py-1">
              <div className="flex justify-between items-start">
                <div className="max-w-[80%]">
                  <h3 className="text-sm md:text-base font-semibold text-slate-800 leading-tight line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-medium mt-1 tracking-wide">
                    SKU: {item.productId?.slice(-8).toUpperCase()}
                  </p>
                </div>

                <button
                  onClick={() => removeItem(item.productId)}
                  disabled={isRemoving}
                  className="p-2 -mr-2 text-slate-300 hover:text-red-500 transition-colors duration-200"
                >
                  {isRemoving ? (
                    <FiLoader className="animate-spin" size={18} />
                  ) : (
                    <FiTrash2 size={18} />
                  )}
                </button>
              </div>

              {/* Bottom Row: Controls & Price */}
              <div className="flex items-end justify-between mt-auto">
                {/* Quantity Switcher */}
                <div className="flex items-center bg-slate-100/80 rounded-lg p-1">
                  <button
                    disabled={isUpdating || isRemoving || currentItemQty <= 1}
                    onClick={() =>
                      updateQty(item.productId, "dec", item.quantity)
                    }
                    className={`w-8 h-8 rounded-md flex items-center justify-center transition-all ${
                      currentItemQty <= 1
                        ? "text-slate-300 cursor-not-allowed"
                        : "text-slate-600 hover:bg-white hover:shadow-sm active:scale-95"
                    }`}
                  >
                    <FiMinus size={14} />
                  </button>

                  <span className="w-9 text-center font-bold text-slate-700 text-sm tabular-nums">
                    {currentItemQty}
                  </span>

                  <button
                    disabled={isUpdating || isRemoving}
                    onClick={() =>
                      updateQty(item.productId, "inc", item.quantity)
                    }
                    className="w-8 h-8 rounded-md flex items-center justify-center text-slate-600 hover:bg-white hover:shadow-sm active:scale-95 transition-all"
                  >
                    <FiPlus size={14} />
                  </button>
                </div>

                {/* Price Display */}
                <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-0.5">
                    Unit Price: ${item?.price}
                  </p>

                  <div className="flex items-center justify-end h-7">
                    {isUpdating ? (
                      <div className="flex items-center gap-1.5 text-primary animate-pulse">
                        <FiLoader className="animate-spin" size={12} />
                        <span className="text-[10px] font-bold uppercase">
                          Updating
                        </span>
                      </div>
                    ) : (
                      <p className="text-lg md:text-xl font-bold text-slate-900 tabular-nums">
                        ${(item.price * currentItemQty).toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItem;
