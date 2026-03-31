import { Suspense } from "react";
import LoginPage from "@/routes_pages/login/Login";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="h-screen flex items-center justify-center">
          <p className="text-gray-500 text-lg font-semibold">Loading...</p>
        </div>
      }
    >
      <LoginPage  />
    </Suspense>
  );
}
