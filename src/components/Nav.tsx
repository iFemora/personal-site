"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex items-center justify-between gap-6 text-sm">
      <Link
        href="/"
        aria-label="Home"
        aria-current={isHome ? "page" : undefined}
        className="group inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent font-serif text-base font-semibold leading-none tracking-tight text-background transition-opacity hover:opacity-80"
      >
        F
      </Link>

      <div className="flex gap-6">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              className={
                isActive
                  ? "text-foreground"
                  : "text-muted transition-colors hover:text-foreground"
              }
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
