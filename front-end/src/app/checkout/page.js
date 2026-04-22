import React from "react";
import Checkout from "@/routes_pages/checkout/Checkout";
import { Suspense } from "react";

const page = () => {
  return (
    <>
      <Suspense
        fallback={
          <div className="h-screen flex items-center justify-center">
            <p className="text-gray-500 text-lg font-semibold">Loading...</p>
          </div>
        }
      >
        <Checkout />
      </Suspense>
    </>
  );
};

export default page;
