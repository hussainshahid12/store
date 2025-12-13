"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const categoriesData = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `Category ${i + 1}`,
  image: `https://picsum.photos/seed/${i + 1}/150/150`,
}));

const CategoryCard = ({ category, onClick }) => (
  <div
    className="flex flex-col items-center cursor-pointer p-3 rounded-lg transition transform hover:scale-105 bg-white dark:bg-gray-800 shadow hover:shadow-lg min-w-[130px]"
    onClick={onClick}
  >
    <div className="relative w-24 h-24 mb-2">
      <Image
        src={category.image}
        alt={category.name}
        fill
        className="object-cover rounded-full"
      />
    </div>
    <span className="text-gray-800 dark:text-white font-semibold text-sm text-center truncate w-full">
      {category.name}
    </span>
  </div>
);

const ProductCategories = () => {
  const scrollRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  const speed = 1.2; // ⭐ Smooth & faster auto movement

  // 🔁 Auto movement
  useEffect(() => {
    let frame;

    const autoScroll = () => {
      if (!isPaused && scrollRef.current) {
        scrollRef.current.scrollLeft += speed;
      }
      frame = requestAnimationFrame(autoScroll);
    };

    frame = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(frame);
  }, [isPaused]);

  // Manual arrow scroll
  const scroll = (dir) => {
    scrollRef.current?.scrollBy({
      left: dir === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-20 py-8 overflow-hidden relative">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
        Product Categories
      </h2>

      {/* Left arrow */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-[-20px] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow rounded-full p-2 z-10 hover:bg-blue-600 hover:text-white transition"
      >
        <FaChevronLeft />
      </button>

      {/* Right arrow */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-[-20px] top-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 shadow rounded-full p-2 z-10 hover:bg-blue-600 hover:text-white transition"
      >
        <FaChevronRight />
      </button>

      {/* Auto-moving strip */}
      <div
        ref={scrollRef}
        className="flex space-x-4 overflow-x-auto overflow-y-hidden no-scrollbar py-3 px-8"
        onMouseEnter={() => setIsPaused(true)} // ⭐ Hover → STOP
        onMouseLeave={() => setIsPaused(false)} // ⭐ Leave → AUTO RESUME
      >
        {[...categoriesData, ...categoriesData].map((category, index) => (
          <CategoryCard
            key={index}
            category={category}
            onClick={() => alert(`You clicked ${category.name}`)}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductCategories;
