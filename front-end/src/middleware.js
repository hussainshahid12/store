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

  const isAuth = request.cookies.get("JWT_Token");

  // If logged in and trying to access public page → redirect home
  if (isAuth && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in and accessing protected page → redirect login
  if (!isAuth && !publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  //   matcher: ["/((?!_next|api|favicon.ico).*)"],   middleWare function all reoutes this method
  matcher: [
    // "/product/:path*",
    "/login",
    "/signUp",
    "/category/:path*",
    "/verify_otp",
    "/resend_otp",
    "/forgot-password",
    "/checkout",
  ],
};
