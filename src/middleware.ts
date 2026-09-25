import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Public routes that don't require auth
  const publicRoutes = ["/login", "/signup", "/forgot-password", "/api/auth", "/api/health"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Static assets and Next.js internals
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  // Check if authenticated via NextAuth or Supabase session cookie
  const hasSupabaseCookie = req.cookies.getAll().some((c) => c.name.startsWith("sb-"));

  // If not authenticated, redirect to login
  if (!req.auth && !hasSupabaseCookie) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin routes - check for admin role
  if (pathname.startsWith("/admin")) {
    const roles = (req.auth?.user?.roles as string[]) || [];
    const isAdminUser = roles.some(
      (r: string) => r === "SUPER_ADMIN" || r === "ADMIN"
    );
    if (!isAdminUser && req.auth) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  // Root redirect
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};
