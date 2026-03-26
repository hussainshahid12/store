"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../../lib/features/orderSlice/orderSlice";
import Loader from "@/components/loader/Loader";
import CancelOrder from "@/components/cancelOrder/CancelOrder";
import { setParams } from "../../../utils/queryParams/params";
import { HiOutlineChevronLeft } from "react-icons/hi";
import Link from "next/link";
const OrderHistory = () => {
  const dispatch = useDispatch();

  // 1. Pull data from Redux
  const { myOrders, isLoading: loading } = useSelector(
    (state) => state.orderSlice,
  );
  const [IsModalOpen, setIsModalOpen] = useState(false);

  const [activeTab, setActiveTab] = useState("All");
  // 2. Track if the first fetch has been attempted to prevent initial "Not ordered yet" flash
  const [hasFetched, setHasFetched] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (myOrders.length == 0) await dispatch(fetchMyOrders());
      setHasFetched(true);
    };
    loadData();
  }, []);

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

  const getStatusColor = (status) => {
    const colors = {
      Pending: "text-amber-600 bg-amber-50 border-amber-100",
      Confirmed: "text-indigo-600 bg-indigo-50 border-indigo-100",
      Shipped: "text-blue-600 bg-blue-50 border-blue-100",
      Delivered: "text-emerald-600 bg-emerald-50 border-emerald-100",
      Cancelled: "text-rose-600 bg-rose-50 border-rose-100",
    };
    return colors[status] || "text-slate-600 bg-slate-50 border-slate-100";
  };

  // 3. PRIORITY LOADING LOGIC
  // We show the loader if Redux says it's loading OR if we haven't finished our first fetch.
  if (loading || !hasFetched) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Loader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      {IsModalOpen && <CancelOrder setIsModalOpen={setIsModalOpen} />}
      <div className="max-w-5xl mx-auto">
        <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 tracking-tight">
              Order History
            </h1>
            <p className="text-slate-500 mt-2">
              Manage your purchases and track status
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {["All", "Active", "Completed", "Cancelled"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                  activeTab === tab
                    ? "bg-slate-900 text-white shadow-lg"
                    : "bg-white text-slate-500 border border-slate-200"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </header>

        {/* --- Empty State Logic --- */}
        {myOrders && myOrders.length === 0 ? (
          <div className="bg-white rounded-[2rem] p-20 text-center border border-dashed border-slate-300 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-slate-300"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 4.512 7.5h14.978a1.125 1.125 0 0 1 1.118 1.007ZM9.75 10.5h4.5"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">
              Not ordered yet
            </h2>
            <p className="text-slate-500 mt-2">
              Your purchase history will appear here once you place an order.
            </p>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-8 px-8 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-all"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid gap-8">
            {filteredOrders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden"
              >
                {/* Header: Order Meta */}
                <div className="px-8 py-5 border-b border-slate-50 flex flex-wrap justify-between items-center bg-slate-50/30">
                  <div className="flex gap-6 items-center">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Order Number
                      </p>
                      <p className="text-sm font-mono font-bold text-slate-700">
                        #{order._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <div className="h-8 w-[1px] bg-slate-200 hidden sm:block" />
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Date Placed
                      </p>
                      <p className="text-sm font-bold text-slate-700">
                        {new Date(order.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`mt-2 sm:mt-0 px-4 py-1 rounded-full text-[10px] font-black border tracking-tighter ${getStatusColor(order.orderStatus)}`}
                  >
                    {order.orderStatus.toUpperCase()}
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Products List */}
                  <div className="lg:col-span-6 space-y-6">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-5">
                        <div className="relative h-24 w-24 rounded-2xl overflow-hidden border border-slate-100 bg-slate-50 shrink-0">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 flex flex-col justify-center">
                          <h4 className="font-bold text-slate-900 text-base leading-tight">
                            {item.title}
                          </h4>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
                            <div className="text-xs text-slate-500 font-medium">
                              Unit Price:{" "}
                              <span className="text-slate-900">
                                ${item.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="text-xs text-slate-500 font-medium">
                              Qty:{" "}
                              <span className="text-slate-900">
                                {item.quantity}
                              </span>
                            </div>
                            <div className="text-sm font-black text-slate-900 ml-auto">
                              ${(item.price * item.quantity).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Logistics */}
                  <div className="lg:col-span-3 space-y-6 lg:border-l lg:border-slate-100 lg:pl-10">
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Shipping Details
                      </h5>
                      <p className="text-sm font-bold text-slate-800">
                        {order.address?.firstName} {order.address?.lastName}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-1">
                        {order.address?.address}
                      </p>
                    </div>
                    <div>
                      <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">
                        Payment & Status
                      </h5>
                      <p className="text-sm font-bold text-slate-700">
                        {order.paymentMethod}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${order.isPaid ? "bg-emerald-500" : "bg-rose-500"}`}
                        />
                        <span
                          className={`text-[10px] font-black uppercase ${order.isPaid ? "text-emerald-600" : "text-rose-600"}`}
                        >
                          {order.isPaid
                            ? "Payment Confirmed"
                            : "Payment Pending"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Discount */}
                  <div className="lg:col-span-3 bg-slate-50/50 rounded-3xl p-6 flex flex-col justify-between border border-slate-100">
                    <div className="space-y-3">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400 uppercase">
                          Subtotal
                        </span>
                        <span className="text-slate-700">
                          ${order.totalPrice?.toFixed(2)}
                        </span>
                      </div>

                      {order.totalPrice > order.finalPrice && (
                        <div className="flex justify-between text-xs font-bold">
                          <span className="text-rose-500 uppercase tracking-tighter">
                            Discount
                          </span>
                          <span className="text-rose-600">
                            -${(order.totalPrice - order.finalPrice).toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                        <span className="text-[10px] font-black text-slate-400 uppercase">
                          Final Total
                        </span>
                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                          ${order.finalPrice.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-6 space-y-2">
                      {order.orderStatus === "Pending" && (
                        <button
                          onClick={() => cancalOrderHander(order._id)}
                          className="w-full bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-[10px] font-black uppercase py-3 rounded-xl tracking-widest transition-all"
                        >
                          Cancel Order
                        </button>
                      )}
                      <button className="w-full bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase py-4 rounded-2xl tracking-widest transition-all shadow-lg active:scale-95">
                        Order Details
                      </button>
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
