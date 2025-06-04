// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  // Skip authentication check for routes starting with "/auth"
  if (pathname.startsWith("/auth")) {
    return NextResponse.next(); // No authentication needed for /auth routes
  }

  // Check for the presence of the JWT token in cookies for other protected routes
  //const token = req.cookies.get("access_token")?.value;
  const token = req.cookies.get("public_token")?.value;

  // If token is not found, redirect to login page
  if (!token) {
    //return NextResponse.redirect(new URL("/auth/signin", req.url));

    const loginUrl = new URL("/auth/signin", req.url);
    //loginUrl.searchParams.set("reason", "no_token"); // Tambahkan info ke URL
    return NextResponse.redirect(loginUrl);

  }

  // If token is found, allow access to the requested page
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!auth|_next|static|favicon.ico).*)",
  ],
};
