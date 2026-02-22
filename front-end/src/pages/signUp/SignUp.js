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

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state) => state.user?.userInfo);
  const error = useSelector((state) => state.user?.error);
  const loading = useSelector((state) => state.user?.isLoading);

  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  useEffect(() => {
    if (error) {
      toast.error(error);
      return;
    }

    if (state?.message) {
      toast.success(state?.message);
      setTimeout(() => {
        router.push(`/verify_otp?id=${state.userId}&email=${state.email}`);
      }, 3000);

      dispatch(resetState());
    }
  }, [state, error]);

  const onSubmit = (data) => {
    dispatch(fetchSignUpUser(data));
  };

  // Theme Constants (Orange Primary: #ff6600)
  const inputStyle =
    "w-full pl-11 pr-12 py-3 bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all text-slate-700 placeholder:text-slate-400 dark:bg-gray-800 dark:border-gray-700 dark:text-white";
  const iconStyle =
    "absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400";
  const errorStyle = "text-xs text-red-500 mt-1 ml-1 font-medium";

  return (
    <section className="bg-[#f8fafc] min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-5">
      {loading && <Loader />}

      <div className="w-full max-w-5xl bg-white rounded-[2rem] shadow-2xl shadow-slate-200/60 overflow-hidden flex flex-col lg:flex-row border border-white">
        {/* FORM SIDE */}
        <div className="w-full lg:w-[55%] p-8 sm:p-12 lg:p-16">
          <div className="max-w-md mx-auto lg:mx-0">
            <header className="mb-8 text-center lg:text-left">
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                Create account
              </h1>
              <p className="text-slate-500">Join us with your primary email.</p>
            </header>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
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
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <input
                    {...register("fullName", {
                      required: "Full Name  is required",
                    })}
                    type="text"
                    placeholder="Full Name"
                    className={inputStyle}
                  />
                </div>
                {errors.fullName && (
                  <p className={errorStyle}>{errors.fullName.message}</p>
                )}
              </div>

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

              {/* Mobile Number */}
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
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3"
                    />
                  </svg>
                  <input
                    {...register("mobileNumber", {
                      required: "Mobile number is required",
                      pattern: {
                        value: /^[0-9]+$/, // Removed +- to ensure only numbers are entered
                        message: "Please enter only numbers",
                      },
                      minLength: {
                        value: 11,
                        message: "Mobile number must be exactly 11 digits",
                      },
                      maxLength: {
                        value: 11,
                        message: "Mobile number must be exactly 11 digits",
                      },
                    })}
                    type="tel"
                    placeholder="Mobile Number"
                    className={inputStyle}
                  />
                </div>
                {errors.mobileNumber && (
                  <p className={errorStyle}>{errors.mobileNumber.message}</p>
                )}
              </div>

              {/* Password */}
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
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 character",
                    },
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268-2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268-2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>

                {errors.password && (
                  <p className={errorStyle}>{errors.password.message}</p>
                )}
              </div>

              {/* Confirm Password */}
              {/* <div>
                <div className="relative">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={iconStyle}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <input
                    {...register("confirmPassword", {
                      validate: (val) =>
                        val === password || "Passwords do not match",
                    })}
                    type={showPassword ? "text" : "password"}
                    placeholder="Confirm Password"
                    className={inputStyle}
                  />
                </div>
                {errors.confirmPassword && (
                  <p className={errorStyle}>{errors.confirmPassword.message}</p>
                )}
              </div> */}

              <button className="w-full bg-[#ff6600] text-white rounded-xl py-4 font-bold hover:bg-[#e65c00] transition-all active:scale-[0.99] shadow-lg shadow-orange-100 mt-4">
                Create Account
              </button>
            </form>
          </div>
        </div>

        {/* SOCIAL SIDE */}
        <div className="w-full lg:w-[45%] bg-slate-50/80 p-8 sm:p-12 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
          <div className="w-full max-w-xs text-center">
            <h3 className="font-bold text-slate-400 mb-8 uppercase tracking-widest text-[10px]">
              Or join with
            </h3>
            <div className="space-y-4">
              <button className="w-full flex items-center justify-center gap-3 bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-700 font-semibold hover:border-[#ff6600] transition-all shadow-sm active:scale-[0.98]">
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
            <p className="mt-12 text-slate-500 text-sm font-medium">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-[#ff6600] font-bold hover:underline underline-offset-4 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-center" />
    </section>
  );
}
