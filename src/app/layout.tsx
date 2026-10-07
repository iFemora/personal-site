import type { Metadata } from "next";
import { Fraunces, Newsreader, IBM_Plex_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import SiteAnalytics from "@/components/SiteAnalytics";
import Nav from "@/components/Nav";
import FooterLinks, { FooterClose } from "@/components/FooterLinks";
import AccentController from "@/components/AccentController";
import CursorDot from "@/components/motion/CursorDot";
import BackgroundSpiral from "@/components/motion/BackgroundSpiral";
import { CursorFieldProvider } from "@/components/motion/CursorField";
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
    default: "Femi Siji-Kenneth — Product leader, payments and banking",
    template: "%s — Femi Siji-Kenneth",
  },
  description:
    "Femi Siji-Kenneth designs the product and builds the systems beneath it: payments, banking, regulated platforms. Open to founding and senior product roles, Vancouver or remote across Canada.",
  authors: [{ name: "Femi Siji-Kenneth" }],
  creator: "Femi Siji-Kenneth",
  openGraph: {
    type: "website",
    siteName: "Femi Siji-Kenneth",
    title: "Femi Siji-Kenneth — Product leader, payments and banking",
    description:
      "Femi Siji-Kenneth designs the product and builds the systems beneath it: payments, banking, regulated platforms. Open to founding and senior product roles, Vancouver or remote across Canada.",
    locale: "en_CA",
  },
  twitter: {
    card: "summary_large_image",
    title: "Femi Siji-Kenneth — Product leader, payments and banking",
    description:
      "Femi Siji-Kenneth designs the product and builds the systems beneath it: payments, banking, regulated platforms. Open to founding and senior product roles, Vancouver or remote across Canada.",
    creator: "@iFemora",
  },
};

function SiteHeader() {
  // Sticky sitewide: one full-bleed sheet of frosted paper (Femi: "liquid
  // glass") spanning the whole viewport at every size, so content scrolls
  // under glass instead of appearing between floating controls. Strong
  // blur + a touch of saturation keep it feeling like part of the page
  // rather than a lid on it; the hairline is the surface's bottom edge.
  return (
    <header className="sticky top-0 z-40 w-full border-b border-rule/60 bg-background/70 backdrop-blur-xl backdrop-saturate-150 print:hidden">
      <div className="mx-auto w-full max-w-[1100px] px-6 pb-4 pt-5">
        <Nav />
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[1100px] overflow-hidden px-6 pb-8 pt-24 print:hidden">
      {/* The playful ask closes the personality pages; the professional
          pages already end on the hire-me block, so there it steps aside. */}
      <FooterClose />
      <hr className="mb-8 mt-12 border-t border-rule" />
      <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <FooterLinks />
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          Vancouver, Canada · 49.28°N, 123.12°W
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
  // GA only loads when NEXT_PUBLIC_GA_ID is set (Vercel env), so local dev
  // traffic never reaches the property; SiteAnalytics also skips visitors
  // who send Global Privacy Control, as /privacy promises.
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${newsreader.variable} ${plexMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        {/* Apply the saved theme and palette before anything paints, so a
            reload never flashes the wrong colors. Runs synchronously,
            fails silently. */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              'try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t;var p=localStorage.getItem("palette");if(["ink","ember","riso","chalk","tide","grove","cobalt"].indexOf(p)>-1)document.documentElement.dataset.palette=p}catch(e){}',
          }}
        />
        <a href="#content" className="skip-link print:hidden">
          Skip to content
        </a>
        <CursorFieldProvider>
          <AccentController />
          <CursorDot />
          <div aria-hidden className="accent-wash print:hidden" />
          <BackgroundSpiral />
          <div aria-hidden className="grain print:hidden" />
          <div className="relative z-10 flex min-h-full flex-1 flex-col">
            <SiteHeader />
            <div id="content" tabIndex={-1} className="flex-1 outline-none">
              {children}
            </div>
            <SiteFooter />
          </div>
        </CursorFieldProvider>
        <Analytics />
        {gaId && <SiteAnalytics gaId={gaId} />}
      </body>
    </html>
  );
}
