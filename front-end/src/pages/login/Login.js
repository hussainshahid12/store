"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { fetchLoginUser } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import { resetState } from "../../../lib/features/cartSlice/cart";
import { resetState as resetUser } from "../../../lib/features/userSlice/user";
export default function LoginPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state) => state.user?.userInfo);
  const error = useSelector((state) => state.user?.error);
  const loading = useSelector((state) => state.user?.isLoading);

  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    dispatch(resetState());
    dispatch(resetUser());
  }, []);

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    if (state?.isVerified) {
      localStorage.setItem("isAuth", state.token);
      toast.success(state?.message);

      setTimeout(() => {
        router.push("/");
      }, 3000);
      // } else if (state?.msg) {
      //   toast.success(state?.msg);
    }
  }, [state, error]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    dispatch(fetchLoginUser(data));
  };

  // UI Constants matching Signup Page
  const inputStyle =
    "w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white";
  const iconStyle =
    "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400";
  const errorStyle = "text-xs text-red-500 mt-1 ml-1 font-medium";

  return (
    <section className="bg-[#f8fafc] dark:bg-gray-950 flex justify-center p-4 sm:p-5">
      {loading && <Loader />}

      <div className="w-full max-w-5xl bg-white dark:bg-gray-900 rounded-[2rem] shadow-2xl shadow-slate-200/60 dark:shadow-none overflow-hidden flex flex-col lg:flex-row border border-white dark:border-gray-800">
        {/* LEFT SIDE: FORM */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16">
          <div className="max-w-md mx-auto lg:mx-0">
            <header className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mb-2">
                Welcome back
              </h1>
              <p className="text-slate-500 dark:text-gray-400">
                Please enter your details to sign in.
              </p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Email */}
              <div>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={iconStyle}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                  </svg>
                  <input
                    {...register("email", { required: "Email is required" })}
                    type="email"
                    placeholder="Email Address"
                    className={inputStyle}
                  />
                </div>
                {errors.email && (
                  <p className={errorStyle}>{errors.email.message}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={iconStyle}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
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
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#ff6600] transition-colors"
                  >
                    {showPassword ? (
                      <HiEyeOff size={22} />
                    ) : (
                      <HiEye size={22} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className={errorStyle}>{errors.password.message}</p>
                )}
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-[#ff6600] focus:ring-[#ff6600]"
                  />
                  <span className="text-sm text-slate-600 dark:text-gray-400 group-hover:text-slate-900 transition-colors">
                    Remember me
                  </span>
                </label>
                <Link
                  href="/forgot-password"
                  size={20}
                  className="text-sm font-bold text-[#ff6600] hover:underline underline-offset-4"
                >
                  Forgot Password?
                </Link>
              </div>

              <button className="w-full bg-primary text-white rounded-xl py-4 font-bold hover:bg-[#e65c00] transition-all active:scale-[0.99] shadow-lg shadow-orange-100 dark:shadow-none mt-2">
                Sign In
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE: SOCIAL */}
        <div className="w-full lg:w-[45%] bg-slate-50/80 dark:bg-gray-800/50 p-8 sm:p-12 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-gray-800">
          <div className="w-full max-w-xs text-center">
            <h3 className="font-bold text-slate-400 dark:text-gray-500 mb-8 uppercase tracking-widest text-[10px]">
              Or continue with
            </h3>

            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-slate-200 dark:border-gray-700 rounded-xl py-3 px-4 text-slate-700 dark:text-white font-semibold hover:border-[#ff6600] transition-all shadow-sm active:scale-[0.98]">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Google
              </button>

              <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-xl py-3 px-4 font-semibold hover:bg-[#145dbf] transition-all shadow-md active:scale-[0.98]">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
                Facebook
              </button>
            </div>

            <p className="mt-12 text-slate-500 dark:text-gray-400 text-sm font-medium">
              Don't have an account?{" "}
              <Link
                href="/signUp"
                className="text-[#ff6600] font-bold hover:underline underline-offset-4 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </section>
  );
}
