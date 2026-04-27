import { memo, useState } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi"; // Corrected import
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/placeholder.png";

const ProductCard = memo(({ product, onOpenPopup }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Safety check for image source
  const imageSrc = product.thumbnail || PLACEHOLDER_IMAGE;

  // Handle both MongoDB _id and standard id
  const productId = product._id || product.id;

  const productUrl = `/product/${productId}/${
    product.title?.toLowerCase().replace(/[^a-z0-9]+/g, "-") || "view"
  }`;

  const originalPrice =
    product.discountPercentage > 0
      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <div className="group flex flex-col snap-start bg-white dark:bg-slate-900 transition-all duration-300 h-full">
      {/* 1. IMAGE AREA */}
      <div className="relative aspect-[1/1.2] bg-[#F3F4F6] dark:bg-slate-800 rounded-2xl overflow-hidden flex items-center justify-center p-4 transition-all">
        <Link href={productUrl} className="absolute inset-0 z-10" />

        {/* Loader - visible while image is fetching */}
        {!isLoaded && (
          <div className="absolute inset-0 z-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800 animate-pulse">
            <div className="w-8 h-8 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-20">
          {product.discountPercentage > 0 && (
            <span className="bg-red-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit">
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
          {product.isTopSeller && (
            <span className="bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded shadow-sm w-fit uppercase tracking-tighter">
              Top Seller
            </span>
          )}
        </div>

        <Image
          src={imageSrc}
          alt={product.title || "Product Image"}
          fill
          unoptimized={true} // BYPASSES NEXT.JS OPTIMIZATION ERRORS IN PRODUCTION
          sizes="(max-width: 768px) 50vw, 20vw"
          className={`object-contain p-4 transition-all duration-700 ease-in-out ${
            isLoaded ? "scale-100 opacity-100" : "scale-105 opacity-0"
          } group-hover:scale-105`}
          onLoadingComplete={() => setIsLoaded(true)}
        />

        {/* Quick Add (Desktop) */}
        <div className="absolute inset-x-2 bottom-2 z-30 translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hidden lg:block">
          <button
            onClick={(e) => {
              e.preventDefault();
              onOpenPopup(product);
            }}
            className="w-full bg-white/95 backdrop-blur-sm text-black py-2 rounded-lg font-bold text-[10px] uppercase shadow-md hover:bg-black hover:text-white transition-colors flex items-center justify-center gap-1"
          >
            <FiPlus size={12} /> Quick Add
          </button>
        </div>

        {/* Quick Add (Mobile) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            onOpenPopup(product);
          }}
          className="lg:hidden absolute bottom-2 right-2 z-20 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center shadow-lg active:scale-90"
        >
          <FiPlus size={16} strokeWidth={3} />
        </button>
      </div>

      {/* 2. INFO AREA */}
      <div className="mt-3 flex flex-col flex-grow px-1">
        <span className="text-[9px] text-slate-400 dark:text-slate-500 uppercase font-black tracking-widest truncate">
          {product.brand || product.category || "ESSENTIALS"}
        </span>

        <h3 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight line-clamp-1 mb-1">
          {product.title}
        </h3>

        <div className="flex items-center gap-1 mb-2">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={10}
                className={
                  i < Math.floor(product.rating || 0)
                    ? "fill-current"
                    : "text-slate-200 dark:text-slate-700"
                }
              />
            ))}
          </div>
          <span className="text-[9px] text-slate-400 font-bold">
            ({product.rating?.toFixed(1)})
          </span>
        </div>

        <div className="flex items-center gap-2 mt-auto">
          <span className="text-sm font-black text-slate-900 dark:text-white">
            ${product.price}
          </span>
          {originalPrice && (
            <span className="text-[10px] text-slate-400 line-through font-medium">
              ${originalPrice}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

export default ProductCard;