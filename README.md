# personal-site

The source of **[ifemora.dev](https://ifemora.dev)**, Femi Siji-Kenneth's
personal website: product work and case studies, a long-form CV, essays,
field notes, a photo gallery, a film reel, an interactive payments
explainer, and a wall of love.

Built with Next.js 16 (App Router, Turbopack), React 19, Tailwind v4 and
MDX, on top of a small in-repo design system. Deployed on Vercel with
auto-deploy on push to `main`. CI runs lint, typecheck, build and a
contrast audit on every push and pull request.

`CLAUDE.md` is the working manual: site map, publishing paths, the
design system rules, accessibility standard and conventions. `AGENTS.md`
carries the notes any coding agent must read first. This README is the
short tour.

---

## Run it locally

```bash
npm install
npm run dev            # http://localhost:3000
```

```bash
npm run build          # production build
npm run lint           # eslint
npx tsc --noEmit       # types
npm run audit:contrast # WCAG AA check across all 8 palettes x 2 schemes
```

---

## Where things live

```
content/
  writing/*.mdx         Essays. YAML frontmatter (title, date, description,
                        optional image, homepageHidden). The index is built
                        from frontmatter at build time; nothing to register.
  writing/external.json Pieces that live only elsewhere (Substack etc.)
  field-notes.json      Short notes and voice memos
  gallery.json          Photos, art and books (one toggled view)
  gallery-series.json   Sequenced photo series (/gallery/<slug>)
  studio.json           The film reel
  about-timeline.json   The About page chronology
  wall-of-love.json     The wall
  desk.json             "From the desk" on the home page
  tennis.json           The tennis log (unlisted)
public/                 Media, by section
packages/femora-ds/     @femora/design-system: tokens, utilities, fonts,
                        and the motion primitives (Reveal, DrawnRule,
                        MaskedLines, ProximityType, IdentityFlip,
                        Highlight, Spiral, Magnetic)
src/app/                Routes (App Router). layout.tsx holds fonts,
                        metadata, the sticky nav and the footer.
src/components/         Site components (nav, palette picker, gallery,
                        wall, case-study shell, hire-me block, ...)
src/lib/                Content loaders and helpers
docs/                   Accessibility standard, the Follow the Money
                        playbook and decision log, the review queue,
                        and dated site audits
.pages.yml              Pages CMS schema: Femi edits content JSON and
                        media from pagescms.org; each save is a commit
scripts/                contrast-audit.mjs
```

---

## Publishing

Three paths, all documented in full in `CLAUDE.md`:

1. **Essay on this site.** Add `content/writing/<yyyy-mm-dd-slug>.mdx`
   with frontmatter and a Markdown body (no `# Title` line; the route
   renders the title). Commit and push. It appears on `/writing`, the
   home page, the RSS feed and the sitemap automatically.
2. **External piece.** Prepend to `content/writing/external.json`. Only
   for pieces that are not also published here.
3. **Field note.** Prepend to `content/field-notes.json`, or let the iOS
   Shortcut post to `/api/field-notes`. Gallery photos publish the same
   way through `/api/gallery`. Both endpoints take a bearer secret and
   commit straight to `main`.

Everything in `content/` is also editable without code through Pages CMS.

---

## Design system

Tokens live in `packages/femora-ds/tokens.css` as light/dark pairs
(`--l-*` / `--d-*`) resolved once per scheme; Tailwind v4 picks them up
through `@theme inline`, so `text-accent`, `border-rule`, `font-serif`
and friends work anywhere. Eight palettes (`src/app/palettes.css`)
override only the pairs. Every text pair in every palette and scheme
must clear WCAG 2.2 AA; `npm run audit:contrast` is the gate.

Fonts, loaded through `next/font/google` in `src/app/layout.tsx`:

- **Fraunces** (variable; SOFT, WONK, opsz axes) for display and headings
- **Newsreader** for body and UI
- **IBM Plex Mono** for dates, eyebrows and labels

Motion is built on `motion/react`, kept small, and collapses to instant
under `prefers-reduced-motion`.

---

## License

Code: do what you like, but please don't lift the design wholesale and
pass it off as your own. The writing, photographs and other content are
mine.
