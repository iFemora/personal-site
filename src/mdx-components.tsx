import type { MDXComponents } from "mdx/types";
import Link from "next/link";

const components: MDXComponents = {
  h1: ({ children }) => (
    <h1 className="mt-12 mb-4 font-serif text-4xl tracking-tight sm:text-5xl">
      {children}
    </h1>
  ),
  h2: ({ children }) => (
    <h2 className="mt-12 mb-4 font-serif text-2xl tracking-tight sm:text-3xl">
      {children}
    </h2>
  ),
  h3: ({ children }) => (
    <h3 className="mt-8 mb-3 font-serif text-xl tracking-tight">{children}</h3>
  ),
  p: ({ children }) => (
    <p className="my-5 text-base leading-relaxed sm:text-lg">{children}</p>
  ),
  a: ({ children, href }) => {
    const isExternal = href?.startsWith("http");
    if (isExternal) {
      return (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          {children}
        </a>
      );
    }
    return (
      <Link
        href={href ?? "#"}
        className="text-accent underline underline-offset-4 hover:no-underline"
      >
        {children}
      </Link>
    );
  },
  ul: ({ children }) => (
    <ul className="my-5 list-disc space-y-2 pl-6 leading-relaxed marker:text-muted">
      {children}
    </ul>
  ),
  ol: ({ children }) => (
    <ol className="my-5 list-decimal space-y-2 pl-6 leading-relaxed marker:text-muted">
      {children}
    </ol>
  ),
  blockquote: ({ children }) => (
    <blockquote className="my-6 border-l-2 border-accent pl-5 italic text-muted">
      {children}
    </blockquote>
  ),
  hr: () => <hr className="my-12 border-t border-rule" />,
  code: ({ children }) => (
    <code className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-sm">
      {children}
    </code>
  ),
  pre: ({ children }) => (
    <pre className="my-6 overflow-x-auto rounded bg-foreground/5 p-4 font-mono text-sm">
      {children}
    </pre>
  ),
  em: ({ children }) => <em className="italic">{children}</em>,
  strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
