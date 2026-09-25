import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isLoggedIn = !!req.auth;

  // Define public routes that don't require authentication
  const publicRoutes = ["/login", "/signup", "/forgot-password"];
  const isPublicRoute = publicRoutes.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
  const isApiAuthRoute = pathname.startsWith("/api/auth");

  // Root redirect
  if (pathname === "/") {
    if (isLoggedIn) {
      return Response.redirect(new URL("/dashboard", req.url));
    }
    return Response.redirect(new URL("/login", req.url));
  }

  // If user is on a public route and is already authenticated, redirect to dashboard
  if (isPublicRoute && isLoggedIn) {
    return Response.redirect(new URL("/dashboard", req.url));
  }

  // If user is NOT logged in and trying to access a protected route
  if (!isLoggedIn && !isPublicRoute && !isApiAuthRoute) {
    const callbackUrl = encodeURIComponent(pathname);
    return Response.redirect(
      new URL(`/login?callbackUrl=${callbackUrl}`, req.url)
    );
  }

  return undefined;
});

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|public|api/health).*)",
  ],
};
