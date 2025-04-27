import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
// This function can be marked `async` if using `await` inside
export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  console.log("path", path);
  const isPublicPath =
    path === "/" || path.includes("/captioned") || path === "/verifyemail";
  const token = request.cookies.get("idToken")?.value || "";

  // if (token && isPublicPath) {
  //   const { sub } = jwt.decode(token) as { sub: string };
  //   return NextResponse.redirect(new URL(`/users/${sub}`, request.url));
  // }
  // if (token === "" && !isPublicPath) {
  //   return NextResponse.redirect(new URL(`/`, request.url));
  // }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/users/:path*", "/verifyemail", "/captioned/:path*"],
};
