"use client";

import Link from "next/link";
import { useState } from "react";
import {
  HiOutlineMail,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineLocationMarker,
  HiOutlinePhone,
  HiOutlineLockClosed,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineChevronLeft,
  HiOutlineShieldCheck,
  HiOutlineCube,
} from "react-icons/hi";

export default function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(0);

  const savedAddresses = [
    "House 21, Street 12, Model Town, Lahore, Pakistan",
    "House 45, DHA Phase 6, Karachi, Pakistan",
    "Flat 12B, Blue Area, Islamabad, Pakistan",
  ];

  const items = [
    { name: "Apple iMac 24” M3", price: 1499, qty: 2 },
    { name: "Apple Watch Series 8", price: 598, qty: 1 },
    { name: "MacBook Pro 16” M3 Pro", price: 1799, qty: 1 },
    { name: "iPad Pro 12.9”", price: 1099, qty: 1 },
    { name: "iPhone 15 Pro Max", price: 1199, qty: 3 },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);
  const savings = 299;
  const tax = 799;
  const shipping = 0;
  const total = subtotal - savings + tax + shipping;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">

        {/* Back to Cart */}
        <Link
          href="/cart"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium mb-8 transition-colors"
        >
          <HiOutlineChevronLeft className="w-5 h-5" />
          Back to Cart
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* LEFT FORM */}
          <div className="lg:col-span-2 space-y-10">
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <HiOutlineCheckCircle className="w-10 h-10 text-blue-600" />
              Checkout
            </h1>

            {/* Contact */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <input
                placeholder="Email Address"
                className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* Shipping Address */}
            <div className="bg-white p-8 rounded-2xl shadow space-y-4">
              <input placeholder="First Name" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400" />
              <input placeholder="Last Name" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400" />
              <input placeholder="Full Address" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400" />
              <input placeholder="City" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400" />
              <input placeholder="Phone Number" className="w-full p-4 border rounded-xl focus:ring-2 focus:ring-blue-400" />

              {/* Saved Addresses */}
              <div className="mt-6">
                <p className="font-bold mb-3 text-gray-700">Use a saved address:</p>
                <div className="space-y-3">
                  {savedAddresses.map((addr, index) => (
                    <label
                      key={index}
                      className={`flex items-center justify-between p-4 border rounded-xl cursor-pointer transition-all
                        ${selectedAddressIndex === index ? "border-blue-600 bg-blue-50" : "border-gray-200 bg-white hover:bg-blue-50"}`}
                    >
                      <span className="text-gray-800">{addr}</span>
                      <input
                        type="radio"
                        name="savedAddress"
                        checked={selectedAddressIndex === index}
                        onChange={() => setSelectedAddressIndex(index)}
                        className="w-4 h-4 accent-blue-600"
                      />
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-8 rounded-2xl shadow">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>

              <label className="flex items-center gap-3 mb-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                  className="accent-blue-600"
                />
                Cash on Delivery
              </label>

              <label className="flex items-center gap-3">
                <input
                  type="radio"
                  name="payment"
                  checked={paymentMethod === "card"}
                  onChange={() => setPaymentMethod("card")}
                  className="accent-blue-600"
                />
                Pay with Card
              </label>
            </div>

            {/* Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 text-white py-5 rounded-xl font-bold transition-colors">
                Complete Order – ${total.toLocaleString()}
              </button>

              <Link href="/cart" className="px-8 py-5 border rounded-xl text-blue-600 hover:bg-blue-50 transition-colors">
                Cancel
              </Link>
            </div>
          </div>

          {/* RIGHT ORDER SUMMARY */}
          <div className="bg-white p-8 rounded-2xl shadow">
            <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

            {items.map((item, i) => (
              <div key={i} className="flex justify-between mb-3">
                <span>{item.name} (x{item.qty})</span>
                <span>${(item.price * item.qty).toLocaleString()}</span>
              </div>
            ))}

            <hr className="my-4" />

            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Savings</span>
              <span>-${savings}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax</span>
              <span>${tax}</span>
            </div>

            <div className="flex justify-between font-bold text-xl mt-4">
              <span>Total</span>
              <span>${total}</span>
            </div>

            <div className="mt-4 text-sm text-gray-500 flex gap-2 items-center">
              <HiOutlineShieldCheck className="text-blue-600" />
              Secure Checkout
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
