import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("access_token")?.value;
  const memberType = request.cookies.get("user_role")?.value; 

  const path = request.nextUrl.pathname;
  const isAdminRoute = path.startsWith("/admin");
  const isAuthRoute = path.startsWith("/authentication");

  if (isAdminRoute) {
    if (!token || memberType !== "official") {
      const url = request.nextUrl.clone();
      url.pathname = "/authentication";
      return NextResponse.redirect(url);
    }
  }

  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = memberType === "official" ? "/admin/dashboard" : "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
    '/authenticatin'
  ],
};