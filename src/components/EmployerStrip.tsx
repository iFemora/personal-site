import Link from "next/link";

/* Typographic wordmarks on purpose: the four marks come from four
   different brand systems and would never sit on one hairline cleanly,
   so each employer is set in the house display face, monochrome until
   hover. Swap in official SVGs only if all four can match. */
export const employers = [
  {
    name: "Marqeta",
    role: "Lead Product Manager",
    years: "2025–26",
    href: "/work#cardholder-support",
  },
  {
    name: "Paystack",
    note: "a Stripe company",
    role: "Product, key accounts",
    years: "2021–25",
    href: "/work#airline-payments",
  },
  {
    name: "FCMB",
    note: "First City Monument Bank",
    role: "Product Lead",
    years: "2024–25",
    href: "/work#corporate-banking",
  },
  {
    name: "Farmcrowdy",
    note: "Techstars Toronto",
    role: "Product Manager",
    years: "2019–21",
    href: "/work#greenfield-vertical",
  },
];

export default function EmployerStrip({ className = "" }: { className?: string }) {
  return (
    <ul
      aria-label="Employers"
      className={`grid grid-cols-2 gap-x-6 gap-y-7 border-t border-rule pt-6 sm:grid-cols-4 ${className}`}
    >
      {employers.map((e) => (
        <li key={e.name}>
          <Link href={e.href} className="group block">
            <span className="wonk block font-serif text-2xl font-medium leading-none tracking-tight text-foreground transition-colors duration-300 group-hover:text-accent sm:text-[1.7rem]">
              {e.name}
            </span>
            {e.note && (
              <span className="mt-1.5 block font-serif text-sm italic leading-snug text-muted">
                {e.note}
              </span>
            )}
            <span className="mt-2 block font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted">
              {e.role}
              <br />
              {e.years}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
