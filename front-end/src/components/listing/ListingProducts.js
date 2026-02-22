"use client";
import Image from "next/image";
import { useEffect, useState, useCallback, useMemo, useRef, memo } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import {
  FiPlus,
  FiShoppingBag,
  FiFilter,
  FiShoppingCart,
} from "react-icons/fi";
import Pagination from "../pagination/Pagination";
import {
  fetchGetProducts,
  fetchProductCount,
  fetchFilterCategory,
} from "../../../lib/features/productSlice/product";
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";
import toast, { Toaster } from "react-hot-toast";
import Link from "next/link";
import decode from "../../../utils/markedEmail/tokenDecoded/decoded";
import { fetchAddItem } from "../../../lib/features/cartSlice/cart";
import Loader from "@/components/loader/Loader";

const PLACEHOLDER_IMAGE = "https://via.placeholder.com/300x300?text=No+Image";

// --- NEW POPUP COMPONENT ---
const QuickViewModal = ({ product, onClose, onConfirm }) => {
  if (!product) return null;

  const imageSrc =
    product?.thumbnail &&
    typeof product.thumbnail === "string" &&
    product.thumbnail.trim() !== ""
      ? product.thumbnail
      : PLACEHOLDER_IMAGE;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-10 p-2 bg-slate-100 dark:bg-slate-800 rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
        >
          <FaTimes size={18} />
        </button>

        <div className="p-8">
          <div className="relative w-full h-64 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-6">
            <Image
              src={imageSrc}
              alt={product.title}
              fill
              className="object-contain p-6"
            />
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                {product.title}
              </h3>
              <p className="text-slate-500 text-sm mt-2 line-clamp-3 italic">
                {product.description || "No description available."}
              </p>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-sm font-bold text-slate-400 block">
                  Price
                </span>
                <span className="text-3xl font-black text-primary">
                  ${product.price}
                </span>
              </div>

              <button
                onClick={() => {
                  onConfirm(product);
                  onClose();
                }}
                className="flex items-center gap-2 bg-slate-900 dark:bg-primary text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform active:scale-95 shadow-lg"
              >
                <FiShoppingCart />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MEMOIZED PRODUCT CARD ---
const ProductCard = memo(({ product, onOpenPopup }) => {
  const imageSrc =
    product.thumbnail &&
    typeof product.thumbnail === "string" &&
    product.thumbnail.trim() !== ""
      ? product.thumbnail
      : PLACEHOLDER_IMAGE;

  const productUrl = `/product/${product._id}/${
    product.description
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "") || "view-product"
  }`;

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-100 dark:border-slate-800 p-2 md:p-3 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)] dark:hover:shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:-translate-y-1.5">
      <div className="relative w-full h-36 md:h-48 bg-slate-50 dark:bg-slate-800/40 rounded-[1.6rem] overflow-hidden">
        <Link href={productUrl} className="block w-full h-full">
          <Image
            src={imageSrc}
            alt={product.title || "Product Image"}
            fill
            sizes="(max-width: 768px) 50vw, 20vw"
            className="object-contain p-4 md:p-6 transition-transform duration-700 group-hover:scale-110"
            priority={false}
          />
        </Link>

        {product.discountPercentage > 0 && (
          <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-white/90 backdrop-blur-md px-2 py-0.5 md:py-1 rounded-lg shadow-sm border border-slate-100">
            <p className="text-[9px] md:text-[10px] font-black text-orange-600">
              -{Math.round(product.discountPercentage)}%
            </p>
          </div>
        )}
      </div>

      <div className="px-2 md:px-3 pt-4 pb-1 flex flex-col justify-between min-h-[130px] md:min-h-[150px]">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1 truncate">
            Collection 2024
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

        <div className="flex items-center justify-between mt-auto">
          <div className="flex flex-col">
            <p className="text-base md:text-xl font-black text-slate-900 dark:text-white leading-none">
              ${product.price}
            </p>
          </div>

          <button
            onClick={() => onOpenPopup(product)}
            className="h-9 w-9 md:h-11 md:w-11 bg-slate-900 dark:bg-primary hover:bg-primary dark:hover:bg-orange-600 text-white rounded-xl md:rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg active:scale-90"
            aria-label="Quick View"
          >
            <FiPlus size={18} strokeWidth={3} className="md:w-5 md:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
});

