import { maintenanceHtml } from "@/lib/maintenanceHtml";

/**
 * Lets us preview the maintenance page locally at /maintenance even when
 * middleware is bypassed in dev. In production, middleware serves this
 * same HTML for every route.
 */
export function GET() {
  return new Response(maintenanceHtml(), {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
