import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import Nav from "@/components/Nav";
import FooterLinks from "@/components/FooterLinks";
import CursorDot from "@/components/motion/CursorDot";
import SmoothScroll from "@/components/motion/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
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
    <header className="mx-auto w-full max-w-[680px] px-6 pt-8 print:hidden">
      <Nav />
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="mx-auto w-full max-w-[680px] px-6 pb-12 pt-16 print:hidden">
      <hr className="mb-6 border-t border-rule" />
      <FooterLinks />
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
      className={`${fraunces.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SmoothScroll>
          <CursorDot />
          <SiteHeader />
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </SmoothScroll>
      </body>
    </html>
  );
}
