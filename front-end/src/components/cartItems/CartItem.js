import React from "react";
import { useState } from "react";
import { FiTrash2, FiMinus, FiPlus, FiLoader } from "react-icons/fi";
import {
  fetchCartUdateQnty,
  fetchCartItemRmove,
} from "../../../lib/features/cartSlice/cart";
import { useDispatch } from "react-redux";
import { Toaster, toast } from "react-hot-toast";

const CartItem = ({
  items,
  updatingId,
  setUpdatingId,
  removingId,
  setRemovingId,
}) => {
  const dispatch = useDispatch();

  const [qty, setQty] = useState({});

  const updateQty = async (id, type, currentQty) => {
    const currentVal = qty[id] || currentQty;
    const newVal =
      type === "inc" ? currentVal + 1 : Math.max(1, currentVal - 1);

    setQty((prev) => ({ ...prev, [id]: newVal }));
    setUpdatingId(id);

    try {
      await dispatch(
        fetchCartUdateQnty({ productId: id, quantity: newVal }),
      ).unwrap();
    } catch (error) {
      console.error("Update failed:", error);
    } finally {
      setUpdatingId(null);
    }
  };

  // --- INLINE REMOVE LOGIC ---
  const removeItem = async (id) => {
    setRemovingId(id); // Set the specific ID being removed
    try {
      await dispatch(fetchCartItemRmove({ productId: id })).unwrap();
    } catch (error) {
      toast.error("Failed to remove item");
    } finally {
      setRemovingId(null); // Reset
    }
  };

  return (
    <div className="lg:col-span-8 space-y-4">
      <Toaster position="top-center" />
      {items.map((item) => (
        <div
          key={item.id}
          className={`group bg-white rounded-3xl border border-slate-100 p-3 md:p-6 flex flex-row items-center gap-4 md:gap-6 transition-all hover:shadow-xl hover:shadow-slate-200/50 ${
            removingId === item.productId
              ? "opacity-50 pointer-events-none"
              : "opacity-100"
          }`}
        >
          {/* Left Side: Image */}
          <div className="w-24 h-24 md:w-32 md:h-32 bg-slate-50 rounded-2xl flex-shrink-0 flex items-center justify-center p-2 overflow-hidden group-hover:bg-orange-50">
            <img
              src={item.image}
              alt={item.title}
              className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-110"
            />
          </div>

          {/* Right Side: Content */}
          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-start gap-2">
              <div className="truncate">
                <h3 className="text-sm md:text-lg font-bold text-slate-800 tracking-tight truncate">
                  {item.title}
                </h3>
                <p className="text-[10px] md:text-xs text-slate-400 font-medium uppercase tracking-wider">
                  ID: {item.productId.slice(-8)}{" "}
                  <span className="mx-2 text-slate-200">|</span> Qty:{" "}
                  {item.quantity}
                </p>
              </div>

              {/* --- INLINE DELETE LOADER --- */}
              <button
                className="p-2 transition-colors flex-shrink-0"
                onClick={() => removeItem(item.productId)}
                disabled={removingId === item.productId}
              >
                {removingId === item.productId ? (
                  <FiLoader
                    className="animate-spin text-orange-500"
                    size={18}
                  />
                ) : (
                  <FiTrash2
                    className="text-slate-300 hover:text-red-500"
                    size={18}
                  />
                )}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 md:mt-6 gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center bg-slate-50 rounded-xl p-1 border border-slate-100 w-fit">
                <button
                  disabled={
                    updatingId === item.productId ||
                    removingId === item.productId
                  }
                  onClick={() =>
                    updateQty(item.productId, "dec", item.quantity)
                  }
                  className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiMinus size={14} />
                </button>
                <span className="w-8 md:w-10 text-center font-bold text-slate-800 text-sm md:text-base">
                  {qty[item.id] || item.quantity}
                </span>
                <button
                  disabled={
                    updatingId === item.productId ||
                    removingId === item.productId
                  }
                  onClick={() =>
                    updateQty(item.productId, "inc", item.quantity)
                  }
                  className="w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center hover:bg-white text-slate-600 disabled:opacity-30 transition-all shadow-sm"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              {/* Pricing Section */}
              <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                <p className="text-[10px] md:text-xs text-slate-400 font-bold uppercase tracking-tighter">
                  Unit: ${item.price}
                </p>
                <div className="h-6 flex items-center">
                  {updatingId === item.productId ? (
                    <div className="flex items-center gap-2 text-orange-500">
                      <FiLoader className="animate-spin" size={14} />
                      <span className="text-[10px] font-bold uppercase">
                        Updating
                      </span>
                    </div>
                  ) : (
                    <p className="text-base md:text-xl font-black text-slate-900">
                      $
                      {(item.price * (qty[item.id] || item.quantity)).toFixed(
                        2,
                      )}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItem;
