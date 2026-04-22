"use client";
import React, { useRef, memo, useState } from "react";
import QuickViewModal from "../itemModal/QuickViewModal";
import { FiPlus } from "react-icons/fi";

const ProductCarousel = ({
  title,
  subtitle,
  products = [],
  isLoading = false,
}) => {
  const scrollRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  // Enforce frontend limit of 30 products
  const displayProducts = products.slice(0, 30);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return <div className="py-12 text-center font-bold">Loading...</div>;
  }

  return (
    <section className="py-12 bg-white overflow-hidden">
      {/* Modal for Quick View */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      <div className="max-w-[1550px] mx-auto px-4 md:px-6">
        {/* Header Section */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <span className="text-red-600 font-bold text-[10px] uppercase tracking-widest">
              {subtitle}
            </span>
            <h2 className="text-2xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">
              {title}
            </h2>
          </div>

          {/* Navigation Arrows (Visible only on desktop) */}
          {displayProducts.length > 6 && (
            <div className="hidden md:flex gap-2">
              <button
                onClick={() => scroll("left")}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all active:scale-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 19.5L8.25 12l7.5-7.5"
                  />
                </svg>
              </button>
              <button
                onClick={() => scroll("right")}
                className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all active:scale-90"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="w-4 h-4"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 4.5l7.5 7.5-7.5 7.5"
                  />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Scrollable Container */}
        <div
          ref={scrollRef}
          className="flex items-start gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-8 min-h-[350px]"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {displayProducts.map((product) => {
            const discount = Math.round(product.discountPercentage || 0);
            const oldPrice = (product.price / (1 - discount / 100)).toFixed(2);
            const rating = product.rating || 0;

            return (
              <div
                key={product._id || product.id}
                /* BASIS FIX: 
                   Mobile: 70% width (shows 1.3 cards)
                   Tablet: 33% width (shows 3 cards)
                   Desktop: 16.66% width (shows exactly 6 cards)
                   flex-shrink-0 prevents items from getting smaller
                */
                className="flex-shrink-0 basis-[70%] sm:basis-[33%] lg:basis-[calc(100%/6-14px)] flex flex-col snap-start bg-white"
              >
                {/* IMAGE AREA */}
                <div className="group relative aspect-[1/1.2] bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center p-4 transition-all">
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
                    {discount > 0 && (
                      <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit">
                        -{discount}%
                      </span>
                    )}
                    {rating > 4.5 && (
                      <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit uppercase tracking-tighter">
                        Top Seller
                      </span>
                    )}
                  </div>

                  <img
                    src={
                      product.thumbnail || (product.images && product.images[0])
                    }
                    alt={product.title}
                    className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                  />

                  <div className="absolute inset-x-2 bottom-2 z-30 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
                    <button
                      className="w-full bg-white/95 backdrop-blur-sm text-black py-2 rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-black hover:text-white transition-colors"
                      onClick={() => setSelectedProduct(product)}
                    >
                      Quick Add
                    </button>
                    
                  </div>
                  {/* Plus Button (Mobile/Tablet) */}
                    <button
                      onClick={() => setSelectedProduct(product)}
                      className="lg:hidden absolute bottom-2 right-2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"
                    >
                      <FiPlus size={16} strokeWidth={3} />
                    </button>
                </div>

                {/* INFO AREA */}
                <div className="mt-3 flex flex-col flex-grow px-1">
                  <span className="text-[9px] text-gray-400 uppercase font-black tracking-widest truncate">
                    {product.category}
                  </span>
                  <h3 className="text-[13px] font-bold text-gray-900 leading-tight line-clamp-1 mb-1">
                    {product.title}
                  </h3>

                  {/* STARS RATING */}
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          className={`w-2.5 h-2.5 ${index < Math.floor(rating) ? "text-yellow-400" : "text-gray-200"}`}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-[9px] text-gray-400 font-bold">
                      ({rating.toFixed(1)})
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-auto">
                    <span className="text-sm font-black text-gray-900">
                      ${product.price}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through font-medium">
                      ${oldPrice}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {/* VIEW ALL CARD - Visible only if products > 20 */}
          {products.length > 30 && (
            <div className="flex-shrink-0 basis-[70%] sm:basis-[33%] lg:basis-[calc(100%/6-14px)] flex flex-col snap-start">
              <button className="group flex flex-col items-center justify-center aspect-[1/1.2] rounded-2xl border-2 border-dashed border-gray-200 hover:border-black hover:bg-gray-50 transition-all duration-300">
                <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-black uppercase tracking-widest text-gray-900">
                  View All
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
};

export default memo(ProductCarousel);
