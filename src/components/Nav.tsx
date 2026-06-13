"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Magnetic from "@/components/motion/Magnetic";
import { spiralPath } from "@/lib/spiralPath";

const items = [
  { href: "/work", label: "Work" },
  { href: "/writing", label: "Writing" },
  { href: "/field-notes", label: "Notes" },
  { href: "/tennis", label: "Tennis" },
  { href: "/gallery", label: "Gallery" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <nav className="flex items-center justify-between gap-6 font-mono text-xs uppercase tracking-[0.18em]">
      <Magnetic strength={0.35}>
        <Link
          href="/"
          aria-label="Home"
          aria-current={isHome ? "page" : undefined}
          className="group inline-flex h-9 w-9 items-center justify-center text-accent"
        >
          <svg
            width="30"
            height="30"
            viewBox="0 0 100 100"
            fill="none"
            aria-hidden
            className="transition-transform duration-700 ease-out group-hover:rotate-180"
          >
            <path
              d={spiralPath()}
              stroke="currentColor"
              strokeWidth={5}
              strokeLinecap="round"
            />
          </svg>
        </Link>
      </Magnetic>

      <div className="flex flex-wrap gap-x-4 gap-y-1 sm:gap-x-6">
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
