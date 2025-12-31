import React from "react";

const SkeletonLoader = () => {
  return (
    <div class="bg-white rounded-xl overflow-hidden animate-pulse">
      <div class="relative w-full h-35 bg-gray-300"></div>
      <div class="p-4 flex flex-col h-[180px] justify-between">
        <div>
          <div class="bg-gray-300 h-6 w-3/4 mb-1 rounded"></div>
          <div class="flex items-center mb-2">
            <div class="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
            <div class="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
            <div class="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
            <div class="bg-gray-300 h-5 w-5 rounded-full mr-1"></div>
            <div class="bg-gray-300 h-5 w-5 rounded-full"></div>
          </div>
          <div class="bg-gray-300 h-6 w-1/2 rounded"></div>
        </div>
        <button class="mt-3 bg-gray-300 h-10 w-full rounded-lg"></button>
      </div>
    </div>
  );
};

export default SkeletonLoader;