ProductCard.displayName = "ProductCard";

// --- MAIN LISTING PAGE ---
export default function ProductListing() {
  const dispatch = useDispatch();
  const dbCategoryRef = useRef([]);
  const lastCategoryRef = useRef(null);

  // NEW STATE FOR POPUP
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Redux Selectors
  const stateProducts = useSelector((state) => state.product.items?.result);
  // const stateCart = useSelector((state) => state.cartSlice.items);
  const categoryState = useSelector(
    (state) => state.product.category?.response,
  );
  // const error = useSelector((state) => state.product.error);
  // const cartError = useSelector((state) => state.cartSlice.error);
  const isLoading = useSelector((state) => state.product.isLoading);
  const loading = useSelector((state) => state.cartSlice.isLoading);
  const totalPages = useSelector((state) => state.product.totalProducts?.pages);

  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Safeguard displayProducts array
  const displayProducts = useMemo(() => {
    const data = isMobile ? accumulatedProducts : stateProducts;
    return Array.isArray(data) ? data : [];
  }, [isMobile, accumulatedProducts, stateProducts]);

  const cartHandler = useCallback(
    (item) => {
      const token = decode();
      const { _id, title, price, thumbnail, discountPercentage } = item;
      const validImage =
        thumbnail && thumbnail.trim() !== "" ? thumbnail : PLACEHOLDER_IMAGE;

      if (token?.id) {
        dispatch(
          fetchAddItem({
            userId: token.id,
            productId: _id,
            price,
            title,
            discountPercent: discountPercentage,
            image: validImage,
          })
        );
      } else {
        toast.error("Please login to add items to cart");
      }
    },
    [dispatch],
  );

  const loadProductsFromUrl = useCallback(async () => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    let page = Number(params.get("page")) || 1;
    const sort = params.get("sort");
    const order = params.get("order");
    const category = params.get("category");

    setCurrentPage(page);

    if (category) {
      if (lastCategoryRef.current !== category) {
        lastCategoryRef.current = category;
        await dispatch(fetchProductCount({ count: "true", category }));
      }
      dispatch(fetchFilterCategory({ page, category, sort, order }));
      return;
    }

    dispatch(fetchGetProducts({ currentPage: page, sort, order }));
    if (lastCategoryRef.current !== "ALL") {
      lastCategoryRef.current = "ALL";
      dispatch(fetchProductCount({}));
    }
  }, [dispatch]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!Array.isArray(stateProducts) || stateProducts.length === 0) return;
    if (isMobile) {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newUnique = stateProducts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newUnique];
      });
    } else {
      setAccumulatedProducts([]);
    }
  }, [stateProducts, isMobile]);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      const url = new URL(window.location);
      url.searchParams.set("page", newPage);
      window.history.pushState({}, "", url.toString());
      loadProductsFromUrl();
      if (window.innerWidth >= 1024)
        window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [loadProductsFromUrl],
  );

  const sortProducts = (order) => {
    const url = new URL(window.location);
    if (order) {
      url.searchParams.set("sort", "price");
      url.searchParams.set("order", order);
    } else {
      url.searchParams.delete("sort");
      url.searchParams.delete("order");
    }
    url.searchParams.set("page", 1);
    window.history.pushState({}, "", url.toString());
    setCurrentPage(1);
    setAccumulatedProducts([]);
    loadProductsFromUrl();
  };

  const handleCategoryChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      dbCategoryRef.current.push(value);
    } else {
      dbCategoryRef.current = dbCategoryRef.current.filter(
        (item) => item !== value,
      );
    }

    const params = new URLSearchParams(window.location.search);
    if (dbCategoryRef.current.length > 0) {
      params.set("category", dbCategoryRef.current.join(","));
    } else {
      params.delete("category");
    }
    params.set("page", 1);
    window.history.pushState({}, "", `?${params.toString()}`);
    setAccumulatedProducts([]);
    loadProductsFromUrl();
  };

  useEffect(() => {
    loadProductsFromUrl();
    window.addEventListener("popstate", loadProductsFromUrl);
    return () => window.removeEventListener("popstate", loadProductsFromUrl);
  }, [loadProductsFromUrl]);

  // useEffect(() => {
  //   if (error || cartError) toast.error(error || cartError);
  //   if (stateCart?.success && stateCart.message) {
  //     toast.success(stateCart.message);
  //     // Optionally: dispatch an action to clear cart success/message here
  //   }
  // }, [error, stateCart, cartError]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-slate-950 pb-20">
      <Toaster position="top-center" />
      {loading && <Loader />}

      {/* RENDER THE POPUP */}
      <QuickViewModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onConfirm={cartHandler}
      />

      <div className="max-w-screen-xl mx-auto px-4 lg:px-6 pt-10">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-[0.2em] mb-2">
              <FiShoppingBag />
              <span>Premium Marketplace</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Products<span className="text-primary">.</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <select
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
              onChange={(e) => sortProducts(e.target.value || null)}
              value={
                new URLSearchParams(
                  typeof window !== "undefined" ? window.location.search : "",
                ).get("order") || ""
              }
            >
              <option value="">Sort: Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </header>

        <div className="grid grid-cols-12 gap-8">
          <aside className="hidden lg:block col-span-3">
            <div className="sticky top-24 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-[2rem] shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <FiFilter className="text-primary" />
                <h2 className="font-black text-lg uppercase tracking-tight">
                  Filters
                </h2>
              </div>

              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4">
                Categories
              </h3>
              <ul className="space-y-3">
                {Array.isArray(categoryState) &&
                  categoryState.map((cat) => (
                    <li key={cat._id}>
                      <label className="flex items-center group cursor-pointer">
                        <input
                          type="checkbox"
                          className="hidden"
                          value={cat._id}
                          onChange={handleCategoryChange}
                        />
                        <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-700 rounded-md mr-3 flex items-center justify-center transition-all group-hover:border-primary">
                          <div
                            className={`w-2 h-2 bg-primary rounded-full transition-opacity ${dbCategoryRef.current.includes(cat._id) ? "opacity-100" : "opacity-0"}`}
                          />
                        </div>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                          {cat._id}
                        </span>
                      </label>
                    </li>
                  ))}
              </ul>
            </div>
          </aside>

          <main className="col-span-12 lg:col-span-9">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {isLoading && displayProducts.length === 0
                ? Array.from({ length: 8 }).map((_, i) => (
                    <SkeletonLoader key={i} />
                  ))
                : displayProducts.map((product) => (
                    <ProductCard
                      key={product?._id}
                      product={product}
                      onOpenPopup={(p) => setSelectedProduct(p)} // Open popup logic
                    />
                  ))}
            </div>

            {!isLoading && displayProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800">
                <p className="text-slate-400 font-bold uppercase tracking-widest">
                  No results matched your criteria
                </p>
              </div>
            )}

            {/* MOBILE: Load More */}
            {isMobile && currentPage < totalPages && (
              <div className="mt-10 flex justify-center">
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={isLoading}
                  className="px-8 py-4 bg-slate-900 dark:bg-primary text-white font-bold rounded-2xl shadow-xl active:scale-95 transition-all disabled:opacity-50"
                >
                  {isLoading ? "Loading..." : "Load More Products"}
                </button>
              </div>
            )}

            {!isMobile && !isLoading && totalPages > 1 && (
              <div className="mt-12">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
