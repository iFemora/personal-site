import { maintenanceHtml } from "@/lib/maintenanceHtml";

/**
 * Preview of the "out, briefly" page at /maintenance.
 *
 * To take the whole site dark, restore src/middleware.ts from git history
 * (deleted 2026-07 because its every-request matcher cost a middleware
 * invocation per asset while doing nothing) and set MAINTENANCE = true.
 */
export function GET() {
  return new Response(maintenanceHtml(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
