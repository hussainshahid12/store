"use client";
import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronLeft, FiChevronRight, FiArrowRight, FiZap } from "react-icons/fi";

const sliderData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1400",
    label: "Limited Edition",
    title: "Series 7 Smart Pro",
    desc: "Redefining the boundaries of wearable technology with 48h battery life.",
    color: "bg-blue-600",
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1400",
    label: "Audio Excellence",
    title: "Studio-Grade Sound",
    desc: "Experience zero-latency audio and 40dB active noise cancellation.",
    color: "bg-purple-600",
  },
];

const ProfessionalHero = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrent((prev) => (prev === sliderData.length - 1 ? 0 : prev + 1));
  }, []);

  useEffect(() => {
    const interval = setInterval(nextSlide, 7000);
    return () => clearInterval(interval);
  }, [nextSlide]);

  return (
    <div className="max-w-[1536px] mx-auto p-4 md:p-6 lg:p-10 font-sans">
      <div className="grid grid-cols-12 gap-6 h-auto lg:h-[650px]">
        
        {/* --- MAIN INTERACTIVE SLIDER (8 Columns) --- */}
        <div className="col-span-12 lg:col-span-8 relative rounded-[2.5rem] overflow-hidden shadow-2xl bg-neutral-100 group">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0"
            >
              <Image
                src={sliderData[current].image}
                alt="Product"
                fill
                priority
                className="object-cover"
              />
              {/* Intelligent Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/20 to-transparent" />
            </motion.div>
          </AnimatePresence>

          {/* Slider Content */}
          <div className="relative h-full flex flex-col justify-end p-8 md:p-16 z-10">
            <motion.div
              key={`text-${current}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="max-w-xl space-y-6"
            >
              <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-bold uppercase tracking-[0.2em]">
                {sliderData[current].label}
              </span>
              <h2 className="text-4xl md:text-7xl font-extrabold text-white leading-[1.1] tracking-tight">
                {sliderData[current].title}
              </h2>
              <p className="text-lg text-white/80 font-light max-w-md">
                {sliderData[current].desc}
              </p>
              <div className="flex items-center gap-4 pt-4">
                <button className="px-8 py-4 bg-white text-black rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 group/btn">
                  Shop Collection 
                  <FiArrowRight className="group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>

            {/* Pagination Lines */}
            <div className="flex gap-3 mt-12">
              {sliderData.map((_, i) => (
                <div 
                  key={i} 
                  onClick={() => setCurrent(i)}
                  className="h-1.5 flex-1 max-w-[80px] bg-white/20 rounded-full overflow-hidden cursor-pointer"
                >
                  {i === current && (
                    <motion.div 
                      layoutId="progress"
                      className="h-full bg-white"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 7 }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- PRO SIDE CARDS (4 Columns) --- */}
        <div className="col-span-12 lg:col-span-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">
          
          {/* Ad Card 1: Visual & Dark */}
          <div className="relative group rounded-[2.5rem] overflow-hidden shadow-xl bg-zinc-900 h-full min-h-[280px]">
            <Image 
              src="https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600" 
              alt="Promo" 
              fill 
              className="object-cover opacity-50 group-hover:scale-110 transition-transform duration-[2s]"
            />
            <div className="absolute inset-0 p-8 flex flex-col justify-between">
              <div className="bg-yellow-400 text-black font-black px-3 py-1 rounded-lg w-fit text-xs uppercase">
                25% OFF
              </div>
              <div>
                <h3 className="text-white text-2xl font-bold mb-1">Modern Kicks</h3>
                <p className="text-white/60 text-sm mb-4">The New Urban Collection</p>
                <button className="flex items-center gap-2 text-white font-bold text-sm group-hover:gap-4 transition-all">
                  Shop Now <FiArrowRight className="text-yellow-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Ad Card 2: Minimal & Bright */}
          <div className="relative rounded-[2.5rem] overflow-hidden shadow-xl bg-blue-600 h-full min-h-[280px] p-8 flex flex-col justify-between text-white group">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-1000" />
            
            <FiZap size={40} className="text-yellow-300" />
            <div>
              <h3 className="text-3xl font-black italic mb-2 uppercase leading-none">
                Flash <br/> Deals
              </h3>
              <p className="text-blue-100 text-sm mb-6">Ends in 04:24:59</p>
              <button className="w-full py-3 bg-black/20 backdrop-blur-md border border-white/30 rounded-xl font-bold hover:bg-white hover:text-blue-600 transition-colors">
                View All Deals
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfessionalHero;