import { NextResponse, type NextRequest } from "next/server";
import { maintenanceHtml } from "@/lib/maintenanceHtml";

// ───────────────────────────────────────────────────────────────────────────
//  MAINTENANCE SWITCH
//  true  → the PUBLIC site shows the "out, briefly" page on every route.
//  false → the site is live as normal.
//  Local `npm run dev` always shows the real site so we can keep editing.
//  To bring the site back online: set this to false and push.
// ───────────────────────────────────────────────────────────────────────────
const MAINTENANCE = false;

export function middleware(_req: NextRequest) {
  if (!MAINTENANCE) return NextResponse.next();
  // Keep local development fully usable — only the production deploy goes dark.
  if (process.env.NODE_ENV !== "production") return NextResponse.next();

  return new NextResponse(maintenanceHtml(), {
    status: 503,
    headers: {
      "content-type": "text/html; charset=utf-8",
      "retry-after": "86400",
      "cache-control": "no-store",
    },
  });
}

export const config = {
  // Run on every path so no page or bundle leaks while we're dark.
  matcher: "/:path*",
};
