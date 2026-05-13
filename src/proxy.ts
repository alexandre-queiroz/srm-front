import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAMES } from "./lib/cookies";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(COOKIE_NAMES.AUTH_TOKEN)?.value;
  const { pathname } = request.nextUrl;
  const isLoginPage = pathname === "/login";

  console.log(`[Middleware] Path: ${pathname}, HasToken: ${!!token}`);

  // 1. Redirect to login if accessing root or any protected path without token
  if (!token && !isLoginPage) {
    console.log(`[Middleware] Redirecting to /login from ${pathname}`);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // 2. If already logged in and trying to access the login page
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which paths should be processed by the middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - assets (public assets)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|assets|favicon.ico|docs|gallery|colors).*)",
  ],
};
