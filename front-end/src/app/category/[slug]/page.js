"use client";
import Image from "next/image";
import { useState, useMemo } from "react";

const productsData = {
  electronics: [
    {
      id: 1,
      name: "MacBook Pro 16″",
      price: 3499,
      image:
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=1200&q=85",
    },
    {
      id: 2,
      name: "iPhone 15 Pro",
      price: 999,
      image:
        "https://images.unsplash.com/photo-1695638297240-1e4598870c7f?w=1200&q=85",
    },
    {
      id: 3,
      name: "Sony WH-1000XM5",
      price: 399,
      image:
        "https://images.unsplash.com/photo-1618366716356-3b2d2d0e7e2e?w=1200&q=85",
    },
    {
      id: 4,
      name: "Apple Watch Ultra",
      price: 799,
      image:
        "https://images.unsplash.com/photo-1579586337277-34d2a5fe8d80?w=1200&q=85",
    },
  ],
  fashion: [
    {
      id: 5,
      name: "Italian Leather Jacket",
      price: 899,
      image:
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=1200&q=85",
    },
    {
      id: 6,
      name: "Cashmere Coat",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1543508282-631f70b9050f?w=1200&q=85",
    },
    {
      id: 7,
      name: "Designer Sunglasses",
      price: 489,
      image:
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1200&q=85",
    },
  ],
  beauty: [
    {
      id: 8,
      name: "La Mer Crème",
      price: 650,
      image:
        "https://images.unsplash.com/photo-1591370871770-7b1419e5c4ac?w=1200&q=85",
    },
    {
      id: 9,
      name: "Tom Ford Oud Wood",
      price: 375,
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&q=85",
    },
  ],
  sports: [
    {
      id: 10,
      name: "Carbon Road Bike",
      price: 4999,
      image:
        "https://images.unsplash.com/photo-1558618666-225e2f1c2e12?w=1200&q=85",
    },
    {
      id: 11,
      name: "Premium Yoga Set",
      price: 289,
      image:
        "https://images.unsplash.com/photo-1518614369270-4b5ec1d5c8c8?w=1200&q=85",
    },
  ],
};

export default function Home() {
  const [category, setCategory] = useState("electronics");
  const [sort, setSort] = useState("default");

  const products = useMemo(() => {
    let list = [...productsData[category]];

    if (sort === "low") list.sort((a, b) => a.price - b.price);
    if (sort === "high") list.sort((a, b) => b.price - a.price);

    return list;
  }, [category, sort]);

  const categoryLabel = {
    electronics: "Electronics",
    fashion: "Fashion",
    beauty: "Beauty & Fragrance",
    sports: "Sports & Fitness",
  }[category];

  return (
    <>
      {/* Hero */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            Luxury Collection
          </h1>
          <p className="text-xl opacity-90">
            Curated premium products just for you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Controls - Clean & Professional */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12">
          {/* Category Select */}
          <div className="flex items-center gap-4 min-w-0">
            <label className="text-lg font-semibold text-gray-700">
              Category:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full md:w-auto min-w-[220px] px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            >
              <option value="electronics">Electronics</option>
              <option value="fashion">Fashion</option>
              <option value="beauty">Beauty & Fragrance</option>
              <option value="sports">Sports & Fitness</option>
            </select>
          </div>

          {/* Sort Select */}
          <div className="flex items-center gap-4 min-w-0">
            <label className="text-lg font-semibold text-gray-700">
              Sort by:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full md:w-auto min-w-[220px] px-6 py-3 border border-gray-300 rounded-lg text-lg font-medium focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
            >
              <option value="default">Default</option>
              <option value="low">Price: Low to High</option>
              <option value="high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Current Category Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">{categoryLabel}</h2>
          <p className="text-gray-600 mt-2">{products.length} premium items</p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-400 hover:-translate-y-3"
            >
              <div className="relative aspect-square bg-gray-100">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-sm font-semibold text-purple-700">
                  Premium
                </div>
              </div>

              <div className="p-6">
                <h3 className="font-semibold text-lg text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex justify-between items-end mt-4">
                  <span className="text-3xl font-bold text-purple-600">
                    ${product.price.toLocaleString()}
                  </span>
                  <button className="bg-purple-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-purple-700 transition">
                    View
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
