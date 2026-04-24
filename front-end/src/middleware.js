import { NextResponse } from "next/server";

export function middleware(request) {
  const token = request.cookies.get("JWT_Token");

  console.log("TOKEN:", token);

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/checkout/:path*",
    "/my-orders/:path*",
    "/track-order/:path*",
  ],
};
