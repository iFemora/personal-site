import { getAllWriting } from "@/lib/writing";
import { siteUrl } from "@/lib/seo";

export const dynamic = "force-static";

const escapeXml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/** One feed for the whole writing index: on-site essays link here,
    Substack pieces link to Substack, so a reader follows one URL. */
export function GET() {
  const items = getAllWriting()
    .map((item) => {
      const link =
        item.type === "external" ? item.href : `${siteUrl}/writing/${item.slug}`;
      const description =
        item.type === "external"
          ? `${item.description} (${item.source})`
          : item.description;
      return [
        "<item>",
        `<title>${escapeXml(item.title)}</title>`,
        `<link>${escapeXml(link)}</link>`,
        `<guid isPermaLink="true">${escapeXml(link)}</guid>`,
        `<pubDate>${new Date(item.date).toUTCString()}</pubDate>`,
        `<description>${escapeXml(description)}</description>`,
        "</item>",
      ].join("");
    })
    .join("");

  const xml =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom"><channel>` +
    `<title>Femi Siji-Kenneth — Writing</title>` +
    `<link>${siteUrl}/writing</link>` +
    `<atom:link href="${siteUrl}/writing/rss.xml" rel="self" type="application/rss+xml"/>` +
    `<description>Essays from the long way around. Pieces published on this site and on Substack.</description>` +
    `<language>en-CA</language>` +
    items +
    `</channel></rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
