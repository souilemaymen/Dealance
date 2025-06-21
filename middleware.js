// middleware.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  const path = req.nextUrl.pathname;

  // 🔁 Ignore les routes API et les fichiers statiques
  if (path.startsWith("/api") || path.includes(".") || path.startsWith("/_next")) {
    return NextResponse.next();
  }

  const response = NextResponse.next();

  // ✅ Ajout des headers CORS
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
  response.headers.set("Access-Control-Allow-Credentials", "true");

  // ✅ Bloc de debug pour /dashboard et /account
  if (path.startsWith("/dashboard") || path.startsWith("/account")) {
    const token = req.cookies.get("token")?.value;

    console.log("TOKEN MIDDLEWARE:", token); // ✅ Debug visible dans le terminal (console serveur)

    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Token valide - userId:", decoded.userId);
        response.headers.set("X-User-Id", decoded.userId);
      } catch (error) {
        console.log("❌ Invalid JWT:", error.message);
        response.cookies.delete("token");
        return NextResponse.redirect(new URL("/login", req.url));
      }
    } else {
      console.log("❌ NO TOKEN FOUND");
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return response;
}

// ✅ Appliquer le middleware uniquement sur les routes sensibles
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/account/:path*",
    "/api/user"
  ]
};
