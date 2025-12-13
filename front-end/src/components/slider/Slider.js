"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Slider = () => {
  const slides = [
    "https://picsum.photos/id/1018/1200/400",
    "https://picsum.photos/id/1025/1200/400",
    "https://picsum.photos/id/1033/1200/400",
    "https://picsum.photos/id/1041/1200/400",
    "https://picsum.photos/id/1050/1200/400",
  ];

  const [current, setCurrent] = useState(0);
  const slideRef = useRef();

  const nextSlide = () => {
    setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full  mx-auto overflow-hidden ">
      {/* Slides container */}
      <div
        className="flex transition-transform duration-700"
        style={{ transform: `translateX(-${current * 100}%)` }}
        ref={slideRef}
      >
        {slides.map((src, index) => (
          <div key={index} className="relative w-full flex-shrink-0 h-56 md:h-96">
            <Image src={src} alt={`Slide ${index + 1}`} fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* Prev Button */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-20"
      >
        <FiChevronLeft size={30} />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-white bg-black/40 hover:bg-black/60 rounded-full p-2 z-20"
      >
        <FiChevronRight size={30} />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              index === current ? "bg-white" : "bg-white/50"
            }`}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Slider;
