import { NextResponse } from "next/server";

export function middleware(request) {
  const path = request.nextUrl.pathname;

  const publicRoutes = [
    "/login",
    "/signUp",
    "/forgot-password",
    "/verify_otp",
    "/resend_otp",
    "/cart",
  ];

  const token = request.cookies.get("JWT_Token")?.value;

  // Logged in user trying to access auth pages
  if (token && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Not logged in → block protected routes
  if (!token && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|api).*)"], // 🔥 apply everywhere
};