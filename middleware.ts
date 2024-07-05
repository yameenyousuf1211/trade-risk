import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const publicPaths = [
    "/login",
    "/register",
    "/register/bank",
    "/register/complete",
    "/register/corporate",
    "/register/corporate/current-banking",
    "/register/corporate/point-contact",
    "/register/corporate/product-info",
  ];
  const isPublicPath = publicPaths.includes(path);

  const privatePaths = [
    "/",
    "/dashboard",
    "/my-bids",
    "/create-request",
    "/create-request/confirmation",
    "/create-request/discount",
    "/risk-participation",
    "/risk-assessment",
    "/notifications",

  ];
  const isPrivatePath = privatePaths.includes(path);

  const token = request.cookies.get("accessToken")?.value;

  if (isPublicPath && token) {
    return NextResponse.redirect(new URL("/", request.nextUrl));
  }

  if (isPrivatePath && !token) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: [
    "/login",
    "/register",
    "/register/bank",
    "/register/complete",
    "/register/corporate",
    "/register/corporate/current-banking",
    "/register/corporate/point-contact",
    "/register/corporate/product-info",
    "/",
    "/dashboard",
    "/my-bids",
    "/create-request",
    "/create-request/confirmation",
    "/create-request/discount",
    "/risk-participation",
    "/risk-assessment",
  ],
};
