 // middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  // TEMPORALMENTE DESHABILITADO - getToken no funciona correctamente en producción con cookies
  // Las rutas están protegidas con useSession en cada página
  return NextResponse.next();
}

// Configuración del matcher
export const config = {
  matcher: ["/dashboard/:path*", "/sendEmail/:path*"],
};