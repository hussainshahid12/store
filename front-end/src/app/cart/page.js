"use client";

import Link from "next/link";
import { useState } from "react";

export default function page() {
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
      img: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac-front.svg",
    },
    {
      id: "watch",
      name: "Apple Watch Series 8",
      price: 598,
      img: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch-light.svg",
    },
    {
      id: "macbook",
      name: "MacBook Pro 16” M3",
      price: 1799,
      img: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/macbook-pro-light.svg",
    },
    {
      id: "ipad",
      name: "iPad Pro 12.9”",
      price: 699,
      img: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-light.svg",
    },
    {
      id: "iphone",
      name: "iPhone 15 Pro",
      price: 2997,
      img: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone-light.svg",
    },
  ];

  // ✅ QUANTITY UPDATE HANDLER + CONSOLE LOG
  const updateQty = (id, type) => {
    setQty((prev) => {
      const current = prev[id] || 1;

      const newQty =
        type === "inc"
          ? current + 1
          : type === "dec"
          ? Math.max(1, current - 1)
          : current;

      // ✅ SHOW UPDATED ITEM IN CONSOLE
      const updatedItem = items.find((item) => item.id === id);
      console.log("Updated Item:", {
        ...updatedItem,
        quantity: newQty,
        totalPrice: updatedItem.price * newQty,
      });

      return {
        ...prev,
        [id]: newQty,
      };
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
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-6 bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={item.img}
                  alt={item.name}
                  className="w-20 h-20 object-contain"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{item.name}</h3>

                  <div className="flex gap-6 mt-3 text-sm">
                    <button className="text-gray-500 hover:text-gray-700 cursor-pointer">
                      Save for later
                    </button>

                    <button className="text-red-600 hover:text-red-700 cursor-pointer">
                      Remove
                    </button>
                  </div>
                </div>

                {/* ✅ QUANTITY CONTROLS */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => updateQty(item.id, "dec")}
                    className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg cursor-pointer"
                  >
                    −
                  </button>

                  <span className="w-12 text-center font-medium select-none">
                    {qty[item.id]}
                  </span>

                  <button
                    onClick={() => updateQty(item.id, "inc")}
                    className="w-9 h-9 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center justify-center text-lg cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* ✅ PRICE */}
                <div className="font-bold text-lg w-28 text-right">
                  $
                  {(item.price * (qty[item.id] || 1)).toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT SIDE SUMMARY */}
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm lg:sticky lg:top-6">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-4 text-lg">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-green-600 font-medium">
                  <span>Savings</span>
                  <span>-${savings.toLocaleString()}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toLocaleString()}</span>
                </div>

                <div className="border-t pt-4 font-bold text-xl flex justify-between">
                  <span>Total</span>
                  <span>${total.toLocaleString()}</span>
                </div>
              </div>

              <button className="w-full mt-8 bg-blue-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition cursor-pointer">
                Proceed to Checkout
              </button>

              <Link
                href="/"
                className="block text-center mt-4 text-blue-600 hover:text-blue-700 font-medium cursor-pointer"
              >
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
