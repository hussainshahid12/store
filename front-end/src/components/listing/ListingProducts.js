"use client";
import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { FiShoppingBag, FiFilter, FiX, FiRefreshCw } from "react-icons/fi"; // Added Refresh icon
import Pagination from "../pagination/Pagination";
import {
  fetchGetProducts,
  fetchProductCount,
  fetchFilterCategory,
} from "../../../lib/features/productSlice/product";
import { useDispatch, useSelector } from "react-redux";
import SkeletonLoader from "../skeletonLoader/SkeletonLoader";
import ProductCard from "../productCard/ProductCard";
import QuickViewModal from "../itemModal/QuickViewModal";

ProductCard.displayName = "ProductCard";

export default function ProductListing() {
  const dispatch = useDispatch();
  const dbCategoryRef = useRef([]);
  const lastCategoryRef = useRef(null);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState([]);
  const [isMobile, setIsMobile] = useState(false);

  const stateProducts = useSelector((state) => state.product.items?.result);
  const categoryState = useSelector((state) => state.product.category?.response);
  const isLoading = useSelector((state) => state.product.isLoading);
  const totalPages = useSelector((state) => state.product.totalProducts?.pages);

  const displayProducts = useMemo(() => {
    const data = isMobile ? accumulatedProducts : stateProducts;
    return Array.isArray(data) ? data : [];
  }, [isMobile, accumulatedProducts, stateProducts]);

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
        // Reset list if we are on page 1 (useful for filter/sort changes)
        if (currentPage === 1) return stateProducts;
        
        const existingIds = new Set(prev.map((p) => p._id));
        const newUnique = stateProducts.filter((p) => !existingIds.has(p._id));
        return [...prev, ...newUnique];
      });
    } else {
      setAccumulatedProducts([]);
    }
  }, [stateProducts, isMobile, currentPage]);

  const handlePageChange = useCallback(
    (newPage) => {
      setCurrentPage(newPage);
      const url = new URL(window.location);
      url.searchParams.set("page", newPage);
      window.history.pushState({}, "", url.toString());
      loadProductsFromUrl();
      if (window.innerWidth >= 1024)
        window.scrollTo({ top: 1000, behavior: "smooth" });
    },
    [loadProductsFromUrl]
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
      dbCategoryRef.current = dbCategoryRef.current.filter((item) => item !== value);
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
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const categoryParam = params.get("category");
      dbCategoryRef.current = categoryParam ? categoryParam.split(",") : [];
    }
    loadProductsFromUrl();
    window.addEventListener("popstate", loadProductsFromUrl);
    return () => window.removeEventListener("popstate", loadProductsFromUrl);
  }, [loadProductsFromUrl]);

  return (
    <div className="min-h-screen bg-[#fcfcfc] dark:bg-slate-950 pb-20">
      <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />

      {/* Mobile Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/40 z-40 lg:hidden transition-opacity duration-300 ${isFilterOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={() => setIsFilterOpen(false)}
      />

      <div className="max-w-[1600px] mx-auto px-4 lg:px-8 pt-10">
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
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all border shadow-sm ${
                isFilterOpen 
                ? "bg-primary text-white border-primary" 
                : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-800"
              }`}
            >
              <FiFilter />
              {isFilterOpen ? "Hide Filters" : "Show Filters"}
            </button>

            <select
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-4 py-2.5 rounded-xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer shadow-sm"
              onChange={(e) => sortProducts(e.target.value || null)}
              value={new URLSearchParams(typeof window !== "undefined" ? window.location.search : "").get("order") || ""}
            >
              <option value="">Sort: Default</option>
              <option value="asc">Price: Low to High</option>
              <option value="desc">Price: High to Low</option>
            </select>
          </div>
        </header>

        <div className="flex gap-8 transition-all duration-500">
          {/* SIDEBAR FILTER */}
          <aside 
            className={`
              fixed lg:sticky top-0 lg:top-24 left-0 h-full lg:h-fit z-50 lg:z-0
              w-[280px] bg-white dark:bg-slate-900 lg:bg-transparent
              p-6 lg:p-0 border-r lg:border-none border-slate-100 dark:border-slate-800
              transition-all duration-300 ease-in-out
              ${isFilterOpen 
                ? "translate-x-0 opacity-100 block shrink-0" 
                : "-translate-x-full lg:translate-x-0 lg:hidden lg:w-0 overflow-hidden opacity-0"}
            `}
          >
            <div className="lg:bg-white lg:dark:bg-slate-900 lg:border lg:border-slate-100 lg:dark:border-slate-800 lg:p-6 lg:rounded-[2rem] lg:shadow-sm ">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <FiFilter className="text-primary" />
                  <h2 className="font-black text-lg uppercase tracking-tight">Filters</h2>
                </div>
                <button onClick={() => setIsFilterOpen(false)} className="lg:hidden p-2"><FiX /></button>
              </div>

              <h3 className="font-bold text-slate-400 text-[10px] uppercase tracking-widest mb-4">Categories</h3>
              <ul className="space-y-3">
                {Array.isArray(categoryState) && categoryState.map((cat) => (
                  <li key={cat._id}>
                    <label className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        className="hidden"
                        value={cat._id}
                        checked={dbCategoryRef.current.includes(cat._id)}
                        onChange={handleCategoryChange}
                      />
                      <div className="w-5 h-5 border-2 border-slate-200 dark:border-slate-700 rounded-md mr-3 flex items-center justify-center transition-all group-hover:border-primary">
                        <div className={`w-2 h-2 bg-primary rounded-full transition-opacity ${dbCategoryRef.current.includes(cat._id) ? "opacity-100" : "opacity-0"}`} />
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

          {/* MAIN PRODUCT GRID */}
          <main className="flex-1 transition-all duration-500">
            <div className={`
              grid gap-6 transition-all duration-500
              grid-cols-2 md:grid-cols-3 
              ${isFilterOpen 
                ? "xl:grid-cols-4" 
                : "xl:grid-cols-6" 
              }
            `}>
              {isLoading && displayProducts.length === 0
                ? Array.from({ length: 12 }).map((_, i) => <SkeletonLoader key={i} />)
                : displayProducts.map((product) => (
                    <ProductCard
                      key={product?._id}
                      product={product}
                      onOpenPopup={(p) => setSelectedProduct(p)}
                    />
                  ))}
            </div>

            {!isLoading && displayProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-100 dark:border-slate-800 mt-10">
                <p className="text-slate-400 font-bold uppercase tracking-widest">No results found</p>
              </div>
            )}
            
            {/* RESPONSIVE PAGINATION LOGIC */}
            <div className="mt-12">
              {isMobile ? (
                // --- LOAD MORE BUTTON FOR MOBILE ---
                currentPage < totalPages && (
                  <div className="flex justify-center mt-8">
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={isLoading}
                      className="flex items-center gap-2 px-10 py-4 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 active:scale-95 transition-all disabled:opacity-70"
                    >
                      {isLoading && <FiRefreshCw className="animate-spin" />}
                      {isLoading ? "Loading..." : "Load More"}
                    </button>
                  </div>
                )
              ) : (
                // --- NUMERIC PAGINATION FOR DESKTOP ---
                !isLoading && totalPages > 1 && (
                  <Pagination 
                    currentPage={currentPage} 
                    totalPages={totalPages} 
                    onPageChange={handlePageChange} 
                  />
                )
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}