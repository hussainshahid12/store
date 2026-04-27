"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchProductDetail } from "../../../lib/features/productSlice/product";
import {
  FaStar,
  FaShareAlt,
  FaMinus,
  FaPlus,
  FaShieldAlt,
  FaTruck,
  FaChevronLeft,
  FaWeightHanging,
  FaWhatsapp,
  FaFacebook,
  FaCopy,
  FaTimes,
  FaShoppingBag,
  FaRulerCombined,
} from "react-icons/fa";

import decode from "../../../utils/tokenDecoded/decoded";
import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import { motion, AnimatePresence } from "framer-motion";
import toast, { Toaster } from "react-hot-toast";
import LOGINMODAL from "@/components/login_Modal/LoginModal";
import Loader from "@/components/loader/Loader";

export default function ProductDetail({ slug }) {
  const dispatch = useDispatch();
  const router = useRouter();
  
  // Data Selectors
  const product = useSelector((state) => state.product.items?.result);
  const { isLoading: loading } = useSelector((state) => state.cartSlice);

  // States
  const [mainImage, setMainImage] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [shareMessage, setShareMessage] = useState(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Zoom States
  const [isZooming, setIsZooming] = useState(false);
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  useEffect(() => {
    if (slug?.id) dispatch(fetchProductDetail(slug.id));
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.images?.length > 0) {
      setMainImage(product.images[0]);
    } else if (product?.thumbnail) {
      setMainImage(product.thumbnail);
    }
  }, [product]);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPos({ x, y });
    setIsZooming(true);
  };

  const copyToClipboard = async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShareMessage("Link copied! 📋");
      setShowShareModal(false);
      setTimeout(() => setShareMessage(null), 3000);
    } catch (err) {
      setShareMessage("Failed to copy");
    }
  };

  const cartHandler = async (item) => {
    await dispatch(fetchAddItem({ productId: item._id, quantity: Number(quantity) }));
    toast.success("Item added to cart");
    setQuantity(1);
    window.dispatchEvent(new Event("cart-item-added"));
  };

  const handleBuyNow = async (item) => {
    const token = localStorage.getItem("isAuth");
    const decoded = decode(token);
    if (!decoded?.id) {
      setShowLoginPrompt(true);
      return;
    }
    router.push(`/checkout?mode=buy-now&productId=${item._id}&quantity=${quantity}`);
  };

  if (!product) return <div className="p-20 text-center animate-pulse text-gray-400">Loading Product...</div>;

  const discountedPrice = product.discountPercentage
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  const totalPrice = (discountedPrice * quantity).toFixed(2);

  return (
    <div className="bg-white min-h-screen font-sans text-[#1d1d1f] mt-[150px]">
      {loading && <Loader />}
      <Toaster position="top-center" />

      {showLoginPrompt && <LOGINMODAL setShowLoginPrompt={setShowLoginPrompt} />}

      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 lg:pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 lg:gap-16 items-start">
          
          {/* LEFT: IMAGE SECTION */}
          <div className="lg:col-span-7">
            <div
              ref={containerRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={() => setIsZooming(false)}
              className="relative aspect-square bg-[#fbfbfb] lg:rounded-3xl overflow-hidden border border-gray-100 cursor-crosshair"
            >
              {mainImage && (
                <Image
                  src={mainImage}
                  alt={product?.title}
                  fill
                  unoptimized={true} // FIX: Bypasses production optimization issues
                  className="object-contain p-8 lg:p-16"
                  priority
                />
              )}
              
              {product?.discountPercentage > 0 && (
                <div className="absolute top-6 left-6 bg-red-600 text-white text-[10px] font-black px-3 py-1 rounded-full z-10">
                  -{product.discountPercentage.toFixed(0)}% OFF
                </div>
              )}

              {isZooming && (
                <div
                  className="hidden lg:block absolute border border-zinc-300 bg-white/20 pointer-events-none"
                  style={{
                    width: "35%", height: "35%",
                    left: `${zoomPos.x}%`, top: `${zoomPos.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                />
              )}
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-3 px-4 lg:px-0 mt-4 overflow-x-auto no-scrollbar pb-2">
              {product?.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setMainImage(img)}
                  className={`relative shrink-0 w-20 h-20 rounded-2xl border-2 transition-all overflow-hidden bg-gray-50 ${
                    mainImage === img ? "border-black scale-95" : "border-transparent"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`Thumb ${i}`}
                    fill
                    unoptimized={true} // FIX: Ensure gallery images show in production
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:col-span-5 px-6 pt-8 lg:pt-0 relative lg:sticky lg:top-10 self-start">
            {/* Zoom Preview Layer */}
            {isZooming && mainImage && (
              <div
                className="hidden lg:block absolute inset-0 z-[120] bg-white border border-gray-200 rounded-3xl shadow-2xl overflow-hidden pointer-events-none"
                style={{
                  backgroundImage: `url(${mainImage})`,
                  backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
                  backgroundSize: "280%",
                  backgroundRepeat: "no-repeat",
                }}
              />
            )}

            <div className="flex justify-between items-start mb-2">
              <span className="text-zinc-400 font-bold text-xs uppercase tracking-widest">
                {product?.brand || "Premium Brand"}
              </span>
              <button onClick={() => setShowShareModal(true)} className="hidden lg:block text-gray-400 hover:text-black">
                <FaShareAlt />
              </button>
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold tracking-tight mb-4 leading-tight">{product?.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-zinc-900 text-white px-2 py-1 rounded text-xs font-bold">
                <FaStar className="text-yellow-400" /> {product?.rating}
              </div>
              <span className={`text-sm font-bold uppercase tracking-tighter ${product?.stock > 0 ? "text-green-600" : "text-red-500"}`}>
                {product?.availabilityStatus} ({product?.stock} units)
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-8">
              <span className="text-4xl font-bold text-zinc-900">${discountedPrice}</span>
              {product?.discountPercentage > 0 && (
                <span className="text-xl text-gray-400 line-through font-light">${product.price}</span>
              )}
            </div>

            <p className="text-zinc-500 leading-relaxed text-lg mb-8">{product?.description}</p>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-10 mb-20 lg:mb-10">
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-gray-100 rounded-2xl p-1 border border-gray-200">
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors">
                    <FaMinus size={12} />
                  </button>
                  <span className="px-5 font-bold text-lg">{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="w-12 h-12 flex items-center justify-center hover:bg-white rounded-xl transition-colors">
                    <FaPlus size={12} />
                  </button>
                </div>
                <button
                  className="flex-1 bg-white border-2 border-zinc-200 text-zinc-900 h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] lg:text-xs hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2"
                  onClick={() => cartHandler(product)}
                >
                  <FaShoppingBag /> Add To Bag
                </button>
              </div>
              <button
                onClick={() => handleBuyNow(product)}
                className="w-full bg-primary text-white h-14 rounded-2xl font-bold uppercase tracking-widest text-[11px] lg:text-xs shadow-lg"
              >
                Buy Now — ${totalPrice}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {showShareModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl relative">
              <button onClick={() => setShowShareModal(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-black">
                <FaTimes />
              </button>
              <h3 className="text-xl font-bold mb-6">Share this item</h3>
              <div className="grid grid-cols-3 gap-4">
                <ShareLink icon={<FaWhatsapp />} label="WhatsApp" color="text-green-600" bg="bg-green-50" href={`https://wa.me/?text=${encodeURIComponent(product.title + " " + (typeof window !== "undefined" ? window.location.href : ""))}`} />
                <ShareLink icon={<FaFacebook />} label="Facebook" color="text-blue-600" bg="bg-blue-50" href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== "undefined" ? window.location.href : "")}`} />
                <button onClick={copyToClipboard} className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center text-2xl hover:bg-gray-100 transition-colors"><FaCopy /></div>
                  <span className="text-[10px] font-bold uppercase tracking-tighter">Copy Link</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Sub-components
function DataCard({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-gray-100 shadow-sm">
      <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 shrink-0">{icon}</div>
      <div className="overflow-hidden">
        <p className="text-[9px] uppercase font-black text-zinc-300 tracking-tighter truncate">{label}</p>
        <p className="text-[11px] font-bold text-zinc-800 truncate">{value || "N/A"}</p>
      </div>
    </div>
  );
}

function ShareLink({ icon, label, color, bg, href }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-2 group">
      <div className={`w-14 h-14 ${bg} ${color} rounded-2xl flex items-center justify-center text-2xl group-hover:scale-105 transition-transform`}>{icon}</div>
      <span className="text-[10px] font-bold uppercase tracking-tighter">{label}</span>
    </a>
  );
}