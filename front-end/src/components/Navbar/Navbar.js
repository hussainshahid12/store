"use client";

import { useState, useEffect } from "react";
import { FiShoppingCart, FiUser, FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [cartOpen, setCartOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Start empty on server — populate only on client
  const [cartItems, setCartItems] = useState([]);
  const [isClient, setIsClient] = useState(false);

  // Demo products for search suggestions
  const products = [
    "Apple iPhone 15",
    "Apple iPad Air",
    "Apple Watch SE",
    "Sony Playstation 5",
    'Apple iMac 20"',
    "Samsung Galaxy S23",
    "Sony Headphones",
    "Dell XPS 15",
  ];

  const suggestions = products.filter((p) =>
    p.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Demo cart items (only loaded on client)
  const demoCartItems = [
    { name: "Apple iPhone 15", price: 599, qty: 1 },
    { name: "Apple iPad Air", price: 499, qty: 1 },
    { name: "Apple Watch SE", price: 598, qty: 2 },
    { name: "Sony Playstation 5", price: 799, qty: 1 },
    { name: 'Apple iMac 20"', price: 8997, qty: 3 },
  ];

  // Load cart only on the client side
  useEffect(() => {
    setIsClient(true);
    setCartItems(demoCartItems); // Replace with localStorage or API in real app
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
    <nav className="bg-white dark:bg-gray-800 shadow-sm">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <div className="flex-shrink-0">
            <a href="#">
              <img
                className="h-8 w-auto dark:hidden"
                src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full.svg"
                alt="Logo"
              />
              <img
                className="h-8 w-auto hidden dark:block"
                src="https://flowbite.s3.amazonaws.com/blocks/e-commerce/logo-full-dark.svg"
                alt="Logo"
              />
            </a>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex lg:items-center lg:space-x-6 flex-1">
            <ul className="flex space-x-6">
              {menuItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 text-sm font-medium transition-colors"
                  >
                    {item}
                  </a>
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
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm text-gray-900 dark:text-white bg-white dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            {/* Cart */}
            <div className="relative">
              <button
                onClick={() => setCartOpen(!cartOpen)}
                className="relative p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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

              {/* Cart Dropdown */}
              {cartOpen && isClient && (
                <div
                  suppressHydrationWarning
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50"
                >
                  {cartItems.length === 0 ? (
                    <p className="text-center py-8 text-gray-500">
                      Your cart is empty.
                    </p>
                  ) : (
                    <>
                      <div className="max-h-96 overflow-y-auto space-y-4">
                        {cartItems.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-3 last:border-0"
                          >
                            <div className="flex-1">
                              <a
                                href="#"
                                className="text-sm font-medium text-gray-900 dark:text-white hover:underline line-clamp-2"
                              >
                                {item.name}
                              </a>
                              <p className="text-sm text-gray-500">
                                ${item.price} × {item.qty}
                              </p>
                            </div>
                            <div className="ml-4 flex items-center gap-3">
                              <span className="font-semibold">
                                ${(item.price * item.qty).toLocaleString()}
                              </span>
                              <button
                                onClick={() => removeItem(index)}
                                className="text-red-600 hover:text-red-800 text-xl"
                              >
                                ×
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600">
                        <div className="flex justify-between text-lg font-bold mb-3">
                          <span>Total</span>
                          <span>
                            $
                            {cartItems
                              .reduce(
                                (sum, item) => sum + item.price * item.qty,
                                0
                              )
                              .toLocaleString()}
                          </span>
                        </div>
                        <a
                          href="#"
                          className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                        >
                          Proceed to Checkout
                        </a>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserOpen(!userOpen)}
                className="p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
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
                        <a
                          href="#"
                          className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600"
                        >
                          {item}
                        </a>
                      </li>
                    ))}
                  </ul>
                  <div className="border-t border-gray-200 dark:border-gray-600">
                    <a
                      href="#"
                      className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:hover:bg-gray-600"
                    >
                      Sign Out
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
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
            {/* Mobile Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

            {/* Mobile Links */}
            <ul className="space-y-3">
              {menuItems.map((item) => (
                <li key={item}>
                  <a
                    href="#"
                    className="block text-gray-900 dark:text-white hover:text-blue-600 text-base font-medium"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}