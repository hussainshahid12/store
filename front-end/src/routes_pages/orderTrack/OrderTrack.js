"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineClipboardDocumentCheck,
  HiOutlineXCircle,
  HiOutlineTag,
  HiOutlineShoppingBag,
  HiOutlineChevronLeft,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTrackOrder } from "../../../lib/features/orderSlice/orderSlice";
import Loader from "@/components/loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import CancelOrder from "@/components/cancelOrder/CancelOrder";
import { setParams } from "../../../utils/queryParams/params"; // Added for cancel logic

const TrackOrder = () => {
  const dispatch = useDispatch();
  const router = useRouter();
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("tracking");
  const [orderId, setOrderId] = useState("");

  const { isLoading: loading, order: myOrder, error } = useSelector((state) => state.orderSlice);

  const statusConfig = {
    Pending: { color: "#F59E0B", text: "text-amber-600", light: "bg-amber-50", border: "border-amber-100" },
    Confirmed: { color: "#3B82F6", text: "text-blue-600", light: "bg-blue-50", border: "border-blue-100" },
    Shipped: { color: "#8B5CF6", text: "text-purple-600", light: "bg-purple-50", border: "border-purple-100" },
    Delivered: { color: "#10B981", text: "text-emerald-600", light: "bg-emerald-50", border: "border-emerald-100" },
    Cancelled: { color: "#EF4444", text: "text-red-600", light: "bg-red-50", border: "border-red-100" },
  };

  const timelineStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];
  const currentStatus = myOrder?.orderStatus || "Pending";
  const isCanceled = currentStatus === "Cancelled";
  const canCancel = currentStatus === "Pending"; // Condition for cancel button
  const currentIndex = timelineStatuses.indexOf(currentStatus);
  const activeColor = statusConfig[currentStatus]?.color || "#F44B61";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (id) setOrderId(id);
  }, []);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return toast.error("Please enter an ID");
    dispatch(fetchMyTrackOrder(orderId.trim()));
  };

  // FEATURE: Cancel Order Handler
  const cancelOrderHandler = (id) => {
    setIsModalOpen(true);
    setParams(id);
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB] font-sans pb-20 overflow-x-hidden">
      {loading && <Loader />}
      {IsModalOpen && <CancelOrder setIsModalOpen={setIsModalOpen} />}

      {/* --- HEADER --- */}
      <div className="relative bg-[#0F1117] pt-12 pb-44 px-4 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{ backgroundImage: `radial-gradient(circle, #555 1px, transparent 1px)`, backgroundSize: '24px 24px' }}
        ></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <button 
            onClick={() => router.back()}
            className="mb-8 flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-400 hover:text-white transition-all bg-white/5 py-2 px-4 rounded-xl border border-white/10"
          >
            <HiOutlineChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/10 text-white text-[10px] font-bold uppercase tracking-[0.2em] mb-6">
              <HiOutlineCube className="w-4 h-4 text-orange-400" /> Shipment Tracking
            </div>
            <h1 className="text-[clamp(2.5rem,8vw,4.5rem)] font-[950] text-white mb-4 leading-[1.1] tracking-tighter">
              Track Your Order
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 -mt-32 relative z-20">
        {/* --- SEARCH CARD --- */}
        <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl shadow-black/5 p-6 sm:p-10 border border-white">
          <div className="flex bg-gray-100/80 p-1.5 rounded-2xl mb-8">
            {["tracking", "order"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 sm:py-4 rounded-xl text-[10px] sm:text-[11px] font-bold uppercase tracking-widest transition-all ${
                  activeTab === tab ? "bg-white text-[#F44B61] shadow-md" : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {tab === "tracking" ? <HiOutlineTag className="w-4 h-4" /> : <HiOutlineShoppingBag className="w-4 h-4" />}
                <span className="hidden sm:inline">{tab === "tracking" ? "Tracking Number" : "Order Number"}</span>
              </button>
            ))}
          </div>

          <form onSubmit={handleSearch}>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder={activeTab === "tracking" ? "e.g. LE123456789" : "e.g. #ORD-9921"}
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
                className="flex-1 bg-gray-50 border-2 border-transparent rounded-2xl px-6 py-4 outline-none focus:border-[#F44B61]/20 focus:bg-white transition-all font-bold text-base sm:text-lg"
              />
              <button
                type="submit"
                className="bg-[#F44B61] text-white px-10 py-4 rounded-2xl font-bold uppercase tracking-widest hover:bg-black transition-all"
              >
                Track
              </button>
            </div>
          </form>
        </div>

        {/* --- RESULTS SECTION --- */}
        <AnimatePresence mode="wait">
          {myOrder?._id && (
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
              <div className="bg-white rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-12 border border-gray-100 shadow-sm overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start gap-6 mb-16">
                  
                  {/* FEATURE 1: PRODUCT IMAGE DISPLAY */}
                  <div className="flex flex-wrap gap-3">
                    {myOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-3 bg-gray-50 p-2 pr-4 rounded-2xl border border-gray-100">
                        <img src={item.image} className="w-12 h-12 rounded-xl object-cover shadow-sm" alt="" />
                        <div className="hidden sm:block">
                          <p className="font-black text-[10px] text-gray-900 leading-tight w-24 truncate">{item.title}</p>
                          <p className="text-[9px] text-gray-400 font-bold uppercase">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <span className={`px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusConfig[currentStatus]?.light} ${statusConfig[currentStatus]?.text} border ${statusConfig[currentStatus]?.border}`}>
                    {currentStatus}
                  </span>
                </div>
                
                {/* Responsive Timeline */}
                <div className="relative px-2 mb-20">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
                  {!isCanceled && (
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(currentIndex / (timelineStatuses.length - 1)) * 100}%` }}
                      style={{ backgroundColor: activeColor }}
                      className="absolute top-1/2 left-0 h-1 -translate-y-1/2 rounded-full transition-all duration-1000"
                    />
                  )}

                  <div className="relative flex justify-between">
                    {timelineStatuses.map((status, idx) => {
                      const isPastOrCurrent = idx <= currentIndex && !isCanceled;
                      return (
                        <div key={status} className="flex flex-col items-center">
                          <div 
                            style={{ backgroundColor: isPastOrCurrent ? statusConfig[status]?.color : "#fff" }}
                            className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center border-4 z-10 transition-all duration-500 ${isPastOrCurrent ? "border-white shadow-xl scale-110 text-white" : "border-gray-50 text-gray-300"}`}
                          >
                            {idx === 0 && <HiOutlineClock className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {idx === 1 && <HiOutlineClipboardDocumentCheck className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {idx === 2 && <HiOutlineTruck className="w-5 h-5 sm:w-6 sm:h-6" />}
                            {idx === 3 && <HiOutlineCube className="w-5 h-5 sm:w-6 sm:h-6" />}
                          </div>
                          <p className={`absolute -bottom-10 text-[9px] sm:text-[10px] font-bold uppercase tracking-tight whitespace-nowrap ${isPastOrCurrent ? "text-gray-900" : "text-gray-300"}`}>
                            {status}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* FEATURE 2: CANCEL BUTTON */}
                {canCancel && (
                  <div className="mt-12 pt-8 border-t border-dashed border-gray-100 flex flex-col items-center">
                    <button
                      onClick={() => cancelOrderHandler(myOrder._id)}
                      className="group flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-red-50 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white transition-all duration-300 border border-red-100 shadow-sm"
                    >
                      <HiOutlineXCircle className="w-5 h-5 transition-transform group-hover:rotate-90" />
                      Cancel Order
                    </button>
                  </div>
                )}

                {/* Info Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-20">
                  <div className="p-8 bg-gray-50 rounded-[2.5rem] border border-gray-100 flex items-start gap-5">
                    <div className="p-3.5 bg-white rounded-2xl shadow-sm"><HiOutlineMapPin style={{ color: activeColor }} className="w-6 h-6" /></div>
                    <div className="flex-1 overflow-hidden">
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Shipping Details</p>
                      <p className="font-bold text-gray-900 text-base mb-1 truncate">{myOrder.address?.firstName} {myOrder.address?.lastName}</p>
                      <p className="text-gray-500 text-xs truncate">{myOrder.address?.address}</p>
                    </div>
                  </div>

                  <div style={{ backgroundColor: activeColor }} className="p-8 rounded-[2.5rem] text-white flex flex-col justify-between transition-all duration-700">
                    <div className="flex justify-between items-start mb-8">
                      <div className="p-3 bg-white/20 rounded-2xl"><HiOutlineShoppingBag className="w-7 h-7" /></div>
                      <p className="text-xs font-bold uppercase tracking-widest">{myOrder.paymentMethod}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">Total Amount</p>
                      <p className="text-3xl font-[900] tracking-tighter leading-none">${myOrder.finalPrice?.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <Toaster position="top-center" />
    </div>
  );
};

export default TrackOrder;