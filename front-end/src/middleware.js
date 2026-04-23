import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const publicRoutes = [
    "/login",
    "/signUp",
    "/forgot-password",
    "/verify_otp",
    "/resend_otp",
    "/_next", // Next.js internals
    "/api",   // API routes
    "/static", // Static files
    "/favicon.ico",
    "/assets",
    "/public"
  ];

  // Check if the current path is public
  const isPublic = publicRoutes.some((route) => pathname.startsWith(route));
  const isAuth = request.cookies.get("JWT_Token");
    console.log("is", isAuth)

  // If user is authenticated and tries to access an auth page, redirect to home
  if (isAuth && ["/login", "/signUp", "/forgot-password", "/verify_otp", "/resend_otp"].includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If user is not authenticated and tries to access a protected page, redirect to login
  if (!isAuth && !isPublic) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout",
    "/my-orders",
    "/track-order",
  ],
};
