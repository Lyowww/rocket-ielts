import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { PrivateRouteEnum, PublicRoutesEnum } from "./enum/routes.enum";

export async function middleware(request: NextRequest) {
  const cookiesStore = await cookies();
  const sessionCode = cookiesStore.get("sessionCode")?.value;
  const pathname = request.nextUrl.pathname;
  const PUBLIC_ROUTES = new Set<string>(Object.values(PublicRoutesEnum));
  const PRIVATE_ROUTES = new Set<string>(Object.values(PrivateRouteEnum));

  const access_token = cookiesStore.get("access_token")?.value;
  const refresh_token = cookiesStore.get("refresh_token")?.value;

  const isTokenValid = access_token || refresh_token;

  // if (isTokenValid && PUBLIC_ROUTES.has(pathname as PublicRoutesEnum)) {
  //   return NextResponse.redirect(
  //     new URL(PrivateRouteEnum.dashboard, request.url)
  //   );
  // }

  if (!isTokenValid && PRIVATE_ROUTES.has(pathname as PrivateRouteEnum)) {
    return NextResponse.redirect(new URL(PublicRoutesEnum.signin, request.url));
  }

  if (!sessionCode && pathname !== PublicRoutesEnum.access) {
    return NextResponse.redirect(new URL(PublicRoutesEnum.access, request.url));
  }
  if (sessionCode && !isTokenValid && pathname === PublicRoutesEnum.access) {
    return NextResponse.redirect(new URL(PublicRoutesEnum.signin, request.url));
  }
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|public/|favicon.ico|logo.png|robots.txt|sitemap.xml|manifest.json).*)",
  ],
};
