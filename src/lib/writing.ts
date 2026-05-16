export type InternalPost = {
  type: "internal";
  slug: string;
  title: string;
  date: string;
  description: string;
};

export type ExternalPost = {
  type: "external";
  href: string;
  source: string;
  title: string;
  date: string;
  description: string;
};

export type WritingItem = InternalPost | ExternalPost;

export const internalPosts: InternalPost[] = [
  {
    type: "internal",
    slug: "welcome",
    title: "A placeholder post (so the system works).",
    date: "2026-05-16",
    description:
      "Documentation for the on-site publishing setup. Delete this when you publish your first real essay.",
  },
];

export const externalPosts: ExternalPost[] = [
  {
    type: "external",
    href: "https://medium.com/@iFemora/the-wrong-scoreboard-5267ed9cb2b8",
    source: "Medium",
    title: "The Wrong Scoreboard",
    date: "2026-04-01",
    description:
      "On Jannik Sinner, Carlos Alcaraz, and why the debate between craft and efficiency was never the real argument.",
  },
  {
    type: "external",
    href: "https://medium.com/@iFemora/go-fetch-6c829f37aa70",
    source: "Medium",
    title: "Go Fetch",
    date: "2026-03-01",
    description:
      "On dog poop, tennis courts, and the words that reveal a nation's unfinished work.",
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
  },
];

export function getAllWriting(): WritingItem[] {
  return [...internalPosts, ...externalPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getInternalPostBySlug(slug: string): InternalPost | undefined {
  return internalPosts.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", { month: "long", year: "numeric" });
}
