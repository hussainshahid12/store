"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Form Data:", data);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto min-h-screen">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white cursor-pointer"
        >
          <Image
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={32}
            height={32}
            className="mr-2"
          />
          Flowbite
        </Link>

        {/* Card */}
        <div className="w-full bg-white rounded-lg shadow sm:max-w-md xl:p-0 dark:bg-gray-800">
          <div className="p-6 space-y-6 sm:p-8">
            <h1 className="text-xl font-bold text-center text-gray-900 md:text-2xl dark:text-white">
              Sign in to your account
            </h1>

            {/* Social Login */}
            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded-lg py-2.5 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm font-medium">
                <Image
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Continue with Google
              </button>
              <button className="w-full flex items-center justify-center gap-3 bg-[#1877F2] text-white rounded-lg py-2.5 hover:bg-[#145dbf] text-sm font-medium">
                <Image
                  src="https://upload.wikimedia.org/wikipedia/commons/1/1b/Facebook_icon.svg"
                  alt="Facebook"
                  width={20}
                  height={20}
                />
                Continue with Facebook
              </button>

              {/* Divider */}
              <div className="flex items-center my-4 gap-3">
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  or
                </span>
                <hr className="flex-1 border-gray-300 dark:border-gray-600" />
              </div>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Your email
                </label>
                <input
                  type="email"
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5"
                  placeholder="xyz@gmail.com"
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password with Eye Toggle */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    {...register("password", {
                      required: "Password is required",
                    })}
                    className="bg-gray-50 border border-gray-300 rounded-lg block w-full p-2.5 pr-10"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-500 cursor-pointer"
                  >
                    {showPassword ? (
                      <HiEyeOff size={20} />
                    ) : (
                      <HiEye size={20} />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember Me + Forgot Password */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    {...register("remember", {
                      required: "You must agree to continue",
                    })}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                    Remember me
                  </span>
                </div>

                <Link
                  href="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Forgot password?
                </Link>
              </div>
              {errors.remember && (
                <p className="text-red-500 text-xs mt-1">
                  {errors.remember.message}
                </p>
              )}

              {/* Sign In Button */}
              <button
                type="submit"
                className="cursor-pointer w-full text-white bg-[#1877F2] hover:bg-[#145dbf] font-medium rounded-lg text-sm px-5 py-2.5"
              >
                Sign in
              </button>

              {/* Signup */}
              <p className="text-sm text-gray-500 text-center">
                Don’t have an account yet?{" "}
                <Link
                  href="/signUp"
                  className="font-medium text-blue-600 hover:underline cursor-pointer"
                >
                  Sign up
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
