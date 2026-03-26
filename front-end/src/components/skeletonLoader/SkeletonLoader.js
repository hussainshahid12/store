import React from "react";

const SkeletonLoader = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden animate-pulse border border-gray-100">
      
      {/* Image Section with Pak Bazar Name */}
      <div className="relative w-full h-35 bg-gray-300 flex items-center justify-center">
        <span className="text-gray-400 font-bold text-xl uppercase tracking-widest opacity-60">
          Pak Bazar
        </span>
      </div>

      <div className="p-4 flex flex-col h-[180px] justify-between">
        <div>
          {/* Title Placeholder */}
          <div className="bg-gray-300 h-6 w-3/4 mb-3 rounded"></div>
          
          {/* Rating Icons Placeholder */}
          <div className="flex items-center mb-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
            ))}
          </div>
          
          {/* Subtitle/Price Placeholder */}
          <div className="bg-gray-300 h-6 w-1/2 rounded"></div>
        </div>

        {/* Action Button Placeholder */}
        <div className="mt-3 bg-gray-300 h-10 w-full rounded-lg"></div>
      </div>
    </div>
  );
};

export default SkeletonLoader;