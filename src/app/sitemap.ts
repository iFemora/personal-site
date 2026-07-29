import type { MetadataRoute } from "next";
import { getInternalPosts } from "@/lib/writing";

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
    "/writing",
    "/cv",
    "/field-notes",
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

  return [...staticRoutes, ...postRoutes];
}
