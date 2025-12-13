"use client";

import { useState } from "react";
import {
  FaStar,
  FaRegStar,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaSync,
  FaShareAlt,
  FaMinus,
  FaPlus,
  FaCheck,
} from "react-icons/fa";

const product = {
  id: 1,
  title: "Essence Mascara Lash Princess",
  description:
    "The Essence Mascara Lash Princess is a popular mascara known for its volumizing and lengthening effects. Achieve dramatic lashes with this long-lasting and cruelty-free formula.",
  category: "beauty",
  price: 9.99,
  discountPercentage: 10.48,
  rating: 4.56,
  stock: 99,
  tags: ["beauty", "mascara"],
  brand: "Essence",
  sku: "BEA-ESS-ESS-001",
  images: [
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/1.webp",
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/2.webp",
    "https://cdn.dummyjson.com/product-images/beauty/essence-mascara-lash-princess/3.webp",
  ],
  reviews: [
    {
      rating: 3,
      comment: "Would not recommend!",
      reviewerName: "Eleanor Collins",
    },
    { rating: 4, comment: "Very satisfied!", reviewerName: "Lucas Gordon" },
    { rating: 5, comment: "Highly impressed!", reviewerName: "Harper Kelly" },
  ],
  shippingInformation: "Ships in 3-5 business days",
  returnPolicy: "30-day returns",
  availabilityStatus: "In Stock",
};

