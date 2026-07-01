# Femora design system — how to build with it

The look behind ifemora.dev: warm paper, one earthy accent per section, a
serif display face, and motion that's "quietly alive" (small travel, a single
house easing, nothing performs). This is a **Tailwind v4, CSS-first** system —
you style with utility classes backed by design tokens, not with component
style props.

## Setup — load the tokens, or everything renders unstyled

The components carry no CSS of their own; their look comes entirely from the
token/utility layer in `styles.css`. Import it once at the app root **and run
Tailwind v4** so the `@theme` tokens compile into utilities:

```css
@import "tailwindcss";
@import "@femora/design-system/styles.css"; /* tokens, fonts, utilities */
```

No provider or context wrapper is needed — every component is self-contained.
Set the section accent by putting `data-accent` on `<html>`:
`home` (default rust) · `work` · `writing` · `notes` · `tennis` · `gallery`.

## The styling vocabulary (real names)

Color utilities (from the `@theme inline` block in `tokens.css`):

| Utility | Meaning |
| --- | --- |
| `bg-background` / `text-foreground` | paper + ink (auto light/dark) |
| `text-muted` | secondary text |
| `text-accent` / `bg-accent` | the section accent (swaps via `data-accent`) |
| `border-rule` | hairline rules and borders |

Fonts: `font-serif` (Fraunces — display/headings), `font-sans` (Newsreader —
body, the default), `font-mono` (IBM Plex Mono — dates/metadata). Named brand
effects (from `utilities.css`): `wonk` (hand-set Fraunces axes), `link-swipe`
(marker-swipe link hover), `accent-wash`, `grain`, `wordmark-ghost`.

Layout house style: single left-aligned column, `max-w-[680px]` content,
hairline `border-t border-rule` between sections, no cards/boxes — just type
and rules. Links are underlined (`underline underline-offset-4`); hover shifts
to `text-accent`.

## Components (all `"use client"`, all respect `prefers-reduced-motion`)

`Reveal` (scroll fade-rise; `immediate` for heroes) · `DrawnRule` (self-drawing
hairline, use instead of `<hr>`) · `MaskedLines` (line-by-line title reveal) ·
`ProximityType` (display type that breathes under the cursor) · `Highlight`
(marker-swipe over a phrase) · `Spiral` (the signature mark; colored by
`currentColor`) · `IdentityFlip` (words that roll through identities on hover) ·
`Magnetic` (leans toward the pointer).

`ProximityType` needs a **variable Fraunces** face with the `WONK`, `SOFT`, and
`wght` axes — `styles.css` loads it. Without those axes it still reads, just
without the weight/wonk breathing.

## One idiomatic build

```tsx
import { ProximityType, DrawnRule, Reveal } from "@femora/design-system";

<main className="mx-auto max-w-[680px] px-6">
  <ProximityType
    lines={[{ text: "About", className: "wonk" }]}
    className="font-serif text-6xl font-medium tracking-tight"
  />
  <DrawnRule className="my-12" immediate />
  <Reveal>
    <p className="text-lg leading-relaxed text-foreground">
      Body copy in Newsreader; <a className="link-swipe text-accent">a link</a>.
    </p>
  </Reveal>
</main>
```

The source of truth for the look is `styles.css` and its imports
(`tokens.css`, `fonts.css`, `utilities.css`) — read those before styling.
