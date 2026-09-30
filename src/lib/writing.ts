import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import externalPostsJson from "@/../content/writing/external.json";

export type PostImage = {
  src: string;
  alt?: string;
};

export type InternalPost = {
  type: "internal";
  slug: string;
  title: string;
  date: string;
  description: string;
  image?: PostImage;
  homepageHidden?: boolean;
};

export type ExternalPost = {
  type: "external";
  href: string;
  source: string;
  title: string;
  date: string;
  description: string;
  image?: PostImage;
  homepageHidden?: boolean;
};

export type WritingItem = InternalPost | ExternalPost;

const WRITING_DIR = path.join(process.cwd(), "content", "writing");

export function getInternalPosts(): InternalPost[] {
  return fs
    .readdirSync(WRITING_DIR)
    .filter((f) => f.endsWith(".mdx") && !f.startsWith("_"))
    .map((f) => {
      const slug = f.replace(/\.mdx$/, "");
      const { data } = matter(
        fs.readFileSync(path.join(WRITING_DIR, f), "utf8")
      );
      return {
        type: "internal" as const,
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        description: data.description ?? "",
        image: data.image,
        homepageHidden: data.homepageHidden,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getExternalPosts(): ExternalPost[] {
  // Cast because an empty JSON array infers never[], which cannot be spread.
  return (externalPostsJson as Omit<ExternalPost, "type">[]).map((p) => ({
    type: "external" as const,
    ...p,
  }));
}

export function getAllWriting(): WritingItem[] {
  return [...getInternalPosts(), ...getExternalPosts()].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getHomepageWriting(limit = 3): WritingItem[] {
  return getAllWriting()
    .filter((item) => !item.homepageHidden)
    .slice(0, limit);
}

export function getInternalPostBySlug(slug: string): InternalPost | undefined {
  return getInternalPosts().find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  // Date-only ISO strings parse as UTC midnight; format in UTC too, or a
  // build west of Greenwich shows the previous month for the 1st.
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}
