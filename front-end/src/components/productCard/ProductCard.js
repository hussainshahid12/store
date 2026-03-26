import { memo } from "react";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { FiPlus } from "react-icons/fi";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "/placeholder.png";

const ProductCard = memo(({ product, onOpenPopup }) => {
  const imageSrc =
    product.thumbnail &&
    typeof product.thumbnail === "string" &&
    product.thumbnail.trim() !== ""
      ? product.thumbnail
      : PLACEHOLDER_IMAGE;

  // Formatting URL for the detail page
  const productUrl = `/product/${product._id}/${
    product.description
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "view-product"
  }`;

  const originalPrice =
    product.discountPercentage > 0
      ? (product.price / (1 - product.discountPercentage / 100)).toFixed(2)
      : null;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[1rem] border border-slate-100 dark:border-slate-800 p-2 md:p-3 transition-all duration-500 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] dark:hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] hover:-translate-y-2 overflow-hidden flex flex-col h-full">
      {/* GLOBAL LINK: Makes entire card clickable */}
      <Link
        href={productUrl}
        className="absolute inset-0 z-10"
        aria-label={product.title}
      />

      {/* Image Container */}
      <div className="relative w-full aspect-square bg-slate-50 dark:bg-slate-800/40 rounded-[1rem] overflow-hidden pointer-events-none">
        <Image
          src={imageSrc}
          alt={product.title || "Product Image"}
          fill
          sizes="(max-width: 768px) 50vw, 20vw"
          className="object-contain p-6 transition-transform duration-700 group-hover:scale-110"
          priority={false}
        />

        {/* Floating Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5 z-20">
          {/* BEST SELLER BADGE */}
          {product.rating >= 4.5 && (
            <div className="bg-emerald-500 text-white text-[9px] md:text-[10px] font-black px-3 py-1 rounded-full shadow-lg uppercase tracking-wider">
              Best Seller
            </div>
          )}

          {/* DISCOUNT BADGE */}
          {product.discountPercentage > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-sm">
              {Math.round(product.discountPercentage)}% OFF
            </span>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="px-2 md:px-3 pt-4 pb-2 flex flex-col flex-grow relative z-20 pointer-events-none">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">
            {product.category || "Collection 2024"}
          </p>

          <h2 className="text-slate-800 dark:text-slate-100 text-sm md:text-base font-bold leading-tight line-clamp-2 mb-2 group-hover:text-primary transition-colors">
            {product.title}
          </h2>

          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex text-yellow-400 text-[10px]">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={
                    i < Math.round(product.rating || 0)
                      ? "fill-current"
                      : "text-slate-200 dark:text-slate-700"
                  }
                />
              ))}
            </div>
            <span className="text-[10px] md:text-[11px] font-bold text-slate-400">
              {product.rating?.toFixed(1) || "0.0"}
            </span>
          </div>
        </div>

        {/* Pricing & Add Button Row */}
        <div className="flex items-center justify-between mt-auto pt-2 pointer-events-auto">
          <div className="flex flex-col">
            {originalPrice && (
              <span className="text-[10px] md:text-xs text-slate-400 line-through leading-none mb-1">
                ${originalPrice}
              </span>
            )}
            <p className="text-base md:text-xl font-black text-slate-900 dark:text-white leading-none">
              ${product.price}
            </p>
          </div>

          {/* <button
            onClick={(e) => {
              e.preventDefault(); // Prevents page navigation
              e.stopPropagation(); // Prevents click bubbling
              onOpenPopup(product);
            }}
            className="cursor-pointer h-9 w-9 md:h-11 md:w-11 bg-primary hover:bg-slate-900 dark:hover:bg-primary text-white rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90"
            aria-label="Add to cart"
          >
            <FiPlus size={18} strokeWidth={3} className="md:w-5 md:h-5" />
          </button> */}
        </div>
      </div>
    </div>
  );
});

export default ProductCard;
