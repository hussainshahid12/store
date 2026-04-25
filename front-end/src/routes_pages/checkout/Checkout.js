"use client";

import Link from "next/link";
import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineChevronLeft,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiExclamationCircle,
  HiOutlineTruck,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchBuyNowItem,
  fetchCreateOrder,
  fetchMyOrderAddress,
} from "../../../lib/features/orderSlice/orderSlice";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";
import Loader from "@/components/loader/Loader";
import Footer from "@/components/footer/Footer";
import CheckoutSkeleton from "@/components/skeletonLoader/CheckoutSkeleton";
import { resetOrder } from "../../../lib/features/orderSlice/orderSlice";

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();

  // Redux State
  const orderData = useSelector((state) => state?.orderSlice.order);
  const cartData = useSelector((state) => state?.cartSlice?.items?.cart || {});
  const cartItems = cartData?.items || [];
  const isOrderLoading = useSelector((state) => state?.orderSlice.isLoading);
  const isCartLoading = useSelector((state) => state?.cartSlice?.isLoading);
  const savedAddresses = useSelector(
    (state) => state?.orderSlice.address || [],
  );

  const displayItems =
    orderData?.items?.length > 0 ? orderData.items : cartItems;
  const displayTotals = orderData?.items?.length > 0 ? orderData : cartData;

  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(resetOrder());
  }, []);

  // Memoize unique addresses
  const uniqueAddresses = useMemo(() => {
    return savedAddresses.filter(
      (item, index, self) =>
        index ===
        self.findIndex(
          (t) =>
            (t.address?.address || t.address) ===
              (item.address?.address || item.address) &&
            t.address?.city === item.address?.city,
        ),
    );
  }, [savedAddresses]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      address: {
        firstName: "",
        lastName: "",
        phone: "",
        address: "",
        city: "",
        email: "",
      },
      paymentMethod: "",
    },
  });

  const selectedPayment = watch("paymentMethod");

  useEffect(() => {
    if (savedAddresses.length === 0) dispatch(fetchMyOrderAddress());
  }, [dispatch, savedAddresses.length]);

  useEffect(() => {
    const initializeCheckout = async () => {
      const params = new URLSearchParams(window.location.search);
      const mode = params.get("mode");
      const productId = params.get("productId");
      const quantity = params.get("quantity");

      if (mode === "buy-now") {
        console.log("doen..");
        if (!productId) return router.replace("/");
        dispatch(fetchBuyNowItem({ id: productId, qty: quantity }));
      } else {
        if (cartItems.length === 0) {
          console.log("doen");
          const result = await dispatch(fetchCartItems());
          const items = result.payload?.cart?.items || [];
          if (items.length === 0) router.replace("/");
        }
      }
    };
    initializeCheckout();
  }, [dispatch, router]);

  const handleSelectAddress = (item) => {
    const originalIndex = savedAddresses.indexOf(item);
    setSelectedAddressIndex(originalIndex);

    const data = item.address || item;
    setValue("address.firstName", data.firstName || data.first);
    setValue("address.lastName", data.lastName || data.last);
    setValue("address.address", data.address || data.full);
    setValue("address.city", data.city);
    setValue("address.phone", data.phone);
    setValue("address.email", data.email);
    trigger("address");
  };

  const onPlaceOrder = async (data) => {
    const params = new URLSearchParams(window.location.search);
    const mode = params.get("mode") || "cart";
    const productId = params.get("productId");
    const quantity = params.get("quantity");

    setIsSubmitting(true);

    const orderPayload = {
      address: data.address,
      paymentMethod: data.paymentMethod,
      productId: mode === "buy-now" ? productId : undefined,
      quantity: mode === "buy-now" ? quantity : undefined,
      mode,
    };

    let res = await dispatch(fetchCreateOrder(orderPayload));

    if (res.meta.requestStatus === "fulfilled") {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
      );
      try {
        await audio.play();
      } catch (err) {}

      setTimeout(() => {
        setIsSubmitting(false);
        router.push(`/success?order_id=${res.payload.order._id}`);
      }, 2000);
    } else {
      setIsSubmitting(false);
      console.error("Order Failed:", res.payload);
    }
  };

  // if (isOrderLoading || isCartLoading) return <Loader />;
  if (isOrderLoading || isCartLoading) return <CheckoutSkeleton />;

  if (displayItems.length === 0) return null;

  const inputStyles = (error) => `
    w-full px-4 py-3 rounded-xl border transition-all duration-200 outline-none text-sm
    ${error ? "border-red-500 bg-red-50/30" : "border-gray-200 focus:border-black focus:ring-4 focus:ring-gray-100"}
  `;

  const backHandler = () => {
    router.back();
  };
  return (
    <>
      <div className="min-h-screen bg-white text-slate-900 px-2 lg:px-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
          <div className="flex justify-between items-center mb-12">
            <div>
              <div
                className="cursor-pointer group  inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-black transition-colors"
                onClick={backHandler}
              >
                <HiOutlineChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
                Back
              </div>
              <h1 className="text-4xl font-bold mt-4 tracking-tight">
                Checkout.
              </h1>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onPlaceOrder)}
            className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start"
          >
            <div className="lg:col-span-7 space-y-12">
              <section>
                <div className="flex items-center gap-3 mb-8">
                  <HiOutlineTruck className="w-6 h-6 text-black" />
                  <h2 className="text-xl font-bold">Shipping Information</h2>
                </div>

                <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                  <div className="col-span-1">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      First Name
                    </label>
                    <input
                      {...register("address.firstName", {
                        required: "first name is required",
                      })}
                      placeholder="John"
                      className={inputStyles(errors.address?.firstName)}
                    />

                    {errors.address?.firstName && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.firstName.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-1">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      Last Name
                    </label>
                    <input
                      {...register("address.lastName", {
                        required: "last name is required",
                      })}
                      placeholder="Doe"
                      className={inputStyles(errors.address?.lastName)}
                    />
                    {errors.address?.lastName && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.lastName.message}
                      </p>
                    )}
                  </div>

                  {/* Phone Number Field with Pakistani Validation */}
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      Phone Number
                    </label>
                    <input
                      {...register("address.phone", {
                        required: "Phone number is required",
                        pattern: {
                          value: /^((\+92)|(0092))?3\d{9}$|^03\d{9}$/,
                          message: "Use format: 03xxxxxxxxx or +923xxxxxxxxx",
                        },
                      })}
                      placeholder="03001234567"
                      className={inputStyles(errors.address?.phone)}
                    />
                    {errors.address?.phone && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.phone.message}
                      </p>
                    )}
                  </div>

                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      Email Address
                    </label>
                    <input
                      {...register("address.email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Invalid email address",
                        },
                      })}
                      placeholder="john@example.com"
                      className={inputStyles(errors.address?.email)}
                    />
                    {errors.address?.email && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.email.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      Street Address
                    </label>
                    <input
                      {...register("address.address", {
                        required: "street address is required",
                      })}
                      placeholder="123 Modern Street"
                      className={inputStyles(errors.address?.address)}
                    />
                    {errors.address?.address && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.address.message}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label className="text-[11px] font-bold uppercase text-slate-400 mb-2 block tracking-tight">
                      City
                    </label>
                    <input
                      {...register("address.city", {
                        required: "city is required",
                      })}
                      placeholder="New York"
                      className={inputStyles(errors.address?.city)}
                    />
                    {errors.address?.city && (
                      <p className="text-[10px] text-red-500 font-bold mt-1 uppercase">
                        {errors.address.city.message}
                      </p>
                    )}
                  </div>
                </div>

                {uniqueAddresses.length > 0 && (
                  <div className="mt-10">
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[11px] font-bold uppercase text-slate-400 tracking-wider">
                        Deliver to a saved address
                      </span>
                      <span className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-md font-bold">
                        {uniqueAddresses.length} Found
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {uniqueAddresses.map((item, i) => {
                        const isSelected =
                          selectedAddressIndex === savedAddresses.indexOf(item);
                        const data = item.address || item;

                        return (
                          <button
                            key={i}
                            type="button"
                            onClick={() => handleSelectAddress(item)}
                            className={`relative flex flex-col items-start p-5 rounded-2xl border-2 text-left transition-all duration-300 ${
                              isSelected
                                ? "border-emerald-500 bg-emerald-50/30 shadow-md ring-4 ring-emerald-500/10 scale-[1.01]"
                                : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                            }`}
                          >
                            <div
                              className={`absolute top-4 right-4 w-6 h-6 rounded-full flex items-center justify-center transition-all duration-500 ${
                                isSelected
                                  ? "bg-emerald-500 scale-110 rotate-0 opacity-100"
                                  : "bg-slate-200 scale-75 rotate-45 opacity-0"
                              }`}
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={3}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </div>

                            <p
                              className={`text-[10px] font-black uppercase mb-1 tracking-widest ${
                                isSelected
                                  ? "text-emerald-600"
                                  : "text-slate-400"
                              }`}
                            >
                              {data.city}
                            </p>

                            <p
                              className={`text-sm font-bold line-clamp-1 pr-8 transition-colors ${
                                isSelected
                                  ? "text-emerald-900"
                                  : "text-slate-800"
                              }`}
                            >
                              {data.address || data.full}
                            </p>

                            <p
                              className={`text-xs mt-1 transition-colors ${
                                isSelected
                                  ? "text-emerald-700/70"
                                  : "text-slate-500"
                              }`}
                            >
                              {data.firstName} {data.lastName}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </section>

              <section className="pt-12 border-t border-slate-100">
                <div className="flex items-center gap-3 mb-8">
                  <HiOutlineCreditCard className="w-6 h-6 text-black" />
                  <h2 className="text-xl font-bold">Payment Method</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    {
                      id: "pay-cash",
                      value: "Cash",
                      icon: HiOutlineCash,
                      label: "Cash on Delivery",
                    },
                    {
                      id: "pay-card",
                      value: "Card",
                      icon: HiOutlineCreditCard,
                      label: "Credit Card",
                    },
                  ].map((method) => (
                    <label
                      key={method.id}
                      htmlFor={method.id}
                      className={`
                    relative flex items-center justify-between p-6 rounded-2xl border-2 cursor-pointer transition-all
                    ${selectedPayment === method.value ? "border-black bg-slate-50 ring-4 ring-slate-100" : "border-slate-100 hover:border-slate-200"}
                    ${errors.paymentMethod ? "border-red-200" : ""}
                  `}
                    >
                      <div className="flex items-center gap-4">
                        <method.icon className="w-6 h-6" />
                        <span className="font-bold text-sm tracking-tight">
                          {method.label}
                        </span>
                      </div>
                      <input
                        type="radio"
                        value={method.value}
                        {...register("paymentMethod", {
                          required: "Please select a payment method",
                        })}
                        id={method.id}
                        className="w-4 h-4 accent-black"
                      />
                    </label>
                  ))}
                </div>

                {errors.paymentMethod && (
                  <div className="mt-4 flex items-center gap-2 text-red-500 bg-red-50 p-3 rounded-xl border border-red-100">
                    <HiExclamationCircle className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-wide">
                      {errors.paymentMethod.message}
                    </span>
                  </div>
                )}
              </section>
            </div>

            <aside className="lg:col-span-5 lg:sticky lg:top-12">
              <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100">
                <h3 className="text-xl font-bold mb-8">Order Summary</h3>

                <div className="space-y-6 max-h-[300px] overflow-y-auto custom-scrollbar mb-8 pr-2">
                  {displayItems.map((item, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-2xl border border-slate-200 overflow-hidden flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-grow flex flex-col justify-center">
                        <h4 className="font-bold text-sm line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs font-medium text-slate-400 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-bold mt-1">
                          ${item.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 border-t border-slate-200 pt-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Subtotal</span>
                    <span className="font-bold">
                      ${displayTotals?.totalPrice?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Shipping</span>
                    <span className="font-bold text-green-600 tracking-wide uppercase text-[10px]">
                      Free
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500 font-medium">Discount</span>
                    <span className="font-bold text-red-500">
                      -${displayTotals?.discountAmount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-end pt-4">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <p className="text-3xl font-black tracking-tighter">
                        ${displayTotals?.finalPrice?.toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">
                        Including VAT
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full mt-10 py-5 rounded-2xl font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-xl
                  ${isSubmitting ? "bg-slate-300 cursor-not-allowed" : "bg-black text-white hover:bg-slate-800 hover:scale-[1.02] active:scale-[0.98] shadow-black/20"}
                `}
                >
                  {isSubmitting ? "processing..." : "Place Order"}
                </button>

                <div className="mt-6 flex items-center justify-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  <HiOutlineShieldCheck className="w-4 h-4 text-emerald-500" />
                  Guaranteed Safe Checkout
                </div>
              </div>
            </aside>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}
