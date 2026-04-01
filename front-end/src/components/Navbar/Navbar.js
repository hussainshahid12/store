"use client";

import { useState, useEffect, useRef, memo } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiUser,
  FiSearch,
  FiChevronDown,
  FiX,
  FiShoppingBag,
  FiLoader,
  FiEye,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLogout } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import EmptyCartView from "../emptyCard/EmptyCartView";
import CartItem from "../cartItems/CartItem";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";
import { fetchSearchProduct } from "../../../lib/features/productSlice/product";
import decode from "../../../utils/tokenDecoded/decoded";
import { useAuth } from "@/context/AuthContext";



// --- SUB-COMPONENT: CART DRAWER ---
const CartDrawer = memo(({ isOpen, onClose }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const reduxItems = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );
  const reduxCartData = useSelector((state) => state.cartSlice?.items?.cart);
  const finalPrice = reduxCartData?.finalPrice;

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[100] transition-opacity duration-300 ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[101] shadow-2xl transform transition-transform duration-500 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold text-slate-800">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            {reduxItems.length > 0 ? (
              <CartItem
                items={reduxItems}
                updatingId={updatingId}
                setUpdatingId={setUpdatingId}
                removingId={removingId}
                setRemovingId={setRemovingId}
              />
            ) : (
              <EmptyCartView />
            )}
          </div>
          {reduxItems.length !== 0 && (
            <div className="p-6 border-t border-gray-100 bg-gray-50/50 space-y-3">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-sm">Subtotal</span>
                <span className="text-2xl font-black text-slate-800">
                  ${finalPrice?.toFixed(2) || "0.00"}
                </span>
              </div>
              <Link
                href="/cart"
                onClick={onClose}
                className="w-full bg-white border-2 border-slate-900 text-slate-900 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-50 transition-all"
              >
                <FiEye /> View Full Cart
              </Link>
              <Link
                href="/checkout"
                onClick={onClose}
                className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-black shadow-lg shadow-slate-200 transition-all"
              >
                Proceed to Checkout
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
});
CartDrawer.displayName = "CartDrawer";

