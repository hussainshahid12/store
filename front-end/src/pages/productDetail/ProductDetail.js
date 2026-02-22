"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../../lib/features/productSlice/product";

import {
  FaStar,
  FaShoppingCart,
  FaTruck,
  FaShieldAlt,
  FaSync,
  FaShareAlt,
  FaMinus,
  FaPlus,
  FaCheck,
  FaBoxOpen,
  FaRulerCombined,
} from "react-icons/fa";

export default function ProductDetail({ slug }) {
  const dispatch = useDispatch();
  const product = useSelector((state) => state.product.items?.result);

  const [mainImage, setMainImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isHover, setIsHover] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 });
  const [shareMessage, setShareMessage] = useState(null);

  useEffect(() => {
    if (slug?.id) dispatch(fetchProductDetail(slug.id));
  }, [dispatch, slug]);

  useEffect(() => {
    if (product?.thumbnail) setMainImage(product.thumbnail);
  }, [product]);

  const handleShare = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";

    const shareData = {
      title: product.title,
      text: product.description,
      url,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage("Link shared successfully ✅");
      } else {
        await navigator.clipboard.writeText(url);
        setShareMessage("Link copied to clipboard ✅");
      }
    } catch (err) {
      setShareMessage("Unable to share. Try copying the link.");
    } finally {
      setTimeout(() => setShareMessage(null), 3000);
    }
  };

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();

    setZoomPos({
      x: ((e.clientX - left) / width) * 100,
      y: ((e.clientY - top) / height) * 100,
    });
  };

  if (!product) return null;

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* LEFT IMAGE */}
        <div className="space-y-6">
          <div
            className="relative bg-white rounded-2xl shadow-xl overflow-hidden cursor-crosshair"
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            onMouseMove={handleMouseMove}
          >
            <img
              src={mainImage}
              alt={product.title}
              className="w-full h-[450px] object-contain"
            />

            <span className="absolute top-4 left-4 bg-green-600 text-white px-4 py-2 rounded-full font-bold">
              In Stock
            </span>
          </div>

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-4">
            {product.images?.map((img, i) => (
              <button
                key={i}
                onClick={() => setMainImage(img)}
                className={`cursor-pointer rounded-xl overflow-hidden border-2 ${
                  mainImage === img
                    ? "border-[color:var(--color-primary)]"
                    : "border-gray-300 hover:border-gray-400"
                }`}
              >
                <img src={img} className="w-full h-24 object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="space-y-8">
          {/*  CONDITIONAL AREA */}
          {!isHover ? (
            <>
              {/* NORMAL PRODUCT INFO */}
              <h1 className="text-4xl font-extrabold">{product.title}</h1>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={
                      i < Math.round(product.rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                ))}
                <span className="font-bold">{product.rating}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <span className="text-4xl font-extrabold">
                  ${product.price}
                </span>

                <span className="text-gray-400 line-through text-xl">
                  $
                  {(
                    product.price +
                    (product.price * product.discountPercentage) / 100
                  ).toFixed(2)}
                </span>

                {product.discountPercentage > 0 && (
                  <span className="bg-red-100 text-red-600 font-bold px-4 py-2 rounded-full">
                    {product.discountPercentage.toFixed(0)}% OFF
                  </span>
                )}
              </div>

              <p className="text-gray-700 leading-7">{product.description}</p>

              <div className="space-y-3 border-y py-5">
                <div className="flex gap-3">
                  <FaCheck className="text-green-600" />
                  <span>{product.stock} items available</span>
                </div>
                <div className="flex gap-3">
                  <FaTruck />
                  <span>{product.shippingInformation}</span>
                </div>
                <div className="flex gap-3">
                  <FaBoxOpen />
                  <span>Weight: {product.weight} kg</span>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow p-6 space-y-3">
                <div className="flex gap-3">
                  <FaRulerCombined className="text-[color:var(--color-primary)]" />
                  <span>
                    {product.dimensions?.width} × {product.dimensions?.height} ×{" "}
                    {product.dimensions?.depth} cm
                  </span>
                </div>
                <div className="flex gap-3">
                  <FaShieldAlt className="text-[color:var(--color-primary)]" />
                  <span>{product.warrantyInformation}</span>
                </div>
                <div className="flex gap-3">
                  <FaSync className="text-[color:var(--color-primary)]" />
                  <span>{product.returnPolicy}</span>
                </div>
              </div>
            </>
          ) : (
            /* 🔍 ZOOM VIEW (REPLACES INFO) */
            <div className="bg-white rounded-2xl shadow-xl h-[520px] overflow-hidden">
              <div
                className="w-full h-full bg-no-repeat"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundSize: "220%",
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                }}
              />
            </div>
          )}

          {/*  CART AREA (ALWAYS VISIBLE) */}
          <div className="space-y-6 pt-4 border-t">
            <label className="font-bold block">Quantity</label>
            <div className="inline-flex border rounded-xl overflow-hidden">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-5 py-3"
              >
                <FaMinus />
              </button>
              <span className="px-8 py-3 font-bold">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-5 py-3"
              >
                <FaPlus />
              </button>
            </div>

            <div className="flex gap-4">
              <button className="cursor-pointer flex-1 bg-[color:var(--color-primary)] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3">
                <FaShoppingCart />
                Add to Cart
              </button>

              <button
                className="cursor-pointer border px-6 rounded-xl flex items-center gap-3"
                onClick={handleShare}
              >
                <FaShareAlt />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


