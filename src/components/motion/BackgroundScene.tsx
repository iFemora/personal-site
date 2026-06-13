"use client";

import { usePathname } from "next/navigation";
import BackgroundSpiral from "./BackgroundSpiral";
import TennisRally from "./TennisRally";

/** Picks the page's background life: a rally on /tennis, the spiral elsewhere. */
export default function BackgroundScene() {
  const pathname = usePathname();
  if (pathname.startsWith("/tennis")) return <TennisRally />;
  return <BackgroundSpiral />;
}
