"use client";
import Link from "next/link";
import { useState } from "react";
import { FiTrash2, FiShoppingBag, FiLock, FiTruck, FiRefreshCw, FiMinus, FiPlus } from "react-icons/fi";
import { BsArrowLeft } from "react-icons/bs";

export default function Page() {
  const [qty, setQty] = useState({
    imac: 2,
    watch: 1,
    macbook: 1,
    ipad: 1,
    iphone: 3,
  });

  const items = [
    {
      id: "imac",
      name: "Apple iMac 24” M3",
      price: 1499,
      img: "https://www.gadgetguy.com.au/wp-content/uploads/2023/11/Apple-iMac-M3-24-inch-2023-review.jpg",
    },
    {
      id: "watch",
      name: "Apple Watch Series 8",
      price: 598,
      img: "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111848_apple-watch-series8.png",
    },
    {
      id: "macbook",
      name: "MacBook Pro 16” M3",
      price: 1799,
      img: "https://media.istockphoto.com/id/1202959798/photo/macbook-pro-16-inch-with-touchbar-front-view.jpg?s=612x612&w=0&k=20&c=Uj7nnv5j_STbkW03MaXNKQtdUxiN5AQD9JF0Dw1i0WQ=",
    },
    {
      id: "ipad",
      name: "iPad Pro 12.9”",
      price: 699,
      img: "https://c8.alamy.com/comp/2E2224A/new-ipad-pro-129-inches-and-apple-pencil-from-apple-on-a-light-background-studio-shot-in-uzhgorod-ukraine-2E2224A.jpg",
    },
    {
      id: "iphone",
      name: "iPhone 15 Pro",
      price: 2997,
      img: "https://www.apple.com/newsroom/images/2023/09/apple-unveils-iphone-15-pro-and-iphone-15-pro-max/article/Apple-iPhone-15-Pro-lineup-hero-230912_Full-Bleed-Image.jpg.large.jpg",
    },
  ];

  const updateQty = (id, type) => {
    setQty((prev) => {
      const current = prev[id] || 1;
      const newQty =
        type === "inc"
          ? current + 1
          : type === "dec"
          ? Math.max(1, current - 1)
          : current;
      return { ...prev, [id]: newQty };
    });
  };

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * (qty[item.id] || 1),
    0
  );
  const savings = 299;
  const tax = 799;
  const total = subtotal - savings + tax;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 flex items-center justify-center gap-3">
            <FiShoppingBag className="text-3xl sm:text-4xl text-indigo-600" />
            Your Shopping Cart
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600">Review and manage your selected items</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col sm:flex-row items-start sm:items-center border border-slate-100 overflow-hidden"
              >
                {/* Image Container - Perfectly Centered on Mobile */}
                <div className="w-full sm:w-auto p-4 sm:p-5 bg-gradient-to-br from-indigo-50 to-purple-50 flex items-center justify-center flex-shrink-0">
                  <div className="w-32 h-32 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                    <img
                      src={item.img}
                      alt={item.name}
                      className="max-w-full max-h-full object-contain drop-shadow-md"
                    />
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 p-4 sm:p-5 w-full">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-slate-900 leading-tight pr-4">
                      {item.name}
                    </h3>

                    <button className="cursor-pointer flex items-center gap-1.5 text-red-600 hover:text-red-700 transition text-sm font-medium self-start sm:self-center">
                      <FiTrash2 className="text-sm" />
                      Remove
                    </button>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateQty(item.id, "dec")}
                        className="cursor-pointer w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition touch-manipulation"
                        aria-label="Decrease quantity"
                      >
                        <FiMinus className="text-base" />
                      </button>

                      <span className="text-lg sm:text-xl font-bold text-slate-900 w-12 text-center">
                        {qty[item.id]}
                      </span>

                      <button
                        onClick={() => updateQty(item.id, "inc")}
                        className="cursor-pointer w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition touch-manipulation"
                        aria-label="Increase quantity"
                      >
                        <FiPlus className="text-base" />
                      </button>
                    </div>

                    <div className="text-lg sm:text-xl font-bold text-indigo-600 text-right sm:text-left">
                      ${(item.price * (qty[item.id] || 1)).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sm:p-8 lg:sticky lg:top-8 border border-slate-100">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mb-6">Order Summary</h2>
              <div className="space-y-4 text-base">
                <div className="flex justify-between">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Savings</span>
                  <span>-${savings.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Estimated Tax</span>
                  <span className="font-medium">${tax.toLocaleString()}</span>
                </div>
                <div className="border-t-2 border-slate-200 pt-5">
                  <div className="flex justify-between text-xl sm:text-2xl font-extrabold text-slate-900">
                    <span>Total</span>
                    <span className="text-indigo-600">${total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button className="cursor-pointer w-full mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl text-base sm:text-lg font-bold hover:from-indigo-700 hover:to-purple-700 transition shadow-lg flex items-center justify-center gap-3">
                <FiLock className="text-lg" />
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center mt-5 text-indigo-600 hover:text-indigo-700 font-medium text-sm sm:text-base transition flex items-center justify-center gap-2"
              >
                <BsArrowLeft className="text-lg" />
                Continue Shopping
              </Link>

              <div className="mt-8 pt-6 border-t border-slate-200 flex flex-wrap justify-center gap-4 text-slate-600 text-xs sm:text-sm font-medium">
                <div className="flex items-center gap-2">
                  <FiLock className="text-green-600" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiTruck className="text-green-600" />
                  <span>Free Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <FiRefreshCw className="text-green-600" />
                  <span>30-Day Returns</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}