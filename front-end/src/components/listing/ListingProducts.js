"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Pagination from "../pagination/Pagination";
import {
  fetchGetProducts,
  fetchProductCount,
  fetchFilterCategory,
} from "../../../lib/features/productSlice/product";
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";
import toast, { Toaster } from "react-hot-toast";

let DB_categoty = [];

const ProductCard = ({ product }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <div className="relative w-full h-25 md:h-35 overflow-hidden">
      <Image
        src={product.thumbnail}
        alt={product.title}
        fill
        className="object-contain transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-4 flex flex-col h-[200px] justify-between">
      <div>
        <h2 className="text-gray-900 dark:text-white font-semibold text-md md:text-lg mb-1 truncate">
          {product.title}
        </h2>
        <div className="flex items-center mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <FaStar
              key={i}
              className={`mr-1 ${
                i < Math.round(product.rating)
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
          <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
            ({product.rating?.toFixed?.(1) ?? product.rating})
          </span>
        </div>

        <div className="flex items-baseline gap-3">
          <p className="text-gray-900 dark:text-white font-bold text-lg md:text-xl">
            ${product.price}
          </p>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400">{product.id}</p>
      </div>
      <button className="mt-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg font-semibold transition shadow-sm">
        Add to Cart
      </button>
    </div>
  </div>
);

export default function ProductListing() {
  const dispatch = useDispatch();

  const stateProducts = useSelector((state) => state.product.items?.query);

  const categoryState = useSelector(
    (state) => state.product.category?.response
  );
  const error = useSelector((state) => state.product.error);
  const isLoading = useSelector((state) => state.product.isLoading);
  const totalPages = useSelector((state) => state.product.totalProducts?.pages);

  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile (screen width < 1024px → Tailwind 'lg' breakpoint)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load products from URL params
  const loadProductsFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    const page = Number(params.get("page") || 1);
    const sort = params.get("sort");
    const order = params.get("order");
    const category = params.get("category");

    setCurrentPage(page);
    if (category) {
      const categoryfilter = DB_categoty.join(",");
      dispatch(fetchFilterCategory({ page, category: categoryfilter }));
      dispatch(fetchProductCount({ count: "true", category: categoryfilter }));
      return;
    }

    if (sort && order) {
      dispatch(fetchGetProducts({ currentPage: page, order }));
    } else {
      dispatch(fetchGetProducts({ currentPage: page }));
      if (!category) dispatch(fetchProductCount({}));
    }
  };

  // Accumulate products ONLY on mobile
  useEffect(() => {
    if (!stateProducts || stateProducts.length === 0) return;

    if (isMobile) {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p._id));
        const newUnique = stateProducts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newUnique];
      });
    } else {
      setAccumulatedProducts([]); // Desktop: no accumulation
    }
  }, [stateProducts, isMobile]);

  // Handle page change (from Pagination → Load More or Prev/Next)
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);

    const url = new URL(window.location);
    url.searchParams.set("page", newPage);
    window.history.pushState({}, "", url.toString());

    loadProductsFromUrl();

    // Scroll only on desktop/tablet (NOT on mobile)
    if (!isMobile) {
      window.scrollTo({ top: 600, behavior: "smooth" });
    }
    // On mobile: no auto scroll → user stays where they are (natural for Load More)
  };

  // Sort → reset page + accumulation
  const sortProducts = (order) => {
    const url = new URL(window.location);
    if (order) {
      url.searchParams.set("sort", "price");
      url.searchParams.set("order", order);
    } else {
      url.searchParams.delete("sort");
      url.searchParams.delete("order");
    }
    url.searchParams.set("page", currentPage);
    window.history.pushState({}, "", url.toString());

    setCurrentPage(1);
    setAccumulatedProducts([]);
    loadProductsFromUrl();
  };

  // Category filter change → reset
  const handleCategoryChange = (e) => {
    const value = e.target.value;
    const checked = e.target.checked;

    if (checked) {
      if (!DB_categoty.includes(value)) {
        DB_categoty.push(value);
      }
    } else {
      DB_categoty = DB_categoty.filter((item) => item !== value);
    }

    // ✅ Create EMPTY params
    const params = new URLSearchParams(window.location.search);

    if (DB_categoty.length > 0) {
      params.set("category", DB_categoty.join(","));
    } else {
      params.delete("category"); // ✅ now works
    }

    const url = `?${params.toString()}`;
    window.history.pushState({}, "", url);
    loadProductsFromUrl();
  };

  // Initial load + back/forward navigation
  useEffect(() => {
    loadProductsFromUrl();
    window.addEventListener("popstate", loadProductsFromUrl);
    return () => window.removeEventListener("popstate", loadProductsFromUrl);
  }, [dispatch]);

  // Fetch total count
  // useEffect(() => {
  //   dispatch(fetchProductCount({}));
  // }, []);

  // Error toast
  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  // Products to display
  const displayProducts = isMobile ? accumulatedProducts : stateProducts;

  // Skeleton loader (12 items)
  const SkeletonGrid = () =>
    Array.from({ length: 30 }, (_, i) => (
      <div key={i} className="col-span-1">
        <SkeletonLoader />
      </div>
    ));

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-5 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Products
      </h1>

      <div className="flex flex-col gap-8 ">
        {/* Filters & Sort */}
        <div className="grid grid-cols-12 gap-6 hidden md:grid">
          <div className="col-span-12 lg:col-span-9 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">
              Categories
            </h2>
            <ul className="flex flex-wrap gap-4">
              {categoryState?.map((cat) => (
                <li key={cat._id}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600 rounded"
                      value={cat._id}
                      onChange={handleCategoryChange}
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {cat._id.charAt(0).toUpperCase() + cat._id.slice(1)}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-12 lg:col-span-3 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">
              Sort by Price
            </h2>
            <select
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
              onChange={(e) => sortProducts(e.target.value || null)}
              value={
                new URLSearchParams(window.location.search).get("order") || ""
              }
            >
              <option value="">No Sort</option>
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <main className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5  xl:grid-cols-6 gap-4">
          {/* Show skeleton on ALL devices while loading */}
          {isLoading && <SkeletonGrid />}

          {/* Show products when not loading */}
          {!isLoading && displayProducts?.length > 0 ? (
            displayProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))
          ) : !isLoading && displayProducts?.length === 0 ? (
            <p className="col-span-full text-center text-gray-600 dark:text-gray-400 py-10">
              No products found.
            </p>
          ) : null}

          {/* Optional: small spinner at bottom when loading more (mobile) */}
          {isLoading && currentPage > 1 && isMobile && (
            <div className="col-span-full flex justify-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-b-4 border-blue-600"></div>
            </div>
          )}
        </main>
      </div>

      {/* Pagination / Load More */}
      {!isLoading && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      )}

      <Toaster position="top-center" />
    </div>
  );
}
