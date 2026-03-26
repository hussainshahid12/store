"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOtpVerify } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import { useRouter, useSearchParams } from "next/navigation";
import emailMarked from "../../../utils/markedEmail/emailMarked";
import { motion, AnimatePresence } from "framer-motion";

export default function VerifyPage() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Destructuring with default values to prevent "undefined" crashes
  const { userInfo: state, error, isLoading: loading } = useSelector((state) => state.user || {});

  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  // Professional Navigation & Success Handling
  useEffect(() => {
    if (state?.message) {
      toast.success(state?.message, {
        style: { borderRadius: '15px', background: '#333', color: '#fff' }
      });
      const timer = setTimeout(() => router.push(`/login`), 2500);
      return () => clearTimeout(timer);
    }
    if (error) {
      toast.error(error);
      // Logic for an "Error Shake" could be added here
    }
  }, [state, error, router]);

  // Precise Timer Logic
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

    // Smooth auto-focus
    if (value && index < 3) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const data = e.clipboardData.getData("text").slice(0, 4);
    if (!/^\d+$/.test(data)) return;
    
    const newOtp = data.split("").concat(new Array(4 - data.length).fill(""));
    setOtp(newOtp.slice(0, 4));
    inputsRef.current[Math.min(data.length, 3)]?.focus();
  };

  const handleResend = async () => {
    setIsResending(true);
    // Trigger your API call here
    setTimeout(() => {
      setTimeLeft(300);
      setIsResending(false);
      toast.success("New code sent!");
    }, 1000);
  };

  const isComplete = !otp.includes("");
  const progressPercent = (timeLeft / 300) * 100;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8FAFC] p-6 selection:bg-primary/20">
      {loading && <Loader />}
      <Toaster position="top-center" />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Main Card */}
        <div className="bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] border border-slate-100 overflow-hidden relative">
          
          {/* Top Decorative Progress Bar */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-slate-50">
            <motion.div 
              className={`h-full ${timeLeft < 60 ? 'bg-rose-500' : 'bg-primary'}`}
              initial={{ width: "100%" }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ ease: "linear" }}
            />
          </div>

          <div className="p-8 md:p-12">
            {/* Header */}
            <header className="text-center mb-10">
              <div className="w-20 h-20 bg-primary/5 rounded-4xl flex items-center justify-center mx-auto mb-6 text-primary">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 00-2 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h1 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">Two-Step Verification</h1>
              <p className="text-slate-500 text-sm">
                Enter the 4-digit code sent to <br/> 
                <span className="text-slate-900 font-semibold">{emailMarked(searchParams.get("email"))}</span>
              </p>
            </header>

            {/* Input Section */}
            <div className="space-y-8">
              <div className="flex justify-between gap-4">
                {otp.map((digit, index) => (
                  <motion.input
                    key={index}
                    whileFocus={{ scale: 1.05 }}
                    ref={(el) => (inputsRef.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onPaste={handlePaste}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-full h-20 text-center text-3xl font-bold rounded-2xl border-2 border-slate-100 bg-slate-50/50 focus:bg-white focus:border-primary focus:ring-[6px] focus:ring-primary/5 outline-none transition-all duration-200"
                  />
                ))}
              </div>

              {/* Action Button */}
              <button
                onClick={() => dispatch(fetchOtpVerify({ userId: searchParams.get("id"), otp: otp.join("") }))}
                disabled={!isComplete || timeLeft === 0 || loading}
                className={`w-full h-16 rounded-2xl font-bold text-lg transition-all duration-300 relative overflow-hidden
                  ${isComplete && !loading 
                    ? "bg-primary text-white shadow-xl shadow-primary/25 hover:shadow-primary/40 active:scale-[0.98]" 
                    : "bg-slate-100 text-slate-400 cursor-not-allowed"}`}
              >
                {loading ? "Verifying Security Code..." : "Securely Verify"}
              </button>
            </div>

            {/* Timer & Resend */}
            <div className="mt-10 flex flex-col items-center gap-6">
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-slate-400">Code expires in:</span>
                <span className={`font-mono font-bold ${timeLeft < 60 ? 'text-rose-500' : 'text-primary'}`}>
                  {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
                </span>
              </div>
              
              <button
                onClick={handleResend}
                disabled={timeLeft > 240 || isResending}
                className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-primary disabled:opacity-30 transition-all flex items-center gap-2"
              >
                {isResending ? "Dispatching New Code..." : "Resend Verification Code"}
              </button>
            </div>
          </div>
        </div>

        {/* Brand Footer */}
        <footer className="mt-12 text-center">
          <p className="text-slate-400 text-sm">
            Not your account? <button className="text-primary font-bold hover:underline">Sign out</button>
          </p>
        </footer>
      </motion.div>
    </div>
  );
}