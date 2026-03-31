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
import { useRouter } from "next/navigation";
import { resetState as resetCart } from "../../../lib/features/cartSlice/cart";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
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

  useEffect(() => {
    setMounted(true);
    dispatch(resetCart());
    dispatch(resetUser());
  }, [dispatch]);

  useEffect(() => {
    if (!mounted) return;

    if (error) {
      toast.error(error);
      return;
    }

    const handleAuthSuccess = async () => {
      if (state?.isVerified) {
        localStorage.setItem("isAuth", state.token);

        setIsAuth(true); // 🔥 instant UI update

        const redirect = searchParams.get("redirect");

        router.push(redirect || "/"); // ✅ NO refresh needed
      }
    };

    handleAuthSuccess();
  }, [state, error, router, mounted, dispatch]);

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

      {/* Background Decorative Elements */}
      <div className="absolute top-[-10%] right-[-10%] w-[45%] h-[45%] bg-primary/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[45%] h-[45%] bg-blue-600/10 rounded-full blur-[120px]" />

      {/* Loader shows during Login and Cart Merge */}
      {loading && <Loader />}

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }} // Speed matched to Signup
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_64px_-15px_rgba(0,0,0,0.1)] p-8 sm:p-12 border border-white dark:border-gray-800">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight mb-2">
              Welcome Back
            </h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium">
              Enter your details to continue
            </p>
          </header>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
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
                <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <HiEyeOff size={20} /> : <HiEye size={20} />}
                </button>
              </div>
              <div className="flex justify-end pr-1">
                <Link
                  href="/forgot-password"
                  size={20}
                  className="text-xs font-bold text-primary hover:opacity-80"
                >
                  Forgot Password?
                </Link>
              </div>
              {errors.password && (
                <p className="text-[10px] text-red-500 ml-2 font-bold uppercase">
                  {errors.password.message}
                </p>
              )}
            </div>

            <label className="flex items-center gap-3 cursor-pointer group w-fit ml-1">
              <input
                type="checkbox"
                className="w-5 h-5 rounded-lg border-slate-200 dark:border-gray-700 text-primary"
              />
              <span className="text-sm text-slate-500 dark:text-gray-400 font-medium group-hover:text-primary">
                Keep me logged in
              </span>
            </label>

            <button
              type="submit"
              className="w-full bg-primary text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 transition-all active:scale-[0.98] mt-2"
            >
              Sign In
            </button>
          </form>

          <div className="mt-10">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100 dark:border-gray-800"></div>
              </div>
              <div className="relative flex justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest px-4">
                Secure Social Login
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button className="flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-2xl py-3.5 px-4 font-bold text-slate-700 dark:text-white hover:bg-slate-50 group">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={18}
                  height={18}
                />
                <span className="text-sm group-hover:scale-105 transition-transform">
                  Google
                </span>
              </button>

              <button className="flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-2xl py-3.5 px-4 font-bold hover:bg-[#145dbf] group">
                <FaFacebook size={18} />
                <span className="text-sm group-hover:scale-105 transition-transform">
                  Facebook
                </span>
              </button>
            </div>
          </div>

          <p className="mt-10 text-center text-slate-500 dark:text-gray-400 font-medium">
            Don't have an account?{" "}
            <Link
              href="/signUp"
              className="text-primary font-black hover:underline underline-offset-4"
            >
              Sign Up Free
            </Link>
          </p>
        </div>
      </motion.div>
    </section>
  );
}
