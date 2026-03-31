import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  if (!req.auth) {
    if (req.nextUrl.pathname.startsWith("/api/")) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }
    if (req.nextUrl.pathname.startsWith("/admin")) {
      const loginUrl = new URL("/login", req.nextUrl.origin);
      return NextResponse.redirect(loginUrl);
    }
  }
  return NextResponse.next();
});

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/revistas/:path*",
    "/api/autores/:path*",
    "/api/secciones/:path*",
    "/api/keywords/:path*",
    "/api/articulos/:path*",
  ],
};
