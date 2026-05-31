import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public API routes (auth handled in the route handlers)
  const publicApiPaths = [
    "/api/auth/login",
    "/api/auth/register",
    "/api/auth/logout",
    "/api/auth/me",
    "/api/cars",
    "/api/upload",
    "/api/settings",
    "/api/bookings",
  ];

  // Allow all API routes — auth is handled in the route handlers
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Allow public pages
  if (
    ["/", "/login", "/register", "/cars"].some(
      (path) => pathname === path || pathname.startsWith(path + "/")
    )
  ) {
    return NextResponse.next();
  }

  // For admin pages, protect at page level (not needed for API routes)
  // The admin layout/component will handle redirect if not logged in

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/).*)",
  ],
};
