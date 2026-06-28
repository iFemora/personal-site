# @femora/design-system

The standalone styling layer behind **[ifemora.dev](https://ifemora.dev)** —
the brand's color tokens, fonts, and utility classes, extracted so they can
live independently of the Next.js app.

## What's here

| File | Contents |
| --- | --- |
| `styles.css` | Self-contained entry — `@import`s all three files below. Load this alone (no build step, no Next.js) to get the full styling layer. |
| `fonts.css` | Loads Fraunces, Newsreader, and IBM Plex Mono from Google Fonts and sets the `--font-*` variables. |
| `tokens.css` | Color tokens (light + dark + print), per-section accent rules, the base `body` rule, and the Tailwind v4 `@theme inline` mapping. |
| `utilities.css` | Named brand effects: `.wonk`, `.link-swipe`, `.accent-wash`, `.grain`, `.wordmark-ghost`. |

## How the site consumes it

The live site keeps loading fonts through `next/font` (self-hosted, no layout
shift) and imports only `tokens.css` + `utilities.css` from
`src/app/globals.css` — so fonts are never loaded twice. `fonts.css` exists so
that `styles.css` is fully self-contained for any consumer that has no
`next/font`.

## Design vocabulary

Tailwind v4, CSS-first. The `@theme inline` block in `tokens.css` exposes:

- **Colors:** `bg-background`, `text-foreground`, `text-muted`, `text-accent`,
  `border-rule`. `--accent` swaps per section via `html[data-accent="…"]`
  (home rust · work slate-teal · writing moss · notes ochre · tennis
  chartreuse · gallery umber).
- **Fonts:** `font-serif` (Fraunces — display/headings), `font-sans`
  (Newsreader — body), `font-mono` (IBM Plex Mono — date/metadata).

## Roadmap

This is **Step 1** (styling only) of turning the site into a Claude
Design–syncable design system. Next: decouple the reusable `motion/`
primitives (`Reveal`, `DrawnRule`, `Spiral`, …) from Next.js, add a `tsup`
build that emits `dist/`, then run `/design-sync`.
