"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOtpVerify } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useRouter } from "next/navigation";
import emailMarked from "../../../utils/markedEmail/emailMarked";
export default function VerifyPage() {
  const params = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const router = useRouter();
  const state = useSelector((state) => state.user?.userInfo);
  const error = useSelector((state) => state.user?.error);
  const loading = useSelector((state) => state.user?.isLoading);

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message);
      setTimeout(() => {
        router.push(`/login`);
      }, 3000);
    }
    if (error) toast.error(error);
  }, [state, error, router]);

  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  const handleChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) inputsRef.current[index + 1].focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    await new Promise((res) => setTimeout(res, 1000));
    setOtp(["", "", "", ""]);
    setTimeLeft(300);
    setIsResending(false);
    inputsRef.current[0]?.focus();
  };

  const formatTime = () => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    return `${min}:${sec.toString().padStart(2, "0")}`;
  };

  const isComplete = !otp.includes("");
  const timerWidth = (timeLeft / 300) * 100;

  const verifyOTPHandler = () => {
    const userId = params.get("id");
    const code = otp.join("");
    dispatch(fetchOtpVerify({ userId, otp: code }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fbfcfd] px-4 font-sans">
      {loading && <Loader />}

      <div className="max-w-md w-full relative">
        {/* THE CARD */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] overflow-hidden">
          {/* TOP LOGO SECTION */}
          <div className="bg-slate-50/50 pt-10 pb-8 flex flex-col items-center border-b border-slate-50">
            {/* Email Icon Branding */}
            <div className="flex justify-center mb-8">
              <div className="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 transition-transform hover:scale-105 cursor-default">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Check your email
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              {emailMarked(params.get("email"))}
            </p>
            <p className="text-slate-400 text-sm mt-1">
              Verification code sent to your inbox
            </p>
          </div>

          {/* PROGRESS BAR */}
          <div className="h-1 w-full bg-slate-100">
            <div
              className="h-full bg-primary transition-all duration-1000 ease-linear"
              style={{ width: `${timerWidth}%` }}
            />
          </div>

          <div className="p-8 md:p-10">
            {/* TIMER & LABEL */}
            <div className="flex items-center justify-between mb-5">
              <span className="text-[11px] font-bold uppercase tracking-widest text-slate-400">
                Security Code
              </span>
              <div
                className={`flex items-center gap-2 px-3 py-1 rounded-full font-mono font-bold text-xs ${timeLeft > 0 ? "bg-primary/10 text-primary" : "bg-rose-50 text-rose-500"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${timeLeft > 0 ? "bg-primary animate-pulse" : "bg-rose-500"}`}
                />
                {formatTime()}
              </div>
            </div>

            {/* OTP INPUTS */}
            <div className="flex justify-between gap-3 mb-8">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => (inputsRef.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(e.target.value, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  className="w-full h-16 text-center text-3xl font-black rounded-2xl border-2 border-slate-100 bg-white focus:border-primary focus:ring-[6px] focus:ring-primary/5 transition-all outline-none text-slate-900 shadow-sm"
                />
              ))}
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={() => verifyOTPHandler()}
              disabled={!isComplete || timeLeft === 0}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] 
                ${
                  isComplete && timeLeft > 0
                    ? "bg-primary text-white shadow-xl shadow-primary/25 hover:bg-pHover"
                    : "bg-slate-100 text-slate-300 cursor-not-allowed shadow-none"
                }`}
            >
              Confirm Email
            </button>

            {/* FOOTER */}
            <div className="mt-8 text-center">
              <button
                onClick={handleResend}
                disabled={timeLeft > 0 || isResending}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-50 transition-colors inline-flex items-center gap-2"
              >
                {isResending ? "Sending..." : "Resend Verification Code"}
              </button>
            </div>
          </div>
        </div>

        {/* EXTERNAL LINK */}
        <p className="text-center mt-8 text-sm text-slate-400">
          Wrong email?{" "}
          <button className="text-primary font-bold hover:underline">
            Change address
          </button>
        </p>
      </div>
      <Toaster position="top-center" />
    </div>
  );
}
