import React, { useState, useEffect } from "react";
import Image from "next/image";
import { HiOutlineX, HiMinus, HiPlus, HiArrowRight } from "react-icons/hi";
import { useRouter } from "next/navigation";

const BuyAgainModal = ({ product, onClose }) => {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (product) {
      setQuantity(product.quantity || 1);
      setTimeout(() => setIsAnimating(true), 10);
    }
  }, [product]);

  const handleClose = () => {
    setIsAnimating(false);
    setTimeout(onClose, 200);
  };
  const checkoutHandler = () => {
    console.log(product, quantity);
    const id = product.productId;
    router.push(`/checkout?mode=buy-now&productId=${id}&quantity=${quantity}`);
  };

  if (!product) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 transition-all duration-500 ${
        isAnimating
          ? "bg-black/40 backdrop-blur-md"
          : "bg-black/0 backdrop-blur-0"
      }`}
      onClick={handleClose}
    >
      {/* MODAL CONTAINER 
         md:max-w-xl ensures it doesn't go full screen on large devices 
      */}
      <div
        className={` bg-white w-full md:max-w-[500px] rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.2)] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] transform ${
          isAnimating
            ? "opacity-100 translate-y-0 scale-100"
            : "opacity-0 translate-y-12 scale-95"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative p-8 md:p-10">
          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-8 right-8 p-2 hover:bg-gray-100 rounded-full transition-colors group"
          >
            <HiOutlineX className="w-5 h-5 text-gray-400 group-hover:text-black" />
          </button>

          {/* Product Info Section */}
          <div className="mb-10 text-center md:text-left">
            <h3 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">
              Buy It Again
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              Review details and update quantity for your new order.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-10">
            {/* High-End Image Preview */}
            <div className="relative h-44 w-36 shrink-0 rounded-[2rem] overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-500">
              <Image
                src={product.image}
                alt={product.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left pt-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                In Stock
              </span>
              <h4 className="font-extrabold text-gray-900 text-xl mt-4 leading-tight">
                {product.title}
              </h4>
              <p className="text-2xl font-black text-gray-900 mt-2 tracking-tighter">
                ${product.price.toFixed(2)}
              </p>
            </div>
          </div>

          {/* Interaction Area */}
          <div className="space-y-6">
            <div className="flex items-center justify-between bg-gray-50 border border-gray-100 p-2 rounded-[2rem]">
              <span className="ml-6 text-[10px] font-black uppercase text-gray-400 tracking-widest">
                Quantity
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md active:scale-90 transition-all border border-gray-100"
                >
                  <HiMinus className="w-4 h-4 text-gray-900" />
                </button>
                <span className="text-xl font-black w-10 text-center tabular-nums text-gray-900">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm hover:shadow-md active:scale-90 transition-all border border-gray-100"
                >
                  <HiPlus className="w-4 h-4 text-gray-900" />
                </button>
              </div>
            </div>

            {/* Price Summary */}
            <div className="flex justify-between items-center px-2">
              <div className="text-left">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  Estimated Total
                </span>
                <p className="text-xs text-gray-400 font-medium mt-0.5">
                  Excluding shipping & taxes.
                </p>
              </div>
              <span className="text-4xl font-black text-gray-900 tracking-tighter tabular-nums">
                ${(product.price * quantity).toFixed(2)}
              </span>
            </div>

            {/* CTA Button */}
            <button
              onClick={checkoutHandler}
              className="group w-full flex items-center justify-between bg-black text-white p-6 rounded-[2rem] font-black uppercase tracking-widest text-[11px] hover:bg-gray-800 transition-all active:scale-[0.98] shadow-xl"
            >
              <span>Checkout This Order</span>
              <HiArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyAgainModal;