export default function ProductDetail() {
  const [mainImage, setMainImage] = useState(product.images[0]);
  const [quantity, setQuantity] = useState(1);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Fixed: Define averageRating properly
  const averageRating = product.rating;

  // Calculate discounted price
  const discountAmount = (product.price * product.discountPercentage) / 100;
  const originalPrice = (product.price + discountAmount).toFixed(2);

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x, y });
  };

  // add share handler
  const handleShare = async () => {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.title,
          text: product.description,
          url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        // minimal feedback for user
        alert("Product link copied to clipboard");
      }
    } catch (err) {
      // silent fail with console log
      console.error("Share failed:", err);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16 font-sans antialiased">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">
          {/* Image Gallery with Amazon-style Zoom */}
          <div className="space-y-6">
            <div
              className="relative rounded-2xl overflow-hidden bg-white shadow-2xl group cursor-zoom-in"
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
              onMouseMove={handleMouseMove}
            >
              <img
                src={mainImage}
                alt={product.title}
                className="w-full h-auto object-cover transition-transform duration-500 ease-out"
                style={{
                  transform: isZoomed ? "scale(2.5)" : "scale(1)",
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />

              {/* Magnifying Lens (Desktop only) */}
              {isZoomed && (
                <div
                  className="absolute pointer-events-none hidden lg:block z-20"
                  style={{
                    top: zoomPosition.y + "%",
                    left: zoomPosition.x + "%",
                    transform: "translate(-50%, -50%)",
                  }}
                >
                  <div
                    className="w-64 h-64 border-4 border-white rounded-full shadow-2xl overflow-hidden bg-cover bg-no-repeat"
                    style={{
                      backgroundImage: `url(${mainImage})`,
                      backgroundSize: "250%",
                      backgroundPosition: `${zoomPosition.x}% ${zoomPosition.y}%`,
                    }}
                  />
                </div>
              )}

              {/* In Stock Badge */}
              <div className="absolute top-5 left-5 bg-green-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                In Stock
              </div>

              {/* Hover to Zoom Hint */}
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 bg-black/70 text-white px-4 py-2 rounded-lg text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                Hover to zoom
              </div>
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`rounded-xl overflow-hidden border-4 transition-all duration-300 ${
                    mainImage === img
                      ? "border-indigo-600 shadow-xl ring-4 ring-indigo-100"
                      : "border-gray-300 hover:border-indigo-400"
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${i + 1}`}
                    className="w-full h-32 object-cover hover:opacity-90 transition"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Product Information */}
          <div className="space-y-10">
            {/* Brand & Title */}
            <div>
              <p className="text-indigo-600 font-bold text-xl tracking-wider uppercase">
                {product.brand}
              </p>
              <h1 className="text-4xl lg:text-5xl font-extrabold text-gray-900 mt-3 leading-tight">
                {product.title}
              </h1>
              <p className="text-gray-500 text-sm mt-2">SKU: {product.sku}</p>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-4">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="relative">
                    <FaRegStar className="w-8 h-8 text-gray-300" />
                    {i < averageRating && (
                      <FaStar
                        className="absolute inset-0 w-8 h-8 text-yellow-400"
                        style={{
                          clipPath:
                            i + 1 <= averageRating
                              ? "inset(0 0 0 0)"
                              : `inset(0 ${
                                  100 - (averageRating % 1) * 100
                                }% 0 0)`,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <span className="text-2xl font-bold text-gray-800">
                {averageRating.toFixed(1)}
              </span>
              <span className="text-lg text-gray-600 underline hover:text-indigo-600 cursor-pointer">
                ({product.reviews.length} customer reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-5">
              <span className="text-5xl font-extrabold text-gray-900">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-2xl text-gray-500 line-through">
                ${originalPrice}
              </span>
              <span className="bg-red-100 text-red-700 font-bold px-5 py-2 rounded-full text-lg">
                Save {product.discountPercentage.toFixed(0)}%
              </span>
            </div>

            <p className="text-gray-700 text-lg leading-8">
              {product.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-3">
              {product.tags.map((tag) => (
                <span
                  key={tag}
                  className="bg-indigo-100 text-indigo-700 px-6 py-3 rounded-full font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>

            {/* Stock & Delivery */}
            <div className="space-y-4 py-6 border-y-2 border-gray-200">
              <div className="flex items-center gap-3 text-lg">
                <FaCheck className="text-green-600 text-2xl" />
                <span className="font-bold text-green-700">
                  {product.stock} units in stock
                </span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <FaTruck className="text-xl" />
                <span className="font-medium">
                  {product.shippingInformation}
                </span>
              </div>
            </div>

            {/* Quantity */}
            <div>
              <label className="block text-xl font-bold mb-4">Quantity</label>
              <div className="inline-flex items-center border-2 border-gray-300 rounded-xl overflow-hidden select-none">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-5 hover:bg-gray-100 transition"
                >
                  <FaMinus className="w-5 h-5" />
                </button>
                <span className="px-12 py-5 text-2xl font-bold border-x-2 border-gray-300">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="p-5 hover:bg-gray-100 transition"
                >
                  <FaPlus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-5">
              <button className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold text-lg py-5 rounded-xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3">
                <FaShoppingCart className="w-6 h-6" />
                Add to Cart
              </button>

              {/* Replaced heart button with share button (icon + label), sized consistently */}
              <button
                onClick={handleShare}
                className="flex items-center gap-3 px-6 py-5 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition text-lg font-semibold"
                aria-label="Share product"
              >
                <FaShareAlt className="w-5 h-5 text-gray-700" />
                <span className="text-gray-800">Share</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-8 py-10 border-t-2 border-gray-200">
              {[
                {
                  icon: FaTruck,
                  title: "Free Shipping",
                  desc: "Orders over $50",
                },
                {
                  icon: FaShieldAlt,
                  title: "Secure Payment",
                  desc: "100% Protected",
                },
                {
                  icon: FaSync,
                  title: "Easy Returns",
                  desc: "30-Day Guarantee",
                },
              ].map((item, i) => (
                <div key={i} className="text-center">
                  <item.icon className="w-14 h-14 mx-auto text-indigo-600 mb-4" />
                  <p className="font-bold text-lg">{item.title}</p>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>

            {/* Reviews Preview */}
            <div className="bg-white rounded-2xl p-8 shadow-xl">
              <h3 className="text-2xl font-bold mb-6">Customer Reviews</h3>
              <div className="space-y-6">
                {product.reviews.map((review, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-200 pb-5 last:border-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <FaStar
                            key={j}
                            className={`w-5 h-5 ${
                              j < review.rating
                                ? "text-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-800">
                        {review.reviewerName}
                      </span>
                    </div>
                    <p className="text-gray-700 italic">"{review.comment}"</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
