import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getInternalPosts,
  getInternalPostBySlug,
  formatPostDate,
} from "@/lib/writing";
import { siteUrl, serializeJsonLd } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getInternalPosts().map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/writing/${slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: ["Femi Siji-Kenneth"],
    },
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  if (!post) notFound();

  const { default: Post } = await import(`@/../content/writing/${slug}.mdx`);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    url: `${siteUrl}/writing/${slug}`,
    mainEntityOfPage: `${siteUrl}/writing/${slug}`,
    ...(post.image && { image: new URL(post.image.src, siteUrl).toString() }),
    author: {
      "@type": "Person",
      name: "Femi Siji-Kenneth",
      url: siteUrl,
    },
  };

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeJsonLd(articleJsonLd) }}
      />
      <p className="text-sm">
        <Link
          href="/writing"
          className="text-muted underline underline-offset-4 hover:text-foreground hover:no-underline"
        >
          ← All writing
        </Link>
      </p>

      <header className="mt-10">
        <h1 className="font-serif text-4xl leading-tight tracking-tight sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-3 font-mono text-sm text-muted">
          {formatPostDate(post.date)}
        </p>
      </header>

      <hr className="my-10 border-t border-rule" />

      <article>
        <Post />
      </article>

      <hr className="mt-16 border-t border-rule" />

      <p className="mt-6 text-sm">
        <Link
          href="/writing"
          className="text-muted underline underline-offset-4 hover:text-foreground hover:no-underline"
        >
          ← All writing
        </Link>
      </p>
    </main>
  );
}
