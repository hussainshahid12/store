import { HiOutlineChevronLeft } from "react-icons/hi";

export default function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-white text-slate-900 px-2 lg:px-10 animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        {/* Header Skeleton */}
        <div className="mb-12">
          <div className="flex items-center gap-1 text-slate-200">
            <HiOutlineChevronLeft className="w-4 h-4" />
            <div className="h-3 w-20 bg-slate-100 rounded" />
          </div>
          <div className="h-10 w-48 bg-slate-200 rounded-xl mt-4" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left Column: Form Skeleton */}
          <div className="lg:col-span-7 space-y-12">
            <section>
              <div className="flex items-center gap-3 mb-8">
                <div className="w-6 h-6 bg-slate-200 rounded-full" />
                <div className="h-6 w-40 bg-slate-200 rounded-lg" />
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className={i > 2 ? "col-span-2" : "col-span-1"}>
                    <div className="h-3 w-24 bg-slate-100 rounded mb-2" />
                    <div className="h-12 w-full bg-slate-50 border border-slate-100 rounded-xl" />
                  </div>
                ))}
              </div>
            </section>

            {/* Saved Addresses Skeleton */}
            <section className="mt-10">
              <div className="h-3 w-40 bg-slate-100 rounded mb-4" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-28 bg-slate-50 border border-slate-100 rounded-2xl" />
                <div className="h-28 bg-slate-50 border border-slate-100 rounded-2xl" />
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary Skeleton */}
          <aside className="lg:col-span-5">
            <div className="bg-slate-50 rounded-[2.5rem] p-8 lg:p-12 border border-slate-100">
              <div className="h-6 w-32 bg-slate-200 rounded-lg mb-8" />
              
              <div className="space-y-6 mb-8">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-20 h-20 bg-slate-200 rounded-2xl flex-shrink-0" />
                    <div className="flex-grow space-y-2 py-2">
                      <div className="h-4 w-full bg-slate-200 rounded" />
                      <div className="h-3 w-24 bg-slate-100 rounded" />
                      <div className="h-4 w-16 bg-slate-200 rounded" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-200 pt-8">
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                  <div className="h-4 w-16 bg-slate-200 rounded" />
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-slate-100 rounded" />
                  <div className="h-4 w-12 bg-slate-200 rounded" />
                </div>
                <div className="flex justify-between pt-4">
                  <div className="h-6 w-16 bg-slate-200 rounded" />
                  <div className="h-10 w-24 bg-slate-300 rounded-lg" />
                </div>
              </div>

              <div className="w-full h-16 bg-slate-200 rounded-2xl mt-10" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}