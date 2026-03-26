"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  HiOutlineMagnifyingGlass,
  HiOutlineCube,
  HiOutlineTruck,
  HiOutlineMapPin,
  HiOutlineClock,
  HiOutlineClipboardDocumentCheck,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyTrackOrder } from "../../../lib/features/orderSlice/orderSlice";
import Loader from "@/components/loader/Loader";
import toast, { Toaster } from "react-hot-toast";
import CancelOrder from "@/components/cancelOrder/CancelOrder";
import { setParams } from "../../../utils/queryParams/params";
import Link from "next/link";
import { HiOutlineChevronLeft } from "react-icons/hi";

const TrackOrder = () => {
  const dispatch = useDispatch();
  const [IsModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const {
    isLoading: loading,
    order: myOrder,
    error,
  } = useSelector((state) => state.orderSlice);

  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const timelineStatuses = ["Pending", "Confirmed", "Shipped", "Delivered"];

  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId) return;
    // router.push(`?id=${orderId.trim()}`);
    dispatch(fetchMyTrackOrder(orderId.trim()));
  };

  const cancalOrderHander = (id) => {
    setIsModalOpen(true);
    setParams(id);
  };

  const currentStatus = myOrder?.orderStatus || "";
  // Check for "Canceled" (Ensure this matches your backend string exactly)
  const isCanceled = currentStatus === "Cancelled";
  const currentIndex = timelineStatuses.indexOf(currentStatus);
  const canCancel = currentStatus === "Pending";

  // When canceled, 100% width makes the whole line red
  const progressPercentage = isCanceled
    ? 100
    : currentIndex === -1
      ? 0
      : (currentIndex / (timelineStatuses.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-20 px-4 text-slate-900 font-sans">
      
      {loading && <Loader />}

      {IsModalOpen && <CancelOrder setIsModalOpen={setIsModalOpen} />}

      <div className="max-w-2xl mx-auto">
         <Link
          href="/"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tight text-slate-900 mb-2">
            Track Your Order
          </h1>
        </div>

        <form onSubmit={handleSearch} className="mb-12 relative group">
          <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-10 group-focus-within:opacity-20 transition duration-500"></div>
          <div className="relative flex items-center bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <HiOutlineMagnifyingGlass className="ml-6 text-slate-400 w-6 h-6" />
            <input
              type="text"
              placeholder="Enter Order ID..."
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              className="w-full px-4 py-6 outline-none text-lg font-semibold"
            />
            <button
              type="submit"
              className="cursor-pointer mr-3 bg-primary text-white px-8 py-3.5 rounded-xl font-bold hover:bg-black transition-all"
            >
              Track
            </button>
          </div>
        </form>

        <AnimatePresence mode="wait">
          {myOrder?._id && (
            <motion.div
              key={myOrder._id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 sm:p-10">
                <div className="flex justify-between items-start mb-16">
                  <div className="flex flex-col gap-3">
                    {myOrder.items?.map((item, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <img
                          src={item.image}
                          className="w-12 h-12 rounded-lg object-cover"
                          alt=""
                        />
                        <div>
                          <p className="font-bold text-sm leading-tight">
                            {item.title}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">
                            QTY: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <span
                    className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isCanceled ? "bg-red-500 text-white" : "bg-blue-50 text-primary"}`}
                  >
                    {currentStatus}
                  </span>
                </div>

                {/* --- PROGRESS BAR SECTION --- */}
                <div className="relative w-full px-2 mb-4">
                  <div className="absolute top-1/2 left-[5.5%] right-[5.5%] h-[3px] -translate-y-1/2 bg-slate-100 rounded-full" />

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `calc(${progressPercentage}% - ((${progressPercentage}/100) * 11%))`,
                    }}
                    className={`absolute top-1/2 left-[5.5%] h-[3px] -translate-y-1/2 rounded-full z-10 transition-colors duration-500 ${isCanceled ? "bg-red-500" : "bg-primary"}`}
                  />

                  <div className="relative flex justify-between">
                    {timelineStatuses.map((step, index) => {
                      const isPastOrCurrent = index <= currentIndex;
                      // If canceled, every circle is red. Otherwise, only past/current are primary color.
                      const isActive = isCanceled || isPastOrCurrent;

                      return (
                        <div
                          key={step}
                          className="flex flex-col items-center w-11"
                        >
                          <div
                            className={`w-11 h-11 rounded-full flex items-center justify-center border-4 z-20 transition-all duration-500 ${
                              isCanceled
                                ? "bg-red-500 border-white text-white shadow-lg shadow-red-100"
                                : isPastOrCurrent
                                  ? "bg-primary border-white text-white shadow-lg shadow-blue-100"
                                  : "bg-white border-slate-50 text-slate-300"
                            }`}
                          >
                            {/* Logic: If canceled, show X on ALL steps. If active, show step icon. */}
                            {isCanceled ? (
                              <HiOutlineXCircle className="w-6 h-6" />
                            ) : (
                              <>
                                {index === 0 && (
                                  <HiOutlineClock className="w-5 h-5" />
                                )}
                                {index === 1 && (
                                  <HiOutlineClipboardDocumentCheck className="w-5 h-5" />
                                )}
                                {index === 2 && (
                                  <HiOutlineTruck className="w-5 h-5" />
                                )}
                                {index === 3 && (
                                  <HiOutlineCube className="w-5 h-5" />
                                )}
                              </>
                            )}
                          </div>
                          <span
                            className={`absolute -bottom-10 text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-colors duration-500 ${
                              isCanceled
                                ? "text-red-500"
                                : isPastOrCurrent
                                  ? "text-slate-900"
                                  : "text-slate-300"
                            }`}
                          >
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* --- END PROGRESS BAR --- */}

                {canCancel && (
                  <div className="mt-20 pt-8 border-t border-slate-50 flex flex-col items-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight mb-4">
                      Need to make changes?
                    </p>
                    <button
                      onClick={() => cancalOrderHander(myOrder._id)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-red-50 text-red-500 font-bold text-xs hover:bg-red-500 hover:text-white transition-all duration-300"
                    >
                      <HiOutlineXCircle className="w-4 h-4" />
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 flex gap-4">
                  <HiOutlineMapPin
                    className={`${isCanceled ? "text-red-500" : "text-primary"} w-6 h-6`}
                  />
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase mb-1">
                      Deliver To
                    </p>
                    <p className="font-bold text-sm">
                      {myOrder.address?.firstName} {myOrder.address?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">
                      {myOrder.address?.address}, {myOrder.address?.city}
                    </p>
                  </div>
                </div>
                <div
                  className={`p-8 rounded-[2.5rem] text-white flex flex-col items-center justify-center transition-colors duration-500 ${isCanceled ? "bg-red-600" : "bg-slate-900"}`}
                >
                  <p className="text-[10px] font-black text-slate-100/60 uppercase mb-1">
                    Total Paid
                  </p>
                  <p className="text-3xl font-black">
                    ${myOrder.finalPrice?.toFixed(2)}
                  </p>
                  <div className="mt-4 px-3 py-1 bg-white/10 rounded-lg flex items-center gap-1">
                    <span className="text-[9px] uppercase font-bold text-slate-300">
                      Method:
                    </span>
                    <span className="text-[9px] uppercase font-bold text-white">
                      {myOrder.paymentMethod}
                    </span>
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
