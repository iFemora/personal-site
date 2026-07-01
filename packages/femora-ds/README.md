# @femora/design-system

The design system behind **[ifemora.dev](https://ifemora.dev)** — the brand's
motion primitives, signature mark, color tokens, fonts, and utility classes,
decoupled from the Next.js app so they can be rendered, documented, and synced
to Claude Design independently.

## Components

Prop-driven React components. Each is `"use client"`, depends only on
`motion/react` + the CSS tokens, and collapses to instant/static under
`prefers-reduced-motion`. House easing (`EASE = [0.16, 1, 0.3, 1]`) throughout —
"quietly alive": small travel, nothing performs.

| Export | What it does |
| --- | --- |
| `Reveal` | Scroll-triggered fade-rise. `immediate` renders on mount (heroes). |
| `DrawnRule` | Hairline rule that draws itself left-to-right. Use instead of `<hr>`. |
| `MaskedLines` | Type-being-set line reveal for titles/taglines. |
| `ProximityType` | Display type that breathes under the cursor (Fraunces WONK/SOFT/wght axes). Self-contained pointer tracking. |
| `Highlight` | Marker-swipe over a key phrase; draws on scroll into view. |
| `Spiral` | The signature mark — a self-drawing archimedean spiral. `currentColor`. |
| `IdentityFlip` | A pair of words that roll through identities on hover/tap. |
| `Magnetic` | Wraps an element so it leans toward the pointer. Self-contained. |
| `spiralPath` | Pure SVG-path generator for the mark (server-safe). |
| `EASE` | The house easing tuple. |

```tsx
import { Reveal, ProximityType, DrawnRule } from "@femora/design-system";

<ProximityType lines={[{ text: "About", className: "wonk" }]}
  className="font-serif text-6xl" />
<DrawnRule immediate />
<Reveal><p>…</p></Reveal>
```

Pure utilities have a server-safe subpath (no client code pulled in):

```tsx
import { spiralPath } from "@femora/design-system/spiral-path"; // e.g. icon routes
import { EASE } from "@femora/design-system/ease";
```

## Styling layer

| File | Contents |
| --- | --- |
| `styles.css` | Self-contained entry — `@import`s the three below. Load alone (no build, no Next.js) for the full look. |
| `fonts.css` | Loads Fraunces, Newsreader, IBM Plex Mono from Google Fonts; sets the `--font-*` variables. |
| `tokens.css` | Color tokens (light + dark + print), per-section accent rules, base `body` rule, Tailwind v4 `@theme inline` mapping. |
| `utilities.css` | Named brand effects: `.wonk`, `.link-swipe`, `.accent-wash`, `.grain`, `.wordmark-ghost`. |

**Vocabulary** (Tailwind v4, CSS-first):
- **Colors:** `bg-background`, `text-foreground`, `text-muted`, `text-accent`,
  `border-rule`. `--accent` swaps per section via `html[data-accent="…"]`
  (home rust · work slate-teal · writing moss · notes ochre · tennis
  chartreuse · gallery umber).
- **Fonts:** `font-serif` (Fraunces), `font-sans` (Newsreader), `font-mono`
  (IBM Plex Mono).

## Build

`npm run build` (in this package) runs `tsc` → `dist/` (ESM + `.d.ts`). No
bundler, no new dependencies. `react`, `react-dom`, and `motion` are peer deps.

## How the site consumes it

The site resolves `@femora/design-system` to `src/` directly (tsconfig path
alias), so Vercel has no build-order dependency on `dist/` — `dist/` exists
purely as the publishable / Claude-Design–syncable artifact. Fonts still load
through `next/font` in the app (self-hosted, no layout shift); `globals.css`
imports only `tokens.css` + `utilities.css`, so fonts are never loaded twice.

## What stays in the app

`CursorField` (provider), `CursorDot`, and `BackgroundSpiral` remain in the site
— they're environmental (route/scroll/provider-coupled), not reusable surface.
