// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip authentication check for routes starting with "/auth"
  if (pathname.startsWith("/auth")) {
    return NextResponse.next(); // No authentication needed for /auth routes
  }

  // Check for the presence of the JWT token in cookies for other protected routes
  const token = req.cookies.get("access_token")?.value;

  // If token is not found, redirect to login page
  if (!token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // If token is found, allow access to the requested page
  return NextResponse.next();
}

export const config = {
  // Apply middleware to all paths (default is to apply to all routes)
  matcher: [
    // Protected paths should be listed here if needed, or just leave it for all paths
    "/",
    "/transactions/:path*",
    "/profile/:path*",
    "/settings/:path*",
    // You can specify additional protected paths as needed
  ],
};
