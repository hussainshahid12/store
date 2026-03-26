"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSignUpUser,
  resetState,
} from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import {
  HiEye,
  HiEyeOff,
  HiMail,
  HiUser,
  HiPhone,
  HiLockClosed,
} from "react-icons/hi";
import { FaFacebook } from "react-icons/fa"; // Added Facebook icon
import { motion } from "framer-motion";

export default function SignupPage() {
  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const state = useSelector((state) => state.user?.userInfo);
  const error = useSelector((state) => state.user?.error);
  const loading = useSelector((state) => state.user?.isLoading);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    if (error) {
      toast.error(error);
      return;
    }
    if (state?.message) {
      toast.success(state?.message);
      setTimeout(() => {
        router.push(`/verify_otp?id=${state.userId}&email=${state.email}`);
      }, 2000);
      dispatch(resetState());
    }
  }, [state, error, mounted, router, dispatch]);

  const onSubmit = (data) => {
    dispatch(fetchSignUpUser(data));
  };

  if (!mounted) return null;

  const inputStyle =
    "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-white placeholder:text-slate-400 font-medium";
  const iconStyle =
    "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5";

  return (
    <section className="min-h-screen bg-[#f1f5f9] dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 rounded-full" />

      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[500px] z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-12 border border-white dark:border-gray-800">
          <div className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Get Started
            </h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium">
              Create your account in seconds.
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Full Name */}
            <div className="relative">
              <HiUser className={iconStyle} />
              <input
                {...register("fullName", { required: "Name is required" })}
                type="text"
                placeholder="Full Name"
                className={inputStyle}
              />
              {errors.fullName && (
                <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold uppercase">
                  {errors.fullName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div className="relative">
              <HiMail className={iconStyle} />
              <input
                {...register("email", { required: "Email is required" })}
                type="email"
                placeholder="Email Address"
                className={inputStyle}
              />
              {errors.email && (
                <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mobile */}
            <div className="relative">
              <HiPhone className={iconStyle} />
              <input
                {...register("mobileNumber", {
                  required: "Required",
                  minLength: { value: 11, message: "11 digits needed" },
                })}
                type="tel"
                placeholder="Mobile Number"
                className={inputStyle}
              />
              {errors.mobileNumber && (
                <p className="text-[10px] text-red-500 mt-1 ml-2 font-bold uppercase">
                  {errors.mobileNumber.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div className="relative">
              <HiLockClosed className={iconStyle} />
              <input
                {...register("password", {
                  required: "Required",
                  minLength: 8,
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={inputStyle}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
              >
                {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-4"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-xs font-bold text-slate-400 uppercase bg-transparent px-4">
                Or join with
              </div>
            </div>

            {/* Social Buttons Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl py-3 px-4 font-bold text-slate-700 dark:text-white hover:bg-slate-50 dark:hover:bg-gray-700 transition-all shadow-sm">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                <span className="text-sm">Google</span>
              </button>

              <button className="flex items-center justify-center gap-2 bg-[#1877F2] text-white border border-[#1877F2] rounded-2xl py-3 px-4 font-bold hover:bg-[#145dbf] transition-all shadow-sm">
                <FaFacebook size={18} />
                <span className="text-sm">Facebook</span>
              </button>
            </div>
          </div>

          <p className="mt-8 text-center text-slate-500 dark:text-gray-400 font-medium">
            Member already?{" "}
            <Link
              href="/login"
              className="text-primary font-black hover:underline underline-offset-4"
            >
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
