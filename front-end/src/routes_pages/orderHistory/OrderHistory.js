"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../../lib/features/orderSlice/orderSlice";
import Loader from "@/components/loader/Loader";
import CancelOrder from "@/components/cancelOrder/CancelOrder";
import { setParams } from "../../../utils/queryParams/params";
import {
  HiOutlineChevronLeft,
  HiOutlineTruck,
  HiOutlineClipboardList,
} from "react-icons/hi";
import Link from "next/link";
import OrderSkeleton from "@/components/skeletonLoader/OrderSkeleton";
import BuyAgainModal from "@/components/modals/BuyAgainModal";

const OrderHistory = () => {
  const dispatch = useDispatch();

  // 1. Redux State
  const { myOrders, isLoading: reduxLoading } = useSelector(
    (state) => state.orderSlice,
  );

  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("All");

  //  State for Buy Again Modal
  const [buyAgainProduct, setBuyAgainProduct] = useState(null);
  // This state prevents the "No Orders Found" UI from rendering
  // until the useEffect has checked the Redux store.
  const [isCheckingStore, setIsCheckingStore] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      // KEEPING YOUR CONDITION: Only fetch if the list is empty
      if (myOrders.length == 0) {
        await dispatch(fetchMyOrders());
      }
      // Once the check or fetch is complete, we allow the component to render the data
      setIsCheckingStore(false);
    };
    loadData();
  }, [dispatch]);

  // 2. Filter Logic
  const filteredOrders = (myOrders || []).filter((order) => {
    if (activeTab === "All") return true;
    if (activeTab === "Active")
      return ["Pending", "Confirmed", "Shipped"].includes(order.orderStatus);
    if (activeTab === "Completed") return order.orderStatus === "Delivered";
    if (activeTab === "Cancelled") return order.orderStatus === "Cancelled";
    return true;
  });

  const cancalOrderHander = (id) => {
    setIsModalOpen(true);
    setParams(id);
  };

  const getStatusStyles = (status) => {
    const styles = {
      Pending: "text-amber-700 bg-amber-50 border-amber-100",
      Confirmed: "text-blue-700 bg-blue-50 border-blue-100",
      Shipped: "text-purple-700 bg-purple-50 border-purple-100",
      Delivered: "text-emerald-700 bg-emerald-50 border-emerald-100",
      Cancelled: "text-rose-700 bg-rose-50 border-rose-100",
    };
    return styles[status] || "text-gray-700 bg-gray-50 border-gray-100";
  };

  // Handle opening the Buy Again modal
  const handleBuyAgainClick = (item) => {
    setBuyAgainProduct(item);
  };

  // 3. Loading Guard
  // Show skeleton if Redux is loading OR if our initial check hasn't finished.
  if (isCheckingStore) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <OrderSkeleton />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pb-20">
      {IsModalOpen && <CancelOrder setIsModalOpen={setIsModalOpen} />}
      {/* 3. Render the Buy Again Modal if a product is selected */}
      {buyAgainProduct && (
        <BuyAgainModal
          product={buyAgainProduct}
          onClose={() => setBuyAgainProduct(null)}
        />
      )}

      {/* ... (Header UI) */}

      {/* Header & Navigation */}
      <div className="bg-white border-b border-gray-200 pt-12 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Link
            href="/"
            className="group mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors"
          >
            <HiOutlineChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            Back to Shopping
          </Link>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                Order History
              </h1>
              <p className="text-gray-500 mt-2 font-medium">
                Track, manage, and review your previous purchases.
              </p>
            </div>

            {/* Tab Switcher */}
            <div className="inline-flex p-1.5 bg-gray-100 rounded-2xl shadow-inner">
              {["All", "Active", "Completed", "Cancelled"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-white text-black shadow-sm scale-[1.02]"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 mt-12">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-[2.5rem] p-20 text-center border border-gray-200 shadow-sm">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <HiOutlineClipboardList className="w-10 h-10 text-gray-300" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              No orders found
            </h2>
            <p className="text-gray-500 mt-2">
              It looks like there’s nothing in this category yet.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-8 px-10 py-4 bg-black text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-95"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-10">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
              >
                {/* Order Meta Header */}
                <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex gap-8 items-center">
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        Order Identifier
                      </p>
                      <p className="text-sm font-mono font-bold text-gray-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">
                        Date Placed
                      </p>
                      <p className="text-sm font-bold text-gray-700">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black border tracking-wider uppercase ${getStatusStyles(
                      order.orderStatus,
                    )}`}
                  >
                    {order.orderStatus}
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-7 space-y-8">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-6 items-center">
                        <div className="relative h-24 w-20 rounded-2xl overflow-hidden border border-gray-100 bg-gray-50 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 text-base truncate">
                            {item.title}
                          </h4>
                          <div className="mt-1 flex items-center gap-4 text-xs font-medium text-gray-500">
                            <span>Qty: {item.quantity}</span>
                            <span>•</span>
                            <span>Unit: ${item.price.toFixed(2)}</span>
                          </div>
                        </div>
                        <div className="text-sm font-black text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="lg:col-span-5 flex flex-col justify-between lg:border-l lg:border-gray-100 lg:pl-12">
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
                            Shipping To
                          </h5>
                          <p className="text-sm font-bold text-gray-800">
                            {order.address?.firstName} {order.address?.lastName}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                            {order.address?.address}
                          </p>
                        </div>
                        {order.totalPrice > order.finalPrice && (
                          <div className="bg-emerald-50 text-emerald-700 border border-emerald-100 px-3 py-1 rounded-lg">
                            <span className="text-[10px] font-black uppercase tracking-tighter">
                              Save {order.items[0]?.discountPercent}%
                            </span>
                          </div>
                        )}
                      </div>

                      <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-3">
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-gray-400 uppercase">
                            Subtotal
                          </span>
                          <span className="text-gray-700">
                            ${order.totalPrice?.toFixed(2)}
                          </span>
                        </div>

                        {order.totalPrice > order.finalPrice && (
                          <div className="flex justify-between text-xs font-bold text-emerald-600">
                            <span className="uppercase">Discount Amount</span>
                            <span>
                              -$
                              {(order.totalPrice - order.finalPrice).toFixed(2)}
                            </span>
                          </div>
                        )}

                        <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                          <div>
                            <span className="text-[10px] font-black text-gray-400 uppercase block mb-1">
                              Final Total
                            </span>
                            <div className="flex items-center gap-2">
                              <div
                                className={`h-1.5 w-1.5 rounded-full ${
                                  order.isPaid
                                    ? "bg-emerald-500"
                                    : "bg-rose-500"
                                }`}
                              />
                              <span
                                className={`text-[9px] font-black uppercase ${
                                  order.isPaid
                                    ? "text-emerald-600"
                                    : "text-rose-600"
                                }`}
                              >
                                {order.isPaid ? "Paid" : "Pending Payment"}
                              </span>
                            </div>
                          </div>
                          <span className="text-3xl font-black text-gray-900 tracking-tighter">
                            ${order.finalPrice.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 flex gap-3">
                      {order.orderStatus === "Pending" ? (
                        /* Show Track Order only if Pending */
                        <Link
                          href={`/track-order?id=${order._id.slice(-8).toUpperCase()}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-black hover:bg-gray-800 text-white text-[10px] font-black uppercase py-4 rounded-2xl tracking-widest transition-all shadow-lg active:scale-95"
                        >
                          <HiOutlineTruck className="text-base" /> Track Order
                        </Link>
                      ) : (
                        /* Show Buy Again for all other statuses */
                        <button
                          type="button"
                          className="flex-1 flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase py-4 rounded-2xl tracking-widest transition-all shadow-lg active:scale-95"
                          onClick={() => handleBuyAgainClick(order.items[0])}
                        >
                          Buy Again
                        </button>
                      )}

                      {order.orderStatus === "Pending" && (
                        <button
                          onClick={() => cancalOrderHander(order._id)}
                          className="px-6 bg-white border border-gray-200 text-gray-400 hover:text-rose-600 hover:border-rose-100 text-[10px] font-black uppercase rounded-2xl transition-all"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
