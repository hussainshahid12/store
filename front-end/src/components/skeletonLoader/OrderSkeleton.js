import React from "react";

const OrderSkeleton = () => {
  // We render 2 or 3 skeletons to fill the page
  const skeletonCards = [1, 2, 3];

  return (
    <div className="w-full space-y-10 animate-pulse">
      {skeletonCards.map((i) => (
        <div
          key={i}
          className="bg-white rounded-[2rem] border border-gray-200 shadow-sm overflow-hidden"
        >
          {/* Order Meta Header Skeleton */}
          <div className="px-8 py-5 bg-gray-50/50 border-b border-gray-100 flex flex-wrap justify-between items-center gap-4">
            <div className="flex gap-8 items-center">
              <div className="space-y-2">
                <div className="h-2 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
              <div className="h-8 w-[1px] bg-gray-200 hidden sm:block" />
              <div className="space-y-2">
                <div className="h-2 w-20 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-300 rounded" />
              </div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full" />
          </div>

          <div className="p-8 grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Left Side: Product Details Skeleton */}
            <div className="lg:col-span-7 space-y-8">
              {[1, 2].map((item) => (
                <div key={item} className="flex gap-6 items-center">
                  <div className="h-24 w-20 rounded-2xl bg-gray-200 shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 bg-gray-300 rounded" />
                    <div className="h-3 w-1/2 bg-gray-200 rounded" />
                  </div>
                  <div className="h-5 w-16 bg-gray-300 rounded" />
                </div>
              ))}
            </div>

            {/* Right Side: Summary Skeleton */}
            <div className="lg:col-span-5 flex flex-col justify-between lg:border-l lg:border-gray-100 lg:pl-12">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-2 w-20 bg-gray-200 rounded" />
                  <div className="h-4 w-40 bg-gray-300 rounded" />
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                </div>

                {/* Financial Breakdown Box */}
                <div className="bg-gray-50 rounded-[1.5rem] p-5 space-y-4">
                  <div className="flex justify-between">
                    <div className="h-3 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-12 bg-gray-200 rounded" />
                  </div>
                  <div className="pt-3 border-t border-gray-200 flex justify-between items-end">
                    <div className="space-y-2">
                      <div className="h-2 w-16 bg-gray-200 rounded" />
                      <div className="h-3 w-20 bg-gray-300 rounded" />
                    </div>
                    <div className="h-10 w-24 bg-gray-400 rounded-lg" />
                  </div>
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="mt-8 flex gap-3">
                <div className="flex-1 h-14 bg-gray-300 rounded-2xl" />
                <div className="w-24 h-14 bg-gray-100 rounded-2xl border border-gray-200" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderSkeleton;