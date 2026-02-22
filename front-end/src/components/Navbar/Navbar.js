"use client";

import { useState, useEffect, useRef, useCallback, memo } from "react";
import Link from "next/link";
import {
  FiUser,
  FiSearch,
  FiChevronDown,
  FiX,
  FiShoppingBag,
} from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserLogout } from "../../../lib/features/userSlice/user";
import toast, { Toaster } from "react-hot-toast";
import Loader from "@/components/loader/Loader";
import decode from "../../../utils/markedEmail/tokenDecoded/decoded";
import EmptyCartView from "../emptyCard/EmptyCartView";
import CartItem from "../cartItems/CartItem";
import {
  fetchCartItems,
  resetCartStatus,
} from "../../../lib/features/cartSlice/cart";

// --- SUB-COMPONENT: CART DRAWER (MEMOIZED) ---
const CartDrawer = memo(({ isOpen, onClose }) => {
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const items = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );
  const cartData = useSelector((state) => state.cartSlice?.items?.cart);

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
            <div>
              <h2 className="text-xl font-bold text-slate-800">
                Shopping Cart
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                {items.length} items selected
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <FiX className="h-6 w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            {items.length > 0 ? (
              <CartItem
                items={items}
                updatingId={updatingId}
                setUpdatingId={setUpdatingId}
                removingId={removingId}
                setRemovingId={setRemovingId}
              />
            ) : (
              <EmptyCartView />
            )}
          </div>

          <div className="p-6 border-t border-gray-100 bg-gray-50/50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500 text-sm">Subtotal</span>
              <span className="text-2xl font-black text-slate-800">
                ${cartData?.finalPrice?.toFixed(2) || "0.00"}
              </span>
            </div>
            <Link href="/cart" onClick={onClose}>
              <button
                disabled={
                  Boolean(updatingId) ||
                  Boolean(removingId) ||
                  items.length === 0
                }
                className={`w-full bg-primary text-white py-4 rounded-2xl font-bold transition-all shadow-lg active:scale-[0.98] ${
                  updatingId || removingId || items.length === 0
                    ? "opacity-50 cursor-not-allowed pointer-events-none"
                    : "hover:bg-pHover"
                }`}
              >
                Checkout Now
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
});
CartDrawer.displayName = "CartDrawer";

