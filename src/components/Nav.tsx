"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Magnetic from "@/components/motion/Magnetic";

const items = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/field-notes", label: "Notes" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex items-center justify-between gap-6 text-sm">
      <Magnetic strength={0.35}>
        <Link
          href="/"
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-accent font-serif text-base font-semibold leading-none tracking-tight text-background transition-opacity hover:opacity-80"
        >
          F
        </Link>
      </Magnetic>

      <div className="flex gap-6">
        {items.map((item) => {
          const isActive =
            pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Magnetic key={item.href} strength={0.25}>
              <Link
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`group relative ${
                  isActive
                    ? "text-foreground"
                    : "text-muted transition-colors hover:text-foreground"
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1 left-0 h-px w-full origin-left bg-current transition-transform duration-300 ease-out ${
                    isActive
                      ? "scale-x-100"
                      : "scale-x-0 group-hover:scale-x-100"
                  }`}
                />
              </Link>
            </Magnetic>
          );
        })}
      </div>
    </nav>
  );
}
