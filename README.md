# personal-site

The source of **[ifemora.dev](https://ifemora.dev)** — Femi Siji-Kenneth's personal website.

Built with Next.js, Tailwind, and MDX. Deployed on Vercel with auto-deploy on push to `main`.

---

## Run it locally

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

```bash
npm run build   # production build
npm run lint    # lint
```

---

## Publish a new essay

Essays can live in two places:

1. **On this site** (`ifemora.dev/writing/your-slug`) — owned, no paywall, full styling.
2. **External (Medium, Substack, etc.)** — link out from the writing index.

### To publish an essay on this site

1. Create a new file at `content/writing/your-slug.mdx`:

   ```mdx
   export const metadata = {
     title: "Your essay title",
     date: "2026-05-20",
     description: "One-sentence description used in listings and OG tags.",
   };

   # Your essay title

   Body in Markdown. Use **bold**, *italics*, `inline code`, lists, > blockquotes,
   `---` for hairline rules, and triple-backtick code blocks. All inherit the
   site's typography automatically.
   ```

2. Register the post in `src/lib/writing.ts` by appending to `internalPosts`:

   ```ts
   {
     type: "internal",
     slug: "your-slug",
     title: "Your essay title",
     date: "2026-05-20",
     description: "Same one-line description as the MDX metadata.",
   },
   ```

3. Commit and push:

   ```bash
   git add . && git commit -m "new post: your slug" && git push
   ```

   Vercel will rebuild and deploy in ~60 seconds. The essay is live at
   `https://ifemora.dev/writing/your-slug` and appears on `/writing` plus
   the home page's "Recent writing" section automatically.

### To add a Medium / external piece

Append to `externalPosts` in `src/lib/writing.ts`:

```ts
{
  type: "external",
  href: "https://medium.com/@iFemora/your-post-slug-hash",
  source: "Medium",
  title: "The post title",
  date: "2026-05-01",
  description: "One-line description in your own voice.",
},
```

Commit and push.

---

## Project structure

```
content/writing/        MDX essay sources (one file per post)
public/                 Static assets (currently empty)
src/
  app/
    layout.tsx          Root layout (fonts, header, footer, metadata)
    page.tsx            Home page
    work/page.tsx       /work — five artifact-first case cards
    cv/page.tsx         /cv — long-form designed résumé + print-to-PDF
    writing/page.tsx    /writing — unified index
    writing/[slug]/     Dynamic MDX post route
    icon.tsx            Generated favicon (32×32)
    apple-icon.tsx      Generated apple-touch-icon (180×180)
    opengraph-image.tsx Generated social-share OG image (1200×630)
    sitemap.ts          /sitemap.xml
    robots.ts           /robots.txt
    globals.css         Tailwind v4 @theme tokens + print styles
  components/
    Nav.tsx             Top navigation (client component, active state)
    PrintButton.tsx     "Download as PDF" button on /cv
  lib/
    writing.ts          Writing post manifest + helpers
  mdx-components.tsx    Maps MDX HTML elements → styled React components
next.config.ts          Next.js + MDX config
```

---

## Design tokens

All design tokens live in **`src/app/globals.css`** under the `:root` block and
the `@media (prefers-color-scheme: dark)` block. Tailwind v4 picks them up via
the `@theme inline` directive, so you can use `text-accent`, `bg-foreground`,
`border-rule`, etc. anywhere in JSX.

Fonts are loaded via `next/font/google` in `src/app/layout.tsx`:

- **Display / serif headings:** Fraunces (variable)
- **Body / UI:** Inter

---

## Tech

- Next.js 16 (App Router, Turbopack)
- React 19
- Tailwind v4 (CSS-first `@theme` config)
- `@next/mdx` for MDX essays
- TypeScript

---

## License

Code: do what you like, but please don't lift the design wholesale and pass it
off as your own. The writing is mine.
