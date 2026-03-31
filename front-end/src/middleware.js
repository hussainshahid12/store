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
  console.log(isAuth);

  // If logged in and trying to access public page → redirect home
  if (isAuth && publicRoutes.includes(path)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // If not logged in → redirect with return path
  if (!isAuth && !publicRoutes.includes(path)) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", path);
    return NextResponse.redirect(loginUrl);
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
