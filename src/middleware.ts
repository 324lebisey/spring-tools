import { NextRequest, NextResponse } from "next/server";
import { locales, defaultLocale } from "@/lib/i18n";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the pathname already has a locale
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return;

  // Skip static files and API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.includes(".")
  ) {
    return;
  }

  // Detect locale from Accept-Language header
  const acceptLang = request.headers.get("accept-language") || "";
  const preferredLocale = acceptLang.includes("ko") ? "ko" : defaultLocale;

  // Redirect to locale-prefixed path
  request.nextUrl.pathname = `/${preferredLocale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!_next|api|favicon.ico).*)"],
};
