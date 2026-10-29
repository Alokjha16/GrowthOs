import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  const session = await auth();
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname === "/onboarding" ||
    pathname.startsWith("/api/analyze") ||
    pathname.startsWith("/api/simulate") ||
    pathname.startsWith("/api/report") ||
    pathname.startsWith("/api/business") ||
    pathname.startsWith("/api/history");

  if (isProtected && !session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/onboarding",
    "/api/analyze/:path*",
    "/api/simulate/:path*",
    "/api/report/:path*",
    "/api/business/:path*",
    "/api/history/:path*",
  ],
};