export default function Navbar() {
  const { isAuth, setIsAuth } = useAuth();
  console.log("Navbar", isAuth )
  const [mounted, setMounted] = useState(false); // Fix for Hydration Mismatch
  const dispatch = useDispatch();
  const router = useRouter();

  const reduxCartItems = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );
  const searchItems = useSelector((state) => state.product?.searchItems || []);
  const isSearchLoading = useSelector((state) => state.product?.isLoading);

  const [userOpen, setUserOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const userRef = useRef(null);
  const searchRef = useRef(null);
  const prevCartCount = useRef(0);

  // Initialize Client-Side Data
  useEffect(() => {
    setMounted(true);
    dispatch(fetchCartItems());
  }, []);

  // Auto-open drawer when count increases
  useEffect(() => {
    if (mounted && reduxCartItems.length > prevCartCount.current) {
      setCartOpen(true);
    }
    prevCartCount.current = reduxCartItems.length;
  }, [reduxCartItems.length, mounted]);

  // Search Logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      setShowSuggestions(false);
      return;
    }
    const timer = setTimeout(() => {
      dispatch(fetchSearchProduct(searchQuery));
      setShowSuggestions(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery, dispatch]);

  // Click Outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target))
        setUserOpen(false);
      if (searchRef.current && !searchRef.current.contains(e.target))
        setShowSuggestions(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await dispatch(fetchUserLogout());

    localStorage.removeItem("isAuth");
    localStorage.removeItem("token");

    setUserOpen(false);
    setIsAuth(null);

    toast.success("Signed out successfully");

    router.replace("/login");
    // router.refresh(); // 🔥 IMPORTANT
  };

  if (!mounted) return <div className="h-20 bg-white border-b" />; // Placeholder for SSR

  const menuItems = [
    "Home",
    "Best Sellers",
    "Gift Ideas",
    "Today's Deals",
    "New Arrivals",
    "Sell",
    "Customer Service",
  ];
  const subMenuItems = [
    { name: "My orders", path: "my-orders" },
    { name: "Setting", path: "setting" },
  ];

  return (
    <nav className="bg-primary border-b border-gray-100 sticky top-0 z-50 shadow-sm pb-2">
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/my_logo.png"
              alt="Logo"
              width={120}
              height={35}
              className="h-15 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Search */}
          <div
            className="hidden md:block flex-1 max-w-md relative"
            ref={searchRef}
          >
            <SearchInput
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              isSearchLoading={isSearchLoading}
              setShowSuggestions={setShowSuggestions}
            />
            <Suggestions
              showSuggestions={showSuggestions}
              searchQuery={searchQuery}
              isSearchLoading={isSearchLoading}
              searchItems={searchItems}
              router={router}
              setShowSuggestions={setShowSuggestions}
            />
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            {isAuth?.status && (
              <Link
                href="/track-order"
                className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-[11px] md:text-sm font-bold text-primary">
                  Track Order
                </span>
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-50 rounded-full transition"
              suppressHydrationWarning
            >
              <FiShoppingBag className="h-6 w-6 text-slate-700" />
              {reduxCartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {reduxCartItems.length}
                </span>
              )}
            </button>

            <div className="relative" ref={userRef}>
              {isAuth?.status ? (
                <>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1 p-1 pr-2 border rounded-full hover:shadow-md transition"
                    suppressHydrationWarning
                  >
                    <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <FiUser size={16} />
                    </div>
                    <FiChevronDown
                      className={`text-gray-400 size-4 transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border py-2 z-[120]">
                      <div className="w-full px-4 py-2 border-b mb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">
                          Account
                        </p>
                        <p className="text-sm font-bold truncate">
                          {isAuth?.fullName}
                        </p>
                      </div>
                      {subMenuItems.map((item) => (
                        <Link
                          key={item.name}
                          href={`/${item.path}`}
                          className="w-full block px-4 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-primary transition-colors text-left"
                        >
                          {item.name}
                        </Link>
                      ))}
                      <button
                        onClick={handleSignOut}
                        className="w-full px-4 py-2.5 text-sm text-red-500 border-t mt-2 hover:bg-red-50 font-medium text-left"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="px-4 py-2 bg-primary text-white text-xs md:text-sm font-bold rounded-full shadow-md"
                  onClick={() => router.push("/login")}
                  suppressHydrationWarning
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4 relative" ref={searchRef}>
          <SearchInput
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            isSearchLoading={isSearchLoading}
            setShowSuggestions={setShowSuggestions}
          />
          <Suggestions
            showSuggestions={showSuggestions}
            searchQuery={searchQuery}
            isSearchLoading={isSearchLoading}
            searchItems={searchItems}
            router={router}
            setShowSuggestions={setShowSuggestions}
          />
        </div>

        <div className="border-t border-gray-50 bg-white">
          <ul className="flex items-center md:justify-center overflow-x-auto no-scrollbar whitespace-nowrap py-3 px-4 gap-6 md:gap-8">
            {menuItems.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-[11px] md:text-[13px] font-bold text-slate-500 hover:text-primary uppercase tracking-wide transition-colors"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Toaster position="top-center" />
    </nav>
  );
}

function SearchInput({
  searchQuery,
  setSearchQuery,
  isSearchLoading,
  setShowSuggestions,
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center">
        {isSearchLoading ? (
          <FiLoader className="animate-spin text-primary" size={18} />
        ) : (
          <FiSearch className="text-gray-400" size={18} />
        )}
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
        placeholder="Search products..."
        className="w-full bg-gray-100 rounded-full border-none pl-11 pr-12 py-2.5 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
        suppressHydrationWarning
      />
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {!isSearchLoading && searchQuery && (
          <FiX
            className="text-gray-400 cursor-pointer hover:text-red-500"
            onClick={() => setSearchQuery("")}
          />
        )}
      </div>
    </div>
  );
}

function Suggestions({
  showSuggestions,
  searchQuery,
  isSearchLoading,
  searchItems,
  router,
  setShowSuggestions,
}) {
  if (!showSuggestions || !searchQuery) return null;
  return (
    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-[150] overflow-hidden">
      {isSearchLoading ? (
        <div className="p-10 text-center text-gray-400">
          <FiLoader
            className="animate-spin mx-auto mb-3 text-primary"
            size={24}
          />
          <p className="text-xs font-medium animate-pulse">Searching...</p>
        </div>
      ) : searchItems.length > 0 ? (
        <div className="py-2 max-h-[60vh] overflow-y-auto">
          {searchItems.map((product) => (
            <button
              key={product._id}
              onClick={() => {
                router.push(`/product/${product._id}`);
                setShowSuggestions(false);
              }}
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-orange-50 text-left group transition-colors"
            >
              <div className="h-12 w-12 flex-shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-50">
                <img
                  src={product.thumbnail || "/placeholder.jpg"}
                  alt={product.title}
                  className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate group-hover:text-primary transition-colors">
                  {product.title}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  {product.brand && (
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                      {product.brand}
                    </span>
                  )}
                  <span className="text-[10px] text-gray-400 uppercase font-medium tracking-tight">
                    {product.category}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-gray-500">
          No results found for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
