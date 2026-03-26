"use client";

import { useForm } from "react-hook-form";

export default function ResendOtpPage() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = (data) => {
    console.log("Resend OTP Email:", data.email);
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Resend Verification Code
        </h1>

        <p className="text-gray-500 text-center mb-6">
          Enter your email address to receive a new verification code.
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="example@email.com"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Enter a valid email address",
                },
              })}
              className={`w-full px-4 py-3 rounded-lg border bg-gray-50 focus:outline-none focus:ring-2
                ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-500"
                }`}
            />

            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 rounded-xl font-semibold text-lg transition
              ${
                isSubmitting
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
              }`}
          >
            {isSubmitting ? "Sending..." : "Resend OTP"}
          </button>
        </form>

        {/* Back Link */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Remember your code?{" "}
          <a
            href="/verify"
            className="text-indigo-500 font-medium hover:underline cursor-pointer"
          >
            Verify here
          </a>
        </p>
      </div>
    </div>
  );
}
