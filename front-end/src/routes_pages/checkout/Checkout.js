"use client";

import Link from "next/link";
import { useState, useEffect, use } from "react";
import { useForm } from "react-hook-form";
import {
  HiOutlineChevronLeft,
  HiOutlineShieldCheck,
  HiOutlineCreditCard,
  HiOutlineCash,
  HiLockClosed,
  HiExclamationCircle,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCreateOrder,
  fetchMyOrderAddress,
} from "../../../lib/features/orderSlice/orderSlice";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";
import Loader from "@/components/loader/Loader";

export default function Checkout() {
  const router = useRouter();
  const dispatch = useDispatch();

  // 1. Redux State
  const cartItems = useSelector(
    (state) => state?.cartSlice?.items?.cart?.items || [],
  );
  const cartData = useSelector((state) => state?.cartSlice?.items?.cart || {});
  const loading = useSelector((state) => state?.cartSlice?.isLoading);
  const savedAddresses = useSelector((state) => state?.orderSlice.address);

  const [paymentMethod, setPaymentMethod] = useState(null);
  const [selectedAddressIndex, setSelectedAddressIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (savedAddresses.length === 0) dispatch(fetchMyOrderAddress());
  }, []);

  // Replace your existing useEffects with this one:
  useEffect(() => {
    const initializeCheckout = async () => {
      if (cartItems.length === 0) {
        const result = await dispatch(fetchCartItems());
        const items = result.payload?.cart?.items || [];
        if (items.length === 0) {
          router.replace("/");
        }
      }
    };

    initializeCheckout();
  }, [dispatch, router]);

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
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

  const handleSelectAddress = (index) => {
    setSelectedAddressIndex(index);
    const selected = savedAddresses[index];

    // Check if 'selected.address' exists or if the keys are directly on 'selected'
    // Based on your JSX: item.address.firstName, the structure is selected.address
    const data = selected.address || selected;

    // Update form values with the correct keys from your saved profile
    setValue("address.firstName", data.firstName || data.first);
    setValue("address.lastName", data.lastName || data.last);
    setValue("address.address", data.address || data.full);
    setValue("address.city", data.city);
    setValue("address.phone", data.phone);
    setValue("address.email", data.email);

    // This tells react-hook-form to clear the "Required" errors
    // now that the fields have values
    trigger("address");
  };

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    setValue("paymentMethod", method, { shouldValidate: true });
  };

  const onPlaceOrder = async (data) => {
    setIsSubmitting(true);
    // Include cart items and total in order data
    const orderData = {
      ...data,
      items: cartItems,
      total: cartData?.finalPrice,
    };

    let res = await dispatch(fetchCreateOrder(orderData));
   
    if (res.meta.requestStatus === "fulfilled") {
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3",
      );
      try {
        await audio.play();
      } catch (err) {
        console.error("Audio play blocked");
      }

      setTimeout(() => {
        setIsSubmitting(false);
        router.push(`/success?order_id=${res.payload.order._id}`);
      }, 2000);
    } else {
      setIsSubmitting(false);
    }
  };

  const ErrorMsg = ({ message }) =>
    message ? (
      <p className="flex items-center gap-1 mt-1.5 text-[11px] font-bold text-red-600">
        <HiExclamationCircle className="w-3.5 h-3.5" /> {message}
      </p>
    ) : null;

  // PRIORITY 1: Show loader while fetching
  if (loading) {
    return <Loader />;
  }

  // PRIORITY 2: Prevent UI flash if cart is empty (useEffect handles the redirect)
  if (cartItems.length === 0) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#1a1a1a] antialiased font-sans">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/cart"
          className="group mb-8 inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
        >
          <HiOutlineChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to bag
        </Link>

        <form
          onSubmit={handleSubmit(onPlaceOrder)}
          className="grid grid-cols-1 gap-12 lg:grid-cols-12"
        >
          <div className="lg:col-span-8 space-y-8">
            <header>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Checkout
              </h1>
              <p className="text-gray-500 mt-1 text-sm font-medium">
                Complete your purchase by providing your payment and shipping
                details.
              </p>
            </header>

            {/* SECTION 1: SHIPPING ADDRESS */}
            <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-black text-white w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold">
                  01
                </span>
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                  Shipping Details
                </h2>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    First Name
                  </label>
                  <input
                    {...register("address.firstName", { required: "Required" })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.firstName ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="Hussain"
                  />
                  <ErrorMsg message={errors.address?.firstName?.message} />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    Last Name
                  </label>
                  <input
                    {...register("address.lastName", { required: "Required" })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.lastName ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="Shahid"
                  />
                  <ErrorMsg message={errors.address?.lastName?.message} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    Email Address
                  </label>
                  <input
                    {...register("address.email", {
                      required: "Required",
                      pattern: {
                        value: /^\S+@\S+$/i,
                        message: "Invalid email",
                      },
                    })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.email ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="hussain@example.com"
                  />
                  <ErrorMsg message={errors.address?.email?.message} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    Phone Number
                  </label>
                  <input
                    {...register("address.phone", {
                      required: "Required",
                      pattern: {
                        value: /^[0-9]{10,14}$/,
                        message: "10-14 digits",
                      },
                    })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.phone ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="03001234567"
                  />
                  <ErrorMsg message={errors.address?.phone?.message} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    Street Address
                  </label>
                  <input
                    {...register("address.address", { required: "Required" })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.address ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="Office 402, Business Square"
                  />
                  <ErrorMsg message={errors.address?.address?.message} />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-2 tracking-wide">
                    City
                  </label>
                  <input
                    {...register("address.city", { required: "Required" })}
                    className={`w-full p-3.5 rounded-lg border outline-none transition-all font-medium text-sm ${errors.address?.city ? "border-red-500 bg-red-50/20" : "border-gray-200 focus:border-black"}`}
                    placeholder="Lahore"
                  />
                  <ErrorMsg message={errors.address?.city?.message} />
                </div>
              </div>
              {/* SECTION 1: SHIPPING ADDRESS */}
              {/* ... inside your component ... */}

              {savedAddresses.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.15em] mb-4">
                    Saved Profiles
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {/* 1. Filter for unique addresses based on Street and City */}
                    {savedAddresses
                      .filter(
                        (item, index, self) =>
                          index ===
                          self.findIndex(
                            (t) =>
                              t.address.address === item.address.address &&
                              t.address.city === item.address.city,
                          ),
                      )
                      // 2. Map the unique list
                      .map((item, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSelectAddress(i)}
                          className={`text-[10px] px-4 py-2 rounded border-2 font-bold uppercase tracking-wide transition-all ${
                            selectedAddressIndex === i
                              ? "border-black bg-black text-white"
                              : "border-gray-100 bg-gray-50 text-gray-400 hover:border-gray-300"
                          }`}
                        >
                          {item.address.firstName} — {item.address.city}
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </section>

            {/* SECTION 2: PAYMENT METHOD */}
            <section className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <span className="bg-black text-white w-6 h-6 rounded flex items-center justify-center text-[11px] font-bold">
                  02
                </span>
                <h2 className="text-lg font-bold uppercase tracking-wider text-gray-800">
                  Payment Method
                </h2>
              </div>

              <input
                type="hidden"
                {...register("paymentMethod", {
                  required: "Select a payment option",
                })}
              />

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => handlePaymentSelect("Cash")}
                  className={`flex items-center gap-4 rounded-xl border-2 p-5 transition-all ${paymentMethod === "Cash" ? "border-black bg-gray-50 text-black shadow-sm" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}
                >
                  <HiOutlineCash className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-tight">
                      Cash on Delivery
                    </p>
                    <p className="text-[10px] font-semibold opacity-60">
                      Payment at your doorstep
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handlePaymentSelect("Card")}
                  className={`flex items-center gap-4 rounded-xl border-2 p-5 transition-all ${paymentMethod === "Card" ? "border-black bg-gray-50 text-black shadow-sm" : "border-gray-100 hover:border-gray-200 text-gray-500"}`}
                >
                  <HiOutlineCreditCard className="h-6 w-6" />
                  <div className="text-left">
                    <p className="font-bold text-sm uppercase tracking-tight">
                      Credit / Debit Card
                    </p>
                    <p className="text-[10px] font-semibold opacity-60">
                      Secure online transaction
                    </p>
                  </div>
                </button>
              </div>
              <ErrorMsg message={errors.paymentMethod?.message} />

              {paymentMethod === "Card" && (
                <div className="mt-8 space-y-5 rounded-xl bg-gray-50 p-6 border border-gray-100 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center pb-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                      Card Credentials
                    </span>
                    <HiLockClosed className="w-4 h-4 text-gray-400" />
                  </div>
                  <input
                    {...register("cardNumber", {
                      required: true,
                      pattern: /^[0-9]{16}$/,
                    })}
                    placeholder="Card Number (16 Digits)"
                    maxLength={16}
                    className="w-full p-3.5 rounded border border-gray-200 outline-none focus:border-black text-sm font-mono tracking-widest"
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <input
                      {...register("expiry", { required: true })}
                      placeholder="MM / YY"
                      className="p-3.5 rounded border border-gray-200 outline-none focus:border-black text-sm font-medium"
                    />
                    <input
                      {...register("cvv", { required: true })}
                      placeholder="CVV"
                      maxLength={4}
                      className="p-3.5 rounded border border-gray-200 outline-none focus:border-black text-sm font-medium"
                    />
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* SIDEBAR SUMMARY */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 bg-white border border-gray-200 p-8 rounded-xl shadow-sm space-y-8">
              <h3 className="font-bold text-lg uppercase tracking-widest text-gray-900 border-b pb-4 border-gray-100">
                Order Summary
              </h3>

              <div className="space-y-5 max-h-[300px] overflow-auto pr-2">
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-start text-sm"
                  >
                    <div className="gap-4 flex">
                      <div className="flex h-12 w-12 items-center justify-center rounded border border-gray-100 bg-gray-50 text-xl overflow-hidden">
                        {typeof item.image === "string" &&
                        item.image.startsWith("http") ? (
                          <img
                            src={item.image}
                            alt={item.title}
                            className="object-cover w-full h-full"
                          />
                        ) : (
                          item.image || item.product?.image
                        )}
                      </div>
                      <div>
                        <p className="font-bold leading-none text-gray-900">
                          {item.title}
                        </p>
                        <p className="mt-1 text-[11px] font-bold uppercase tracking-tighter text-gray-400">
                          Qty: {item?.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">
                      ${item.price.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="pt-2 space-y-3">
                <div className="flex justify-between text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span>${cartData?.totalPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-[11px] font-bold text-red-500 uppercase tracking-widest">
                  <span>Discount</span>
                  <span>-${cartData?.discountAmount?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                  <span className="text-gray-400 font-bold uppercase text-[10px] tracking-[0.2em]">
                    Grand Total
                  </span>
                  <span className="text-2xl font-bold text-black tracking-tight">
                    ${cartData?.finalPrice?.toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-5 rounded text-white font-bold uppercase text-xs tracking-[0.2em] shadow-md transition-all active:transform active:scale-[0.98] ${isSubmitting ? "bg-gray-300 cursor-not-allowed" : "bg-black hover:bg-gray-800"}`}
              >
                {isSubmitting ? "Processing" : "Confirm Purchase"}
              </button>

              <div className="flex flex-col items-center gap-4 pt-2">
                <div className="flex items-center gap-2 text-[9px] text-gray-400 uppercase tracking-[0.2em] font-bold">
                  <HiOutlineShieldCheck className="text-green-500 w-4 h-4" />
                  AES 256-bit Encryption
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
