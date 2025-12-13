"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FiShoppingCart, FiUser, FiMenu, FiX, FiTrash2 } from "react-icons/fi";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Demo products for search suggestions
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

  // Demo cart items with images
  const demoCartItems = [
    {
      name: "Apple iPhone 15",
      price: 599,
      qty: 1,
      image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/iphone15.png",
    },
    {
      name: "Apple iPad Air",
      price: 499,
      qty: 1,
      image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ipad-air.png",
    },
    {
      name: "Apple Watch SE",
      price: 598,
      qty: 2,
      image:
        "https://flowbite.s3.amazonaws.com/blocks/e-commerce/apple-watch.png",
    },
    {
      name: "Sony Playstation 5",
      price: 799,
      qty: 1,
      image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/ps5.png",
    },
    {
      name: 'Apple iMac 24"',
      price: 8997,
      qty: 3,
      image: "https://flowbite.s3.amazonaws.com/blocks/e-commerce/imac.png",
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
      <nav className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link href="/" className="cursor-pointer">
                <Image
                  className="h-8 w-auto dark:hidden"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                  unoptimized
                />
                <Image
                  className="h-8 w-auto hidden dark:block"
                  src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                  unoptimized
                />
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1">
              <ul className="flex space-x-6">
                {menuItems.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors cursor-pointer"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Desktop Search */}
              <div className="ml-6 flex-1 relative max-w-md">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                />
                {searchQuery && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 mt-1 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                        onClick={() => setSearchQuery(item)}
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center space-x-4">
              {/* Cart Button */}
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <FiShoppingCart className="h-6 w-6" />
                {isClient && cartCount > 0 && (
                  <span
                    suppressHydrationWarning
                    className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold text-white bg-red-600 rounded-full"
                  >
                    {cartCount}
                  </span>
                )}
              </button>

              {/* User Menu */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setUserOpen(!userOpen)}
                  className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
                >
                  <FiUser className="h-5 w-5" />
                </button>
                {userOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-700 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600 z-50">
                    <ul className="py-2 text-sm">
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
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                          >
                            {item}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 dark:border-gray-600">
                      <Link
                        href="#"
                        className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                      >
                        Sign Out
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer"
              >
                {mobileMenuOpen ? (
                  <FiX className="h-6 w-6" />
                ) : (
                  <FiMenu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-text"
                />
                {searchQuery && suggestions.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white dark:bg-gray-800 border mt-1 rounded-lg shadow-lg max-h-60 overflow-auto">
                    {suggestions.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => setSearchQuery(item)}
                        className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-sm"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <ul className="space-y-3">
                {menuItems.map((item) => (
                  <li key={item}>
                    <Link
                      href="#"
                      className="block text-gray-900 dark:text-white hover:text-blue-600 text-base font-medium cursor-pointer"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Cart Drawer with Blur Backdrop & Smooth Animation */}
      {isClient && (
        <>
          {/* Blur Backdrop */}
          <div
            className={`fixed inset-0 bg-white/30 dark:bg-black/30 backdrop-blur-sm z-40 transition-all duration-300 ease-in-out ${
              cartOpen ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <div
            className={`fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white dark:bg-gray-800 shadow-xl flex flex-col transition-transform duration-300 ease-in-out ${
              cartOpen ? "translate-x-0" : "translate-x-full"
            }`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Shopping Cart ({cartCount})
              </h2>
              <button
                onClick={() => setCartOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors cursor-pointer"
              >
                <FiX className="h-6 w-6" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4">
              {cartItems.length === 0 ? (
                <p className="text-center py-16 text-gray-500">
                  Your cart is empty.
                </p>
              ) : (
                <div className="space-y-6">
                  {cartItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex gap-4 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={96}
                          height={96}
                          className="w-24 h-24 object-cover rounded-md"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1">
                        <Link
                          href="#"
                          className="font-medium text-gray-900 dark:text-white hover:underline line-clamp-2 cursor-pointer"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-500 mt-1">
                          ${item.price.toLocaleString()} × {item.qty}
                        </p>
                        <p className="text-lg font-semibold mt-2">
                          ${(item.price * item.qty).toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-800 self-start cursor-pointer"
                      >
                        <FiTrash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4 space-y-4">
                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span>
                    $
                    {cartItems
                      .reduce((sum, item) => sum + item.price * item.qty, 0)
                      .toLocaleString()}
                  </span>
                </div>
                <Link
                  href="/cart"
                  className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors cursor-pointer"
                  onClick={() => setCartOpen(false)}
                >
                  View Cart
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
