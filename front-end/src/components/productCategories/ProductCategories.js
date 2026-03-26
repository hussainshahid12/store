"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchALLCategory } from "../../../lib/features/productSlice/product";

// --- Sub-Components ---

const CategorySkeleton = () => (
  <div className="flex flex-col items-center min-w-[110px] animate-pulse">
    <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700 mb-3" />
    <div className="h-3 w-16 bg-gray-200 dark:bg-gray-700 rounded" />
  </div>
);

const CategoryCard = ({ category, onClick }) => (
  <div
    className="category-card group flex flex-col items-center cursor-pointer p-4 rounded-2xl transition-all duration-300 hover:bg-white dark:hover:bg-gray-800 hover:shadow-xl min-w-[120px] shrink-0"
    onClick={onClick}
  >
    <div className="relative w-20 h-20 mb-3 p-1 rounded-full bg-gradient-to-tr from-primary/20 to-transparent group-hover:from-primary transition-colors duration-500">
      <div className="relative w-full h-full overflow-hidden rounded-full border-2 border-white dark:border-gray-900 shadow-inner">
        <Image
          src={category.images}
          alt={category._id}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
    </div>
    <span className="text-gray-600 dark:text-gray-400 font-semibold text-xs uppercase tracking-wider text-center group-hover:text-primary transition-colors">
      {category._id}
    </span>
  </div>
);

// --- Main Component ---

const ProductCategories = () => {
  const dispatch = useDispatch();
  const {
    response: categoryState,
    isLoading,
    error,
  } = useSelector((state) => state.product.category || {});

  useEffect(() => {
    dispatch(fetchALLCategory());
  }, [dispatch]);

  if (error) return null; // Or a professional error toast

  return (
    <section className="py-16 bg-gray-50/50 dark:bg-gray-950 overflow-hidden">
      <div className="max-w-screen-xl mx-auto px-6 mb-10 flex flex-col items-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
          Shop by <span className="text-primary ">Category</span>
        </h2>
        <div className="h-1 w-20 bg-primary rounded-full" />
      </div>

      {/* Modern Scrolling Container */}
      <div className="relative flex items-center">
        {/* Left/Right Fades for Professional Look */}
        <div className="absolute left-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-r from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-20 z-10 bg-gradient-to-l from-gray-50 dark:from-gray-950 to-transparent pointer-events-none" />

        <div className="flex overflow-hidden">
          <div
            className={`flex whitespace-nowrap ${!isLoading && "animate-infinite-scroll"}`}
          >
            {isLoading
              ? // Skeleton Loading State
                Array(8)
                  .fill(0)
                  .map((_, i) => <CategorySkeleton key={i} />)
              : // Duplicating the array twice for a seamless infinite loop
                [...(categoryState || []), ...(categoryState || [])].map(
                  (category, index) => (
                    <CategoryCard
                      key={`${category._id}-${index}`}
                      category={category}
                      onClick={() =>
                        console.log(`Navigating to: ${category._id}`)
                      }
                    />
                  ),
                )}
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes infinite-scroll {
          from {
            transform: translateX(0);
          }
          to {
            transform: translateX(-50%);
          }
        }
        .animate-infinite-scroll {
          display: flex;
          width: max-content;
          animation: infinite-scroll 40s linear infinite;
        }
        .category-card:hover ~ .animate-infinite-scroll,
        .animate-infinite-scroll:hover,
        .category-card:hover .animate-infinite-scroll {
          animation-play-state: paused !important;
        }
      `}</style>
    </section>
  );
};

export default ProductCategories;