// --- MAIN NAVBAR COMPONENT ---
export default function Navbar() {
  const dispatch = useDispatch();
  const router = useRouter();

  // Redux Selectors
  const userInfo = useSelector((state) => state.user?.userInfo);
  const cartItems = useSelector(
    (state) => state.cartSlice?.items?.cart?.items || [],
  );

  const error = useSelector((state) => state.product?.error);
  const cartError = useSelector((state) => state.cartSlice?.error);
  const stateCart = useSelector((state) => state.cartSlice?.items);

  // UI States
  const [userOpen, setUserOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [authData, setAuthData] = useState(null);

  // --- REFS FOR LOGIC CONTROL ---
  const prevItemsLength = useRef(cartItems.length);
  const userRef = useRef(null);
  // This ref tracks if we have already shown a toast for the current success message
  const lastProcessedMessage = useRef(null);

  // --- NOTIFICATION LOGIC (FIXED) ---
  useEffect(() => {
    // 1. Handle Errors
    if (error || cartError) {
      toast.error(error || cartError);
    }

    // 2. Handle Success (Prevents Double Toast)
    if (stateCart?.success && stateCart.message) {
      // Only show toast if the message is different from the last one we showed
      // or if the Redux state actually updated.
      if (lastProcessedMessage.current !== stateCart.message) {
        toast.success(stateCart.message);

        // Mark this message as "shown"
        lastProcessedMessage.current = stateCart.message;

        // Clear the success state in Redux
        dispatch(resetCartStatus());

        // Reset the ref after a delay so the same message can be shown
        // if the user adds the same item again later.
        setTimeout(() => {
          lastProcessedMessage.current = null;
        }, 1000);
      }
    }
  }, [error, stateCart, cartError, dispatch]);

  useEffect(() => {
    if (cartItems.length === 0) dispatch(fetchCartItems());
  }, [dispatch]);

  // --- AUTO-OPEN DRAWER LOGIC ---
  useEffect(() => {
    if (cartItems.length > prevItemsLength.current) {
      if (
        typeof window !== "undefined" &&
        window.location.pathname !== "/cart"
      ) {
        setCartOpen(true);
      }
    }
    prevItemsLength.current = cartItems.length;
  }, [cartItems.length]);

  // Handle Logout Response
  useEffect(() => {
    if (userInfo?.msg) {
      localStorage.clear();
      setAuthData(null);
      toast.success(userInfo.msg);
      router.push("/login");
    }
  }, [userInfo, router]);

  // Sync Auth State
  useEffect(() => {
    const token = decode();
    setAuthData(token || null);
  }, [userInfo]);

  // Click Outside Handler for User Menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Body Scroll Lock
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.body.style.overflow = cartOpen ? "hidden" : "unset";
    }
  }, [cartOpen]);

  const logoutHandler = useCallback(() => {
    dispatch(fetchUserLogout());
    setUserOpen(false);
  }, [dispatch]);

  const toggleCart = useCallback(() => setCartOpen((prev) => !prev), []);
  const closeCart = useCallback(() => setCartOpen(false), []);

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
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
      <CartDrawer isOpen={cartOpen} onClose={closeCart} />

      <div className="max-w-screen-xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 gap-4">
          <Link
            href="/"
            className="flex-shrink-0 transition-transform hover:scale-105"
          >
            <span className="font-black text-2xl tracking-tighter text-slate-800">
              STORE<span className="text-primary">.</span>
            </span>
          </Link>

          {/* Search - Desktop */}
          <div className="flex-1 max-w-xl hidden md:block">
            <div className="relative group">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products..."
                className="w-full bg-gray-50 rounded-full border border-gray-200 pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button
              onClick={toggleCart}
              className="relative p-2 text-slate-700 hover:bg-gray-50 rounded-full transition group"
            >
              <FiShoppingBag className="h-6 w-6 group-hover:text-primary transition-colors" />
              {cartItems.length > 0 && (
                <span className="absolute top-1 right-1 bg-primary text-white text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full ring-2 ring-white animate-in zoom-in">
                  {cartItems.length}
                </span>
              )}
            </button>

            <div className="relative" ref={userRef}>
              {authData?.status ? (
                <>
                  <button
                    onClick={() => setUserOpen(!userOpen)}
                    className="flex items-center gap-2 p-1 pr-3 border border-gray-200 rounded-full bg-white hover:shadow-md transition"
                  >
                    <div className="h-8 w-8 bg-orange-50 rounded-full flex items-center justify-center text-primary">
                      <FiUser className="h-5 w-5" />
                    </div>
                    <FiChevronDown
                      className={`text-gray-400 transition-transform ${userOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {userOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50">
                      <div className="px-4 py-3 border-b border-gray-50 mb-1">
                        <p className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">
                          Account
                        </p>
                        <p className="text-sm font-bold text-slate-800 truncate">
                          {authData?.fullName}
                        </p>
                      </div>
                      {["Orders", "Settings", "Favorites"].map((item) => (
                        <Link
                          key={item}
                          href="#"
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:bg-orange-50 hover:text-primary"
                        >
                          {item}
                        </Link>
                      ))}
                      <button
                        onClick={logoutHandler}
                        className="w-full text-left px-4 py-2.5 text-sm text-red-500 border-t mt-2 hover:bg-red-50 transition-colors font-medium"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  className="px-6 py-2 bg-primary text-white text-sm font-bold rounded-full hover:bg-pHover transition shadow-lg active:scale-95"
                  onClick={() => router.push("/login")}
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden px-4 pb-4">
          <div className="relative">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search items..."
              className="w-full bg-gray-100 rounded-xl border-none pl-11 pr-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        {/* Bottom Menu */}
        <div className="border-t border-gray-50 bg-white">
          <ul className="flex items-center overflow-x-auto lg:justify-center no-scrollbar whitespace-nowrap px-4 py-3 space-x-8">
            {menuItems.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  className="text-[13px] font-bold text-slate-500 hover:text-primary transition-colors uppercase tracking-wide"
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
