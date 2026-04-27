"use client";
import React, { useRef, memo, useState } from "react";
import QuickViewModal from "../itemModal/QuickViewModal";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";

// --- SKELETON COMPONENT ---
const SkeletonCard = () => (
  <div className="flex-shrink-0 basis-[calc(50%-8px)] sm:basis-[33%] lg:basis-[calc(100%/6-14px)] flex flex-col snap-start animate-pulse">
    <div className="aspect-[1/1.2] bg-gray-100 rounded-2xl w-full" />
    <div className="mt-3 px-1 space-y-2">
      <div className="h-2 w-1/3 bg-gray-100 rounded" />
      <div className="h-3 w-full bg-gray-100 rounded" />
      <div className="h-4 w-1/2 bg-gray-100 rounded mt-2" />
    </div>
  </div>
);

// --- INDIVIDUAL ITEM COMPONENT ---
const CarouselItem = ({ product, setSelectedProduct }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const discount = Math.round(product.discountPercentage || 0);
  const oldPrice = (product.price / (1 - discount / 100)).toFixed(2);
  const rating = product.rating || 0;
  const imageSrc = product.thumbnail || (product.images && product.images[0]) || "/placeholder.png";

  return (
    <div className="flex-shrink-0 basis-[calc(50%-8px)] sm:basis-[33%] lg:basis-[calc(100%/6-14px)] flex flex-col snap-start bg-white">
      <div className="group relative aspect-[1/1.2] bg-[#F3F4F6] rounded-2xl overflow-hidden flex items-center justify-center p-2 md:p-4 transition-all">
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 z-10 animate-pulse">
            <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-20">
          {discount > 0 && (
            <span className="bg-red-600 text-white text-[8px] md:text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit">
              -{discount}%
            </span>
          )}
        </div>

        <Image
          src={imageSrc}
          alt={product.title || "Product Image"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
          className={`object-contain p-2 md:p-4 transition-all duration-700 ease-in-out group-hover:scale-105 ${
            imageLoaded ? "opacity-100 scale-100" : "opacity-0 scale-105"
          }`}
          onLoadingComplete={() => setImageLoaded(true)}
        />

        <div className="absolute inset-x-2 bottom-2 z-30 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
          <button
            className="w-full bg-white/95 backdrop-blur-sm text-black py-2 rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-black hover:text-white transition-colors"
            onClick={() => setSelectedProduct(product)}
          >
            Quick Add
          </button>
        </div>
        
        <button
          onClick={() => setSelectedProduct(product)}
          className="lg:hidden absolute bottom-2 right-2 z-20 w-7 h-7 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"
        >
          <FiPlus size={14} strokeWidth={3} />
        </button>
      </div>

      <div className="mt-2 md:mt-3 flex flex-col flex-grow px-1">
        <span className="text-[8px] md:text-[9px] text-gray-400 uppercase font-black tracking-widest truncate">
          {product.category}
        </span>
        <h3 className="text-[11px] md:text-[13px] font-bold text-gray-900 leading-tight line-clamp-1 mb-1">
          {product.title}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
          <span className="text-xs md:text-sm font-black text-gray-900">${product.price}</span>
          {discount > 0 && (
            <span className="text-[9px] md:text-[10px] text-gray-400 line-through font-medium">${oldPrice}</span>
          )}
        </div>
      </div>
    </div>
  );
};

// --- MAIN CAROUSEL ---
const ProductCarousel = ({ title, subtitle, products = [], isLoading = false }) => {
  const scrollRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const displayProducts = products.slice(0, 30);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo = direction === "left" ? scrollLeft - clientWidth : scrollLeft + clientWidth;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section className="py-8 md:py-12 bg-white overflow-hidden">
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      <div className="max-w-[1550px] mx-auto px-4 md:px-6">
        <div className="flex justify-between items-end mb-6 md:mb-8">
          <div>
            <span className="text-red-600 font-bold text-[9px] md:text-[10px] uppercase tracking-widest">{subtitle}</span>
            <h2 className="text-xl md:text-3xl font-black text-gray-900 uppercase tracking-tighter">{title}</h2>
          </div>

          {!isLoading && displayProducts.length > 2 && (
            <div className="flex gap-2">
              <button onClick={() => scroll("left")} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" /></svg></button>
              <button onClick={() => scroll("right")} className="w-9 h-9 flex items-center justify-center border border-gray-200 rounded-full hover:bg-black hover:text-white transition-all"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg></button>
            </div>
          )}
        </div>

        <div ref={scrollRef} className="flex items-start gap-3 md:gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-6" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            displayProducts.map((product) => (
              <CarouselItem key={product._id || product.id} product={product} setSelectedProduct={setSelectedProduct} />
            ))
          )}

          {!isLoading && products.length > 30 && (
            <div className="flex-shrink-0 basis-[calc(50%-8px)] sm:basis-[33%] lg:basis-[calc(100%/6-14px)] flex flex-col snap-start">
              <button className="group flex flex-col items-center justify-center aspect-[1/1.2] rounded-2xl border-2 border-dashed border-gray-200 hover:border-black transition-all">
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black flex items-center justify-center text-white mb-2 md:mb-3"><svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" /></svg></div>
                <span className="text-[9px] md:text-[11px] font-black uppercase tracking-widest text-gray-900">View All</span>
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
};

export default memo(ProductCarousel);