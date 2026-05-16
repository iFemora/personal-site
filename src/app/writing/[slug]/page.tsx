import Link from "next/link";
import { notFound } from "next/navigation";
import {
  internalPosts,
  getInternalPostBySlug,
  formatPostDate,
} from "@/lib/writing";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return internalPosts.map((p) => ({ slug: p.slug }));
}

export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = getInternalPostBySlug(slug);
  if (!post) notFound();

  const { default: Post } = await import(`@/../content/writing/${slug}.mdx`);

  return (
    <main className="mx-auto w-full max-w-[680px] px-6 py-16 sm:py-20">
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
