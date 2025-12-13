"use client";

import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function SignupPage() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data) => {
    console.log("Signup Data:", data);
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900 min-h-screen flex flex-col items-center justify-center relative">
      
      {/* Logo outside card */}
      <div className="absolute top-12 flex items-center justify-center w-full">
        <Link
          href="/"
          className="flex items-center text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <Image
            src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
            alt="logo"
            width={48}
            height={48}
            className="mr-2"
          />
          Flowbite
        </Link>
      </div>

      {/* Card Container */}
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sm:p-8 mt-32">
        <h1 className="text-xl font-bold text-gray-900 md:text-2xl dark:text-white text-center mb-6">
          Create your account
        </h1>

        {/* Social Login */}
        <div className="space-y-3 mb-4">
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
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <hr className="flex-1 border-gray-300 dark:border-gray-600" />
          </div>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Full Name
            </label>
            <input
              {...register("name", { required: "Name is required" })}
              type="text"
              placeholder="John Doe"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Email Address
            </label>
            <input
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email format",
                },
              })}
              type="email"
              placeholder="name@gmail.com"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Mobile */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Mobile Number
            </label>
            <input
              {...register("mobile", {
                required: "Mobile number is required",
                pattern: {
                  value: /^(\+92|0)?3\d{9}$/,
                  message: "Invalid Pakistani mobile number",
                },
              })}
              type="tel"
              placeholder="03XXXXXXXXX"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile.message}</p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Password
            </label>
            <input
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Minimum 8 characters required",
                },
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg block w-full p-2.5"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Show Password Checkbox */}
          <div className="flex items-center mb-4">
            <input
              id="showPassword"
              type="checkbox"
              className="w-4 h-4 cursor-pointer text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
              checked={showPassword}
              onChange={(e) => setShowPassword(e.target.checked)}
            />
            <label
              htmlFor="showPassword"
              className="ml-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Show Password
            </label>
          </div>

          {/* Signup Button */}
          <button
            type="submit"
            className="w-full bg-[#1877F2] text-white rounded-lg py-2.5 font-medium hover:bg-blue-700"
          >
            Create Account
          </button>
        </form>

        {/* Login Link */}
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-600 hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </section>
  );
}
