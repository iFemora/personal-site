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

export const internalPosts: InternalPost[] = [];

export const externalPosts: ExternalPost[] = [
  {
    type: "external",
    href: "https://medium.com/@iFemora/the-wrong-scoreboard-5267ed9cb2b8",
    source: "Medium",
    title: "The Wrong Scoreboard",
    date: "2026-04-09",
    description:
      "On Jannik Sinner, Carlos Alcaraz, and why the debate between craft and efficiency was never the real argument.",
    image: {
      src: "https://cdn-images-1.medium.com/max/1024/1*-y43eP1OZ_QsFNudZryaLA.jpeg",
      alt: "Hero image for The Wrong Scoreboard",
    },
  },
  {
    type: "external",
    href: "https://medium.com/@iFemora/go-fetch-6c829f37aa70",
    source: "Medium",
    title: "Go Fetch",
    date: "2026-03-01",
    description:
      "On dog poop, tennis courts, and the words that reveal a nation's unfinished work.",
    image: {
      src: "https://cdn-images-1.medium.com/max/1024/1*U9jTeNq8EwKaweuJch75WQ.png",
      alt: "Hero image for Go Fetch",
    },
  },
  {
    type: "external",
    href: "https://medium.com/@iFemora/making-sense-at-the-edges-a-field-guide-for-people-who-think-in-spirals-c26e22298ae4",
    source: "Medium",
    title:
      "Making Sense at the Edges: A Field Guide for People Who Think in Spirals",
    date: "2025-08-01",
    description:
      "A field guide for spiral thinkers on thriving where chaos meets coordination, with Lagos as the masterclass.",
    image: {
      src: "https://cdn-images-1.medium.com/max/1024/1*n3FcENOJdgPEPPOdK5fbyw.jpeg",
      alt: "Hero image for Making Sense at the Edges",
    },
  },
];

export function getAllWriting(): WritingItem[] {
  return [...internalPosts, ...externalPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getHomepageWriting(limit = 3): WritingItem[] {
  return getAllWriting()
    .filter((item) => !item.homepageHidden)
    .slice(0, limit);
}

export function getInternalPostBySlug(slug: string): InternalPost | undefined {
  return internalPosts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
