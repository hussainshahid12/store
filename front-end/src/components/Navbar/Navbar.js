"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FiShoppingCart,
  FiUser,
  FiMenu,
  FiX,
  FiTrash2,
} from "react-icons/fi";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [isAuth, setIsAuth] = useState(false); // Change to true if user is logged in

  const userRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userRef.current && !userRef.current.contains(e.target)) {
        setUserOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------------- DEMO DATA ---------------- */
  const products = [
    "Apple iPhone 15",
    "Apple iPad Air",
    "Apple Watch SE",
    "Sony Playstation 5",
    'Apple iMac 24"',
    "Samsung Galaxy S23",
    "Sony Headphones",
    "Dell XPS 15",
  ];

  const suggestions = products.filter((p) =>
    p.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const demoCartItems = [
    {
      name: "Apple iPhone 15",
      price: 599,
      qty: 1,
      image: "/images/iphone15.png", // Replaced Flowbite URL with local path
    },
    {
      name: "Apple iPad Air",
      price: 499,
      qty: 1,
      image: "/images/ipad-air.png", // Replaced Flowbite URL with local path
    },
  ];

  useEffect(() => {
    setIsClient(true);
    setCartItems(demoCartItems);
  }, []);

  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const removeItem = (index) => {
    setCartItems((prev) => prev.filter((_, i) => i !== index));
  };

  const menuItems = [
    "Home",
    "Best Sellers",
    "Gift Ideas",
    "Today's Deals",
    "Sell",
  ];

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-30">
        <div className="max-w-screen-xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left: Hamburger + Logo */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="lg:hidden p-2 text-xl"
              >
                <FiMenu />
              </button>

              <Link href="/" className="hidden md:block">
                <Image
                  src="/images/logo.png" // Replaced Flowbite logo with local path
                  alt="Logo"
                  width={120}
                  height={32}
                  unoptimized
                />
              </Link>
            </div>

            {/* Center: Search Bar - Always Visible */}
            <div className="flex-1 max-w-md mx-1 md:mx-4">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full rounded-lg border border-gray-300 px-2 md:px-4 py-2 text-xs md:text-sm focus:outline-none focus:border-blue-500 transition" // Increased padding and text size on mobile
                />
                {searchQuery && suggestions.length > 0 && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
                    {suggestions.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => setSearchQuery(item)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right: Cart + User - Visible on all devices */}
            <div className="flex items-center gap-1 md:gap-3">
              <button
                onClick={() => setCartOpen(true)}
                className="relative p-1 md:p-2 rounded-lg hover:bg-gray-100 transition"
              >
                <FiShoppingCart className="h-5 md:h-6 w-5 md:w-6" />
                {isClient && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1.5 py-0.5 rounded-full">
                    {cartCount}
                  </span>
                )}
              </button>

              <div className="relative" ref={userRef}>
                {isAuth ? (
                  <>
                    <button
                      onClick={() => setUserOpen(!userOpen)}
                      className="p-1 md:p-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 md:gap-2"
                    >
                      <FiUser className="h-5 md:h-5 w-5 md:w-5" />
                      <span className="hidden sm:inline text-xs md:text-sm font-medium">Account</span>
                    </button>

                    {userOpen && (
                      <div className="absolute right-0 mt-2 z-20 w-56 bg-white rounded-lg shadow-lg divide-y divide-gray-100">
                        <ul className="p-2 text-sm">
                          {[
                            "My Account",
                            "My Orders",
                            "Settings",
                            "Favourites",
                            "Delivery Addresses",
                            "Billing Data",
                          ].map((item) => (
                            <li key={item}>
                              <Link
                                href="#"
                                className="block px-3 py-2 rounded-md hover:bg-gray-100"
                              >
                                {item}
                              </Link>
                            </li>
                          ))}
                        </ul>
                        <div className="p-2">
                          <Link
                            href="/logout"
                            className="block px-3 py-2 text-red-600 rounded-md hover:bg-gray-100"
                          >
                            Sign Out
                          </Link>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href="/login"
                    className="p-1 md:p-2 rounded-lg hover:bg-gray-100 transition flex items-center gap-1 md:gap-2"
                  >
                    <FiUser className="h-5 md:h-5 w-5 md:w-5" />
                    <span className="hidden sm:inline text-xs md:text-sm font-medium">Sign In</span>
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Desktop Menu Links */}
          <div className="hidden lg:block border-t">
            <ul className="flex justify-center space-x-8 py-3">
              {menuItems.map((item) => (
                <li key={item}>
                  <Link
                    href="#"
                    className="text-sm font-medium text-gray-700 hover:text-blue-600 transition"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Drawer - Smooth Slide from Left */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none ${
          mobileMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setMobileMenuOpen(false)}
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            mobileMenuOpen ? "opacity-40 pointer-events-auto" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Menu</h2>
            <button onClick={() => setMobileMenuOpen(false)}>
              <FiX className="text-2xl" />
            </button>
          </div>
          <ul className="p-4 space-y-1">
            {menuItems.map((item) => (
              <li key={item}>
                <Link
                  href="#"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-100 rounded-lg transition"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Cart Drawer - Smooth Slide from Right */}
      <div
        className={`fixed inset-0 z-50 pointer-events-none ${
          cartOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          onClick={() => setCartOpen(false)}
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            cartOpen ? "opacity-40 pointer-events-auto" : "opacity-0"
          }`}
        />

        {/* Drawer Panel */}
        <div
          className={`absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            cartOpen ? "translate-x-0" : "translate-x-full"
          } flex flex-col`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="font-semibold text-lg">Shopping Cart ({cartCount})</h2>
            <button onClick={() => setCartOpen(false)}>
              <FiX className="text-2xl" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-6">
            {cartItems.length === 0 ? (
              <p className="text-center text-gray-500 mt-10">Your cart is empty</p>
            ) : (
              cartItems.map((item, i) => (
                <div key={i} className="flex gap-4 bg-gray-50 p-4 rounded-lg">
                  <Image
                    src={item.image}
                    width={80}
                    height={80}
                    alt={item.name}
                    className="rounded object-cover"
                    unoptimized
                  />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-gray-600 mt-1">
                      ${item.price} × {item.qty}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(i)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <FiTrash2 className="text-xl" />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItems.length > 0 && (
            <div className="p-4 border-t bg-white">
              <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition">
                Proceed to Checkout
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}