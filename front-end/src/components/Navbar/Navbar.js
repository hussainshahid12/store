"use client";

import { useState, useEffect, useRef, memo, useMemo } from "react";
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
  FiMenu,
  FiHome,
  FiLogOut,
  FiMessageSquare,
  FiTruck,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLogout } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import EmptyCartView from "../emptyCard/EmptyCartView";
import CartItem from "../cartItems/CartItem";
import { fetchCartItems } from "../../../lib/features/cartSlice/cart";
import { fetchSearchProduct } from "../../../lib/features/productSlice/product";
import { useAuth } from "@/context/AuthContext";

// --- SUB-COMPONENT: MOBILE DRAWER ---
const MobileDrawer = ({
  isOpen,
  onClose,
  isAuth,
  handleSignOut,
  menuItems,
}) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 left-0 h-full w-[280px] bg-white z-[201] shadow-2xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="p-5 border-b bg-slate-900 text-white flex justify-between items-center">
            <div>
              <p className="text-xs opacity-70">Welcome,</p>
              <p className="font-bold truncate">
                {isAuth?.fullName || "Guest"}
              </p>
            </div>
            <button onClick={onClose} className="p-2">
              <FiX size={24} />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <p className="px-6 text-[10px] font-bold text-gray-400 uppercase mb-2">
              Menu
            </p>
            {menuItems.map((item) => (
              <Link
                key={item}
                href="#"
                className="block px-6 py-3 text-sm font-bold text-slate-700 hover:bg-orange-50 uppercase"
              >
                {item}
              </Link>
            ))}

            {/* Conditional Links based on Auth */}
            {isAuth?.status && (
              <div className="border-t mt-4 pt-4">
                <Link
                  href="/my-orders"
                  className="block px-6 py-3 text-sm text-slate-700"
                >
                  My Orders
                </Link>
                <Link
                  href="/setting"
                  className="block px-6 py-3 text-sm text-slate-700"
                >
                  Settings
                </Link>
              </div>
            )}
          </div>

          <div className="p-4 border-t">
            {isAuth?.status ? (
              <button
                onClick={handleSignOut}
                className="w-full flex items-center justify-center gap-2 p-3 bg-red-50 text-red-600 rounded-xl font-bold"
              >
                <FiLogOut /> Sign Out
              </button>
            ) : (
              <Link
                href="/login"
                className="w-full flex items-center justify-center p-3 bg-primary text-white rounded-xl font-bold"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

// --- SUB-COMPONENT: CART DRAWER ---
const CartDrawer = memo(({ isOpen, onClose, hasBanner }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const reduxItems = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );
  const reduxCartData = useSelector((state) => state.cartSlice?.items?.cart);
  const finalPrice = reduxCartData?.finalPrice;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[200] transition-opacity ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[201] transform transition-transform duration-500 ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className={`flex flex-col h-full ${hasBanner ? "mt-10" : "mt-0"}`}>
          <div className="p-5 border-b flex justify-between items-center bg-gray-50">
            <h2 className="text-xl font-bold">Shopping Cart</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full"
            >
              <FiX size={24} />
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
          {reduxItems.length > 0 && (
            <div className="p-6 border-t bg-gray-50 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Subtotal</span>
                <span className="text-2xl font-black">
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

export default function Navbar({ hasBanner = false }) {
  const { isAuth, setIsAuth } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchRef = useRef(null);
  const userRef = useRef(null);

  // --- RANDOM IMAGE LOGIC (LOOP) ---
  const randomImages = [
    "https://cdn.dummyjson.com/product-images/mens-watches/brown-leather-belt-watch/thumbnail.webp",
    "https://cdn.dummyjson.com/product-images/smartphones/iphone-5s/thumbnail.webp",
    "https://cdn.dummyjson.com/product-images/home-decoration/house-showpiece-plant/thumbnail.webp",
    "https://cdn.dummyjson.com/product-images/mens-shirts/blue-&-black-check-shirt/thumbnail.webp",
    "https://cdn.dummyjson.com/product-images/womens-shoes/black-&-brown-slipper/thumbnail.webp",
  ];

  const [imgIndex, setImgIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % randomImages.length);
    }, 2000); // Change image every 2 seconds
    return () => clearInterval(interval);
  }, [randomImages.length]);
  const dynamicImg = randomImages[imgIndex];

  const reduxCartItems = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );
  const searchItems = useSelector((state) => state.product?.searchItems || []);
  const isSearchLoading = useSelector((state) => state.product?.isLoading);

  useEffect(() => {
    setMounted(true);
    dispatch(fetchCartItems());
  }, [dispatch]);

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
    localStorage.clear();
    setIsAuth(null);
    setUserOpen(false);
    setDrawerOpen(false);
    toast.success("Signed out successfully");
    router.replace("/login");
  };

  if (!mounted) return <div className="h-20 bg-white border-b" />;

  const menuItems = [
    "Home",
    "Best Sellers",
    "Gift Ideas",
    "Today's Deals",
    "New Arrivals",
    "Sell",
    "Customer Service",
  ];

  return (
    <nav
      className={`bg-white border-b fixed ${hasBanner ? "top-[40px]" : "top-0"} left-0 w-full z-50 shadow-sm pt-[20px]`}
    >
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        hasBanner={hasBanner}
      />
      <MobileDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        isAuth={isAuth}
        handleSignOut={handleSignOut}
        menuItems={menuItems}
      />

      <div className="max-w-screen-xl mx-auto px-4">
        {/* --- TOP NAVBAR --- */}
        <div className="flex items-center justify-between h-16 md:h-20 gap-4">
          <button onClick={() => setDrawerOpen(true)} className="md:hidden p-2">
            <FiMenu size={26} className="text-slate-700" />
          </button>

          <Link href="/" className="flex-shrink-0">
            <Image
              src="/my_logo.png"
              alt="Logo"
              width={120}
              height={35}
              className="h-10 w-auto object-contain"
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
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 border border-orange-100 rounded-full"
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative h-2 w-2 bg-primary rounded-full"></span>
                </span>
                <span className="text-[11px] md:text-sm font-bold text-primary">
                  Track Order
                </span>
              </Link>
            )}

            <button
              onClick={() => setCartOpen(true)}
              className="relative p-2 hover:bg-gray-50 rounded-full transition"
            >
              <FiShoppingBag className="h-6 w-6 text-slate-700" />
              {reduxCartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white">
                  {reduxCartItems.length}
                </span>
              )}
            </button>

            {/* Desktop User Dropdown */}
            <div className="hidden md:block relative" ref={userRef}>
              {isAuth?.status ? (
                <>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-1 p-1 pr-2 border rounded-full hover:shadow-md transition"
                  >
                    <div className="h-7 w-7 bg-slate-100 rounded-full flex items-center justify-center text-slate-600">
                      <FiUser size={16} />
                    </div>
                    <FiChevronDown
                      className={`text-gray-400 transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-3 w-52 bg-white rounded-2xl shadow-2xl border py-2 z-[120]">
                      <div className="px-4 py-2 border-b mb-1">
                        <p className="text-[10px] text-gray-400 font-bold uppercase">
                          Account
                        </p>
                        <p className="text-sm font-bold truncate">
                          {isAuth.fullName}
                        </p>
                      </div>
                      <Link
                        href="/my-orders"
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-orange-50"
                      >
                        My Orders
                      </Link>
                      <Link
                        href="/setting"
                        className="block px-4 py-2 text-sm text-slate-600 hover:bg-orange-50"
                      >
                        Settings
                      </Link>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 border-t mt-2 hover:bg-red-50"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-black transition-all"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar */}
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

        {/* --- DESKTOP CATEGORY BAR (Kept) --- */}
        <div className="hidden md:block border-t border-gray-50 bg-white">
          <ul className="flex items-center md:justify-center overflow-x-auto no-scrollbar py-3 px-4 gap-6 md:gap-8">
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

      {/* --- MOBILE BOTTOM NAVIGATION --- */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-between items-center px-6 py-2 z-50 shadow-[0_-4px_12px_rgba(0,0,0,0.08)]">
        <Link
          href="/"
          className="flex flex-col items-center gap-0.5 text-slate-600"
        >
          <FiHome size={20} />
          <span className="text-[10px] font-bold">Home</span>
        </Link>

        <Link
          href="/track-order"
          className="flex flex-col items-center gap-0.5 text-slate-600"
        >
          <FiTruck size={20} />
          <span className="text-[10px] font-bold">Track</span>
        </Link>

        {/* CENTER: Random Image in Box */}
        <div className="relative -top-5">
          <div className="bg-white p-1.5 rounded-2xl shadow-lg border border-slate-100">
            <div className="h-11 w-11 overflow-hidden rounded-xl bg-slate-50">
              <img
                src={dynamicImg}
                alt="Random"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>

        <Link
          href="/chat"
          className="flex flex-col items-center gap-0.5 text-slate-600"
        >
          <FiMessageSquare size={20} />
          <span className="text-[10px] font-bold">Chat</span>
        </Link>

        {/* Bottom Navigation Account / Sign In */}
        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 text-slate-600"
        >
          <div className="h-6 w-6 bg-slate-100 rounded-full flex items-center justify-center">
            <FiUser size={16} />
          </div>
          <span className="text-[10px] font-bold">
            {isAuth?.status ? "Account" : "Sign In"}
          </span>
        </button>
      </div>

      <Toaster position="top-center" />
    </nav>
  );
}

// Helper Components
function SearchInput({
  searchQuery,
  setSearchQuery,
  isSearchLoading,
  setShowSuggestions,
}) {
  return (
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2">
        {isSearchLoading ? (
          <FiLoader className="animate-spin text-primary" />
        ) : (
          <FiSearch className="text-gray-400" />
        )}
      </div>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
        placeholder="Search products..."
        className="w-full bg-gray-100 rounded-full pl-11 pr-12 py-2.5 text-sm outline-none focus:ring-2 focus:ring-primary/20 transition-all"
      />
      {searchQuery && (
        <FiX
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-red-500"
          onClick={() => setSearchQuery("")}
        />
      )}
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
          <p className="text-xs">Searching...</p>
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
              className="w-full flex items-center gap-4 px-4 py-3 hover:bg-orange-50 text-left transition-colors border-b border-gray-50 last:border-0"
            >
              <img
                src={product.thumbnail || "/placeholder.jpg"}
                alt=""
                className="h-10 w-10 object-cover rounded-lg border"
              />
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-bold text-slate-700 truncate">
                  {product.title}
                </p>
                <p className="text-[10px] text-gray-400 uppercase">
                  {product.category}
                </p>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center text-sm text-gray-500">
          No results for "{searchQuery}"
        </div>
      )}
    </div>
  );
}
