
import React, { Suspense } from "react";
import VerifyPage from "@/routes_pages/otp/OtpVerifyPage";

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyPage />
    </Suspense>
  );
};

export default Page;
