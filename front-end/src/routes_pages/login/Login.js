"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff, HiMail, HiLockClosed } from "react-icons/hi";
import { FaFacebook } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchLoginUser,
  resetState as resetUser,
} from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import { resetState as resetCart } from "../../../lib/features/cartSlice/cart";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const { setIsAuth } = useAuth();

  const [mounted, setMounted] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    userInfo: state,
    error,
    isLoading: loading,
  } = useSelector((state) => state.user);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // Reset states
  useEffect(() => {
    setMounted(true);
    dispatch(resetCart());
    dispatch(resetUser());
  }, [dispatch]);

  // Handle login success
  useEffect(() => {
    if (!mounted) return;

    if (error) {
      toast.error(error);
      return;
    }

    if (state?.isVerified) {
      // ✅ Store token
      localStorage.setItem("isAuth", state.token);

      // ✅ Update auth context instantly
      setIsAuth(true);

      // ✅ Redirect
      const redirect = searchParams?.get("redirect") || "/";

      router.replace(redirect); // better than push
      router.refresh(); // 🔥 FIX for Vercel issue
    }
  }, [state?.isVerified, error, mounted, searchParams, router, setIsAuth]);

  const onSubmit = (data) => {
    dispatch(fetchLoginUser(data));
  };

  if (!mounted) return null;

  const inputStyle =
    "w-full pl-12 pr-4 py-4 bg-slate-50 dark:bg-gray-800/40 border border-slate-200 dark:border-gray-700 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700 dark:text-white placeholder:text-slate-400 font-medium";

  const iconStyle =
    "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5";

  return (
    <section className="min-h-screen bg-[#f1f5f9] dark:bg-black flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-center" />

      {/* Background */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[120px]" />

      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] shadow-xl p-8 sm:p-12 border border-white dark:border-gray-800">
          {/* Header */}
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-gray-400">
              Enter your details to continue
            </p>
          </header>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email */}
            <div>
              <div className="relative">
                <HiMail className={iconStyle} />
                <input
                  {...register("email", { required: "Email is required" })}
                  type="email"
                  placeholder="Email Address"
                  className={inputStyle}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-500 ml-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <div className="relative">
                <HiLockClosed className={iconStyle} />
                <input
                  {...register("password", {
                    required: "Password is required",
                  })}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className={inputStyle}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <HiEyeOff /> : <HiEye />}
                </button>
              </div>

              <div className="flex justify-end mt-1">
                <Link
                  href="/forgot-password"
                  className="text-xs text-primary font-bold"
                >
                  Forgot Password?
                </Link>
              </div>

              {errors.password && (
                <p className="text-xs text-red-500 ml-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold text-lg hover:opacity-90 transition"
            >
              Sign In
            </button>
          </form>

          {/* Social */}
          <div className="mt-10 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 border rounded-xl py-3">
              <Image
                src="https://www.svgrepo.com/show/475656/google-color.svg"
                alt="google"
                width={18}
                height={18}
              />
              Google
            </button>

            <button className="flex items-center justify-center gap-2 bg-blue-600 text-white rounded-xl py-3">
              <FaFacebook />
              Facebook
            </button>
          </div>

          {/* Footer */}
          <p className="mt-8 text-center text-sm">
            Don’t have an account?{" "}
            <Link href="/signUp" className="text-primary font-bold">
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
