"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

function accentFor(pathname: string): string {
  // Follow the Money borrows the work accent until it earns its own.
  if (
    pathname.startsWith("/work") ||
    pathname.startsWith("/cv") ||
    pathname.startsWith("/follow-the-money")
  )
    return "work";
  if (pathname.startsWith("/studio")) return "studio";
  if (pathname.startsWith("/writing")) return "writing";
  if (pathname.startsWith("/field-notes")) return "notes";
  if (pathname.startsWith("/tennis")) return "tennis";
  if (pathname.startsWith("/gallery")) return "gallery";
  if (pathname.startsWith("/love")) return "love";
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
