import type { MetadataRoute } from "next";
import { getInternalPosts } from "@/lib/writing";
import { getSeries } from "@/lib/gallerySeries";

export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const staticRoutes = [
    "",
    "/about",
    "/work",
    "/work/resolve",
    "/work/corporate-banking",
    "/work/farmcrowdy",
    "/work/airline-payments",
    "/work/product-team",
    "/follow-the-money",
    "/writing",
    "/cv",
    "/field-notes",
    "/tennis",
    "/gallery",
    "/love",
    "/colophon",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1.0 : 0.7,
  }));

  const postRoutes = getInternalPosts().map((p) => ({
    url: `${siteUrl}/writing/${p.slug}`,
    lastModified: new Date(p.date),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  const seriesRoutes = getSeries().map((s) => ({
    url: `${siteUrl}/gallery/${s.slug}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...postRoutes, ...seriesRoutes];
}
