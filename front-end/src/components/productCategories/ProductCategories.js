"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchALLCategory } from "../../../lib/features/productSlice/product";

const CategoryCard = ({ category, onClick }) => (
  // <div
  //   className="flex flex-col items-center cursor-pointer p-3 rounded-lg transition-transform duration-300 hover:scale-105 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md min-w-[100px] mx-1 flex-shrink-0"
  //   onClick={onClick}
  // >
    <div
    className="flex flex-col items-center cursor-pointer p-3 rounded-lg transition-transform duration-300 hover:scale-105   hover:shadow-md min-w-[100px] mx-1 flex-shrink-0"
    onClick={onClick}
  >
    <div className="relative w-16 h-16 mb-2 overflow-hidden rounded-full border-2 border-white dark:border-gray-800 shadow">
      <Image
        src={category.images}
        alt={category._id}
        fill
        className="object-cover"
      />
    </div>
    <span className="text-gray-700 dark:text-gray-300 font-medium text-xs text-center leading-tight px-1">
      {category._id.charAt(0).toUpperCase() + category._id.slice(1)}   {/* first letter capital */}
    </span>
  </div>
);

const ProductCategories = () => {
  const dispatch = useDispatch();
  const categoryState = useSelector((state) => state.product.category?.response);
  const isLoading = useSelector((state) => state.product.isLoading);
   const error = useSelector((state) => state.product.error);

  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    dispatch(fetchALLCategory());
  }, []);

  const speed = 1; // Auto-scroll speed (desktop only)

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(
        /Mobi|Android/i.test(navigator.userAgent) || window.innerWidth < 768
      );
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // For smooth dragging
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);

  // Auto-scroll only on desktop
  useEffect(() => {
    if (isMobile || !scrollRef.current) return;

    const scrollContainer = scrollRef.current;
    const scrollWidth = scrollContainer.scrollWidth / 2;

    let animationFrame;

    const autoScroll = () => {
      if (!isPaused && scrollContainer && !isDragging.current) {
        scrollContainer.scrollLeft += speed;

        if (scrollContainer.scrollLeft >= scrollWidth) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrame = requestAnimationFrame(autoScroll);
    };

    animationFrame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrame);
  }, [isPaused, isMobile]);

  // Touch handlers (mobile-friendly)
  const handleTouchStart = (e) => {
    isDragging.current = true;
    setIsPaused(true);

    startX.current = e.touches[0].clientX;
    scrollLeftStart.current = scrollRef.current.scrollLeft;
    scrollRef.current.style.scrollBehavior = "auto";
  };

  const handleTouchMove = (e) => {
    if (!isDragging.current) return;
    const currentX = e.touches[0].clientX;
    const walk = (currentX - startX.current) * 1.5;
    scrollRef.current.scrollLeft = scrollLeftStart.current - walk;
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    scrollRef.current.style.scrollBehavior = "smooth";

    setTimeout(() => {
      if (!isDragging.current && !isMobile) {
        setIsPaused(false);
      }
    }, 1500);
  };

  return (
    <section className="max-w-screen-xl mx-auto px-4 lg:px-20 py-12 bg-gray-50 dark:bg-gray-900">
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
        Product Categories
      </h2>
      <p className="text-center">
        {!categoryState && !isLoading && !error && "Fetch category..."}
      </p>

      <p className="text-center">{isLoading && "Loading..."}</p>

      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide py-3 px-1 touch-pan-x"
          onMouseEnter={() => !isMobile && setIsPaused(true)}
          onMouseLeave={() => !isMobile && setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            scrollBehavior: "smooth",
          }}
        >
          {/* Duplicated for seamless loop on desktop */}
          <div className="flex space-x-4">
            {categoryState?.map((category, index) => (
              <CategoryCard
                key={`${category._id}-${index}`}
                category={category}
                onClick={() => alert(`Selected: ${category._id}`)}
              />
            ))}
          </div>
        </div>

        <style jsx>{`
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
            height: 0;
            width: 0;
          }
        `}</style>
      </div>
    </section>
  );
};

export default ProductCategories;
