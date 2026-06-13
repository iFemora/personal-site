import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono } from "next/font/google";
import Nav from "@/components/Nav";
import FooterLinks from "@/components/FooterLinks";
import AccentController from "@/components/AccentController";
import CursorDot from "@/components/motion/CursorDot";
import BackgroundSpiral from "@/components/motion/BackgroundSpiral";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["SOFT", "WONK", "opsz"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  display: "swap",
  style: ["normal", "italic"],
  axes: ["opsz"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
});

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Femi Siji-Kenneth",
    template: "%s — Femi Siji-Kenneth",
  },
  description:
    "Product leader in Toronto building payment platforms. Thinker. Tinkerer.",
  authors: [{ name: "Femi Siji-Kenneth" }],
  creator: "Femi Siji-Kenneth",
  openGraph: {
    type: "website",
    siteName: "Femi Siji-Kenneth",
    title: "Femi Siji-Kenneth",
    description:
      "Product leader in Toronto building payment platforms. Thinker. Tinkerer.",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Femi Siji-Kenneth",
    description:
      "Product leader in Toronto building payment platforms. Thinker. Tinkerer.",
    creator: "@iFemora",
  },
};

function SiteHeader() {
  return (
    <header className="mx-auto w-full max-w-[1100px] px-6 pt-8 print:hidden">
      <Nav />
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1100px] overflow-hidden px-6 pb-8 pt-24 print:hidden">
      <p className="max-w-[640px] font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
        Building something in the{" "}
        <s className="text-muted">intersection</s>{" "}
        <span className="italic text-accent">messy middle</span> of product
        and payments? Or just want to argue about tennis?{" "}
        <a
          href="mailto:oluwafemiakinseye@gmail.com"
          className="link-swipe whitespace-nowrap text-accent"
        >
          Say hello →
        </a>
      </p>
      <hr className="mb-8 mt-12 border-t border-rule" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <FooterLinks />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Toronto, Canada · 43.65°N, 79.38°W
        </p>
      </div>
      <p
        aria-hidden
        className="wordmark-ghost mt-10 select-none whitespace-nowrap font-serif text-[clamp(3rem,9.5vw,7.5rem)] font-semibold leading-none tracking-tight"
      >
        Femi Siji-Kenneth
      </p>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AccentController />
        <CursorDot />
        <BackgroundSpiral />
        <div aria-hidden className="grain print:hidden" />
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
