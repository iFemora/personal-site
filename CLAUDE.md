@AGENTS.md

# Project context

This is the source of **[ifemora.dev](https://ifemora.dev)** — Femi Siji-Kenneth's
personal website. Femi is a Lead Product Manager at Marqeta (payments / fintech),
based in Toronto. He writes essays on Medium (handle `@iFemora`), plays tennis,
and signs the site "Thinker. Tinkerer."

When Femi opens this repo in Claude Code, his typical request is one of:

- "Publish this essay" (he pastes content)
- "Add this Medium link" (URL of a new post)
- "Change X on the site" (copy tweak, layout fix, new section)
- "Why is Y broken" (debugging the deployed site)

**Treat each request as a real task to ship.** Edit, commit, push. Don't ask for
permission for ordinary code changes — push them. Only confirm on destructive
operations (deleting files, rewriting history, changing DNS).

---

# Stack

- **Next.js 16.2 (App Router, Turbopack)** — see `AGENTS.md` warning above
- **React 19**
- **Tailwind v4** with CSS-first `@theme` config in `src/app/globals.css` (no `tailwind.config.ts`)
- **MDX** for on-site essays via `@next/mdx` + a dynamic `[slug]` route
- **TypeScript**, **ESLint**
- Deployed on **Vercel** with auto-deploy on push to `main`
- Repo: **`iFemora/personal-site`** (SSH remote, pushes go to GitHub directly)

---

# Site map

```
/                       Home — hero, bio, 3 work teasers, 3 writing teasers, footer
/about                  Life timeline — "how I got here", dated beats, duotone-ready photos
/work                   5 artifact-first case cards
/cv                     Long-form designed résumé with print-to-PDF button
/writing                Unified index of Medium pieces + on-site MDX posts
/writing/[slug]         Individual MDX post
/field-notes            Short observations + voice memos
/tennis                 Tennis log — match notes, photos, video clips
/gallery                Contact-sheet photo gallery (duotone → color hover, lightbox)
/api/field-notes        POST endpoint hit by the iOS Shortcut for phone publishing
```

**Per-page accents** (html[data-accent], set by `AccentController`):
home rust · work/cv slate-teal · writing moss · notes ochre · tennis muted
chartreuse · gallery umber. New sections claim the next sibling from the
earthy family in `globals.css`.

**Tennis log publishing:** prepend to `content/tennis.json` —
`{ id, date, title?, body?, image?: {src, alt, caption?, width, height}, video?: {src, poster?, caption?} }`.
Media files go in `public/tennis/`.

**About timeline publishing:** edit `content/about-timeline.json` —
`{ id, year, title, caption?, image?: {src, alt} }`. Sorted ascending by
year ("Now" / non-numeric sort last). Photos (in `public/about/`) render
duotone and flood to color on hover, matching the gallery treatment.

**Gallery publishing:** add to `content/gallery.json` —
`{ id, src, alt, caption?, location?, date?, width, height }`. Image files go
in `public/gallery/`. Current frames are labelled placeholders awaiting real
photographs.

---

# Design system

Locked. Don't change tokens without confirming first.

**Colors** (in `src/app/globals.css` `:root` + `prefers-color-scheme: dark`):
- Light: bg `#fafaf7`, text `#1a1a1a`, muted `#6b6b6b`, accent `#8b3a1f` (warm rust), rule `#e5e5e0`
- Dark: bg `#0f0f10`, text `#e8e8e6`, muted `#9b9b98`, accent `#e8997b`, rule `#2a2a2c`

**Fonts** (loaded via `next/font/google` in `src/app/layout.tsx`):
- Display / headings: **Fraunces** (variable serif) → use class `font-serif`
- Body / UI: **Inter** → default, or class `font-sans`
- Date metadata: system monospace stack → class `font-mono`

**Layout:**
- Max content width `max-w-[680px]`, left-aligned, mx-auto
- Hairline rules between sections (`border-t border-rule`)
- Generous vertical rhythm
- No cards / no boxes — just text and hairlines
- Mobile and desktop both use the same single column

**Interaction:**
- Links always underlined (`underline underline-offset-4`)
- Hover: color shifts to `text-accent` and underline often removed
- External links get a small `↗` glyph

**Motion system** (`src/components/motion/`, built on `motion/react` + `lenis`):
- Philosophy: "quietly alive" — small travel (8–14px), house easing `[0.16, 1, 0.3, 1]`, nothing performs
- `Reveal` — scroll-triggered fade-rise (or `immediate` for above-the-fold)
- `DrawnRule` — hairline rules draw themselves left-to-right; use instead of raw `<hr>`
- `MaskedLines` — type-being-set line reveal for page titles/taglines
- `Spiral` — the signature mark; draws beside the home tagline ("thinks in spirals")
- `BackgroundSpiral` — huge ghost spiral behind the page; rotates with scroll, drifts toward cursor
- `ProximityType` — hero type that breathes under the cursor (per-letter Fraunces variable axes)
- `IdentityFlip` — tagline words roll through Femi's identities on hover/tap
- `Highlight` — marker-swipe over key phrases, draws on scroll into view
- `CursorDot` + `Magnetic` — accent dot trails pointer, nav leans toward it (desktop only)
- `src/app/template.tsx` — soft page-entrance transition on route change
- NO scroll-hijacking: Lenis was added and removed (Femi found it laggy). Never re-add smooth-scroll libraries.
- The spiral (src/lib/spiralPath.ts) IS the logo — favicon, apple-icon, OG image, nav mark all use it. No F-in-a-box.
- ALL motion respects `prefers-reduced-motion` (collapses to instant/static)
- New sections must use these primitives, not ad-hoc animations
- `/cv` is intentionally static (print-to-PDF page)

---

# How to publish — three paths

## 1. New on-site essay (preferred for new writing)

User pastes the essay content. You:

1. Pick a slug like `2026-07-12-essay-title`.
2. Create `content/writing/<slug>.mdx` with:
   ```mdx
   export const metadata = {
     title: "The essay title",
     date: "2026-07-12",
     description: "One-sentence description.",
   };

   # The essay title

   …body in Markdown…
   ```
3. Append to `internalPosts` in `src/lib/writing.ts` with matching slug/title/date/description.
4. Commit (`new post: <title>`) and push.

**Note:** `content/writing/_template.mdx` is a build-only file. Do not delete it.
Turbopack's dynamic-import glob needs at least one `.mdx` in the folder to resolve.

## 2. New Medium / external piece

Append to `externalPosts` in `src/lib/writing.ts`:

```ts
{
  type: "external",
  href: "https://medium.com/@iFemora/...",
  source: "Medium",
  title: "Post title",
  date: "YYYY-MM-DD",
  description: "One-sentence description.",
  image: {
    src: "https://cdn-images-1.medium.com/...",
    alt: "Hero image for <title>",
  },
},
```

To get the image URL, fetch Medium's RSS at `https://medium.com/feed/@iFemora`
and pull the first `<img src>` from the matching `<content:encoded>` block.

Commit (`new post: <title>`) and push.

## 3. New field note (text or audio)

Prepend to the array in `content/field-notes.json`:

```json
{
  "id": "YYYY-MM-DD-HHMM-some-slug",
  "date": "YYYY-MM-DD",
  "body": "Optional plain text. Double newlines\n\nbreak into paragraphs.",
  "audio": {
    "src": "/field-notes/audio/<id>.m4a",
    "title": "Optional title"
  }
}
```

Commit (`field note: <title>`) and push. For audio notes, the file must
already be in `public/field-notes/audio/`.

The iOS Shortcut "Publish Field Note" handles this automatically via
`POST /api/field-notes`, so most audio notes won't go through Claude Code.

---

# Conventions

- **Always run `git add` + `git commit` + `git push` together** after a change. Single commit per logical change.
- Commit messages: imperative, lowercase first word, ~50 chars first line, optional body. No "claude" / "AI" mentions in commit messages.
- **Don't add comments** unless the why is non-obvious.
- **Don't add features the user didn't ask for** (e.g., don't sneak in a "Newsletter" component while fixing the home page).
- **Always use the Femora design system.** New components use existing tokens (`text-accent`, `border-rule`, `font-serif`, etc.), not new colors.
- **Mobile-first responsive.** Use `sm:` (640px+) for desktop adjustments.

---

# Voice

Femi's writing voice — useful when drafting copy on his behalf:

- Editorial, slightly literary
- Comfortable with subordinate clauses; not breezy
- Subtle neurodivergence ("think in spirals") — never clinical
- Self-aware but not self-deprecating
- Concrete details over abstractions ("$30M annualized volume" not "significant revenue impact")
- Reads his own essays for cues — his essay titles ("The Wrong Scoreboard", "Making Sense at the Edges") are the closest reference

Don't generate content in his voice without confirming first. Drafts are fine
to offer; never assume a tagline or paragraph is what he'd actually write.

---

# Don'ts

- Don't restore deleted welcome posts.
- Don't change design tokens (colors, fonts, layout width) without confirming.
- Don't push secrets to the repo. `GITHUB_PAT` and `FIELD_NOTES_SECRET` live in Vercel env vars only.
- Don't bypass git hooks. If a hook fails, fix the underlying issue.
- Don't run `npm install` of new packages without confirming. New deps = audit risk.

---

# Common gotchas

- **Tailwind v4** uses `@theme inline` in CSS, not `tailwind.config.ts`. Adding a new color token means editing `src/app/globals.css`.
- **Dynamic MDX import** (`src/app/writing/[slug]/page.tsx`) requires at least one `.mdx` file in `content/writing/`. `_template.mdx` exists for this reason.
- **`next/image` remote patterns** in `next.config.ts` must list any new image host. Currently allows `cdn-images-1.medium.com` and `miro.medium.com`.
- **`metadataBase`** in `src/app/layout.tsx` reads `NEXT_PUBLIC_SITE_URL` env var. Production value is `https://ifemora.dev`.
