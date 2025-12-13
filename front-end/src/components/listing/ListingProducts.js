"use client";
import Image from "next/image";
import { useState } from "react";
import { FaStar } from "react-icons/fa";
import Pagination from "../pagination/Pagination";

// Dummy product data with ratings
const productsData = [
  {
    id: 1,
    name: "Apple iPhone 15",
    price: 599,
    category: "Electronics",
    rating: 4,
    image: "https://picsum.photos/id/1010/300/300",
  },
  {
    id: 2,
    name: "Apple iPad Air",
    price: 499,
    category: "Electronics",
    rating: 5,
    image: "https://picsum.photos/id/1011/300/300",
  },
  {
    id: 3,
    name: "Apple Watch SE",
    price: 298,
    category: "Electronics",
    rating: 3,
    image: "https://picsum.photos/id/1012/300/300",
  },
  {
    id: 4,
    name: "Sony Playstation 5",
    price: 799,
    category: "Gaming",
    rating: 5,
    image: "https://picsum.photos/id/1013/300/300",
  },
  {
    id: 5,
    name: "Samsung Galaxy S23",
    price: 699,
    category: "Electronics",
    rating: 4,
    image: "https://picsum.photos/id/1014/300/300",
  },
  {
    id: 6,
    name: "Dell XPS 15",
    price: 1099,
    category: "Electronics",
    rating: 4,
    image: "https://picsum.photos/id/1015/300/300",
  },
  {
    id: 7,
    name: "Sony Headphones",
    price: 199,
    category: "Accessories",
    rating: 3,
    image: "https://picsum.photos/id/1016/300/300",
  },
  {
    id: 8,
    name: 'Apple iMac 20"',
    price: 8997,
    category: "Electronics",
    rating: 5,
    image: "https://picsum.photos/id/1017/300/300",
  },
];

// Get unique categories dynamically
const getUniqueCategories = (data) => [
  "All",
  ...new Set(data.map((item) => item.category)),
];

const ProductCard = ({ product }) => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <div className="relative w-full h-64">
      <Image
        src={product.image}
        alt={product.name}
        fill
        className="object-cover transition-transform duration-300 group-hover:scale-105"
      />
    </div>
    <div className="p-4 flex flex-col h-[180px] justify-between">
      <div>
        <h2 className="text-gray-900 dark:text-white font-semibold text-lg mb-1 truncate">
          {product.name}
        </h2>
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <FaStar
              key={i}
              className={`mr-1 ${
                i < product.rating
                  ? "text-yellow-400"
                  : "text-gray-300 dark:text-gray-600"
              }`}
            />
          ))}
        </div>
        <p className="text-gray-700 dark:text-gray-300 font-bold text-lg">
          ${product.price}
        </p>
      </div>
      <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
        Add to Cart
      </button>
    </div>
  </div>
);

export default function ProductListing() {
  const [products] = useState(productsData);
  const [selectedCategories, setSelectedCategories] = useState(["All"]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = 10; // dynamic from backend later

  const categories = getUniqueCategories(productsData);

  const handleCategoryChange = (category) => {
    if (category === "All") {
      setSelectedCategories(["All"]);
    } else {
      let updated = selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories.filter((c) => c !== "All"), category];

      if (updated.length === 0) updated = ["All"];
      setSelectedCategories(updated);
    }
  };

  const filteredProducts = products.filter((product) =>
    selectedCategories.includes("All")
      ? true
      : selectedCategories.includes(product.category)
  );

  const sortedProducts = filteredProducts.sort((a, b) =>
    sortOrder === "asc" ? a.price - b.price : b.price - a.price
  );

  return (
    <div className="max-w-screen-xl mx-auto px-4 lg:px-20 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Products
      </h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-1/4 flex flex-col gap-6">
          {/* Sort by Price */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Sort by Price
            </h2>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Low to High</option>
              <option value="desc">High to Low</option>
            </select>
          </div>

          {/* Category Filters */}
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-4">
              Categories
            </h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              {categories.map((cat) => (
                <li key={cat}>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 text-blue-600"
                      checked={selectedCategories.includes(cat)}
                      onChange={() => handleCategoryChange(cat)}
                    />
                    <span
                      className={`${
                        selectedCategories.includes(cat) ? "font-semibold" : ""
                      }`}
                    >
                      {cat}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:w-3/4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {sortedProducts.length > 0 ? (
            sortedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          ) : (
            <p className="text-gray-700 dark:text-gray-300 col-span-full text-center">
              No products found.
            </p>
          )}
        </main>
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
