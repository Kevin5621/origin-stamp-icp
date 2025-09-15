import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Authentication middleware for route protection
 * Handles redirects for authenticated and unauthenticated users
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if user is authenticated via cookies
  const isAuthenticated =
    request.cookies.has("auth-user") ||
    request.cookies.has("originstamp_user_principal");

  // Define route categories
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const authRoutes = ["/auth/login", "/auth/register"];

  // Check if current path matches route categories
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users from auth routes to dashboard
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/auth/:path*",
  ],
};
