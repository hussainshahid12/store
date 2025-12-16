"use client";

import { useEffect, useRef, useState } from "react";

export default function VerifyPage() {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const inputsRef = useRef([]);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = () => {
    if (otp.includes("") || timeLeft === 0) return;
    console.log("OTP Verified:", otp.join(""));
  };

  const handleResend = () => {
    setOtp(["", "", "", ""]);
    setTimeLeft(300);
    inputsRef.current[0]?.focus();
    console.log("OTP Resent");
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const isOtpComplete = !otp.includes("");

  return (
    <div className="min-h-[100dvh] flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Mobile Phone Verification
        </h1>

        <p className="text-gray-500 mb-3">
          Enter the 4-digit verification code sent to your phone number.
        </p>

        <p className="text-sm text-gray-600 mb-6">
          OTP expires in{" "}
          <span className="font-semibold text-indigo-600">{formatTime()}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4 mb-6">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputsRef.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-14 h-14 text-center text-xl font-semibold rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          ))}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={!isOtpComplete || timeLeft === 0}
          className={`w-full py-3 rounded-xl font-semibold text-lg transition
            ${
              isOtpComplete && timeLeft > 0
                ? "bg-indigo-500 text-white hover:bg-indigo-600 cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
        >
          Verify Account
        </button>

        {/* Resend */}
        <p className="mt-6 text-sm text-gray-500">
          Didn’t receive code?{" "}
          <button
            onClick={handleResend}
            disabled={timeLeft > 0}
            className={`font-medium
              ${
                timeLeft === 0
                  ? "text-indigo-500 hover:underline cursor-pointer"
                  : "text-gray-400 "
              }`}
          >
            <span className="text-indigo-500 cursor-pointer">Resend</span>
          </button>
        </p>
      </div>
    </div>
  );
}
