import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/signUp",
    "/forgot-password",
    "/verify_otp",
    "/resend_otp",
  ];

  const isAuth = request.cookies.get("JWT_Token");

  // If logged in → block auth pages
  if (isAuth && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If NOT logged in → block protected pages
  if (!isAuth && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signUp",
    "/category/:path*",
    "/verify_otp",
    "/resend_otp",
    "/forgot-password",
    "/checkout",
  ],
};
