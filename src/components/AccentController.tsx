"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function accentFor(pathname: string): string {
  if (pathname.startsWith("/work") || pathname.startsWith("/cv")) return "work";
  if (pathname.startsWith("/writing")) return "writing";
  if (pathname.startsWith("/field-notes")) return "notes";
  return "home";
}

/** Sets html[data-accent] per route so each section claims its accent. */
export default function AccentController() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.accent = accentFor(pathname);
  }, [pathname]);

  return null;
}
