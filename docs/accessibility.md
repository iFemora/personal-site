# Accessibility — the working standard

The target is **WCAG 2.2 AA, applied pragmatically**. This is a personal
site, not audited enterprise software: the goal is that every visitor can
read and operate every page in every theme, not a VPAT. Femi set this
scope on 2026-08-06 after feedback from an accessibility PM colleague
("Industry standard is WCAG 2.2 AA... conformance requires all themes to
be accessible").

## Why "all themes"

WCAG conformance applies to every state a page ships in. The palette
picker creates 8 palettes x 2 schemes = 16 themes, and a visitor landing
on any of them is entitled to a readable page *there* — they cannot be
required to find the picker and switch to a "good" theme. So the
contrast bar applies to every palette, not just the house one.

## What is enforced, and how

### 1. Contrast — `npm run audit:contrast`

`scripts/contrast-audit.mjs` parses the light/dark pairs from
`packages/femora-ds/tokens.css` (house) and `src/app/palettes.css`
(guests) and checks, for every palette in both schemes:

| pair                        | minimum | why                              |
| --------------------------- | ------- | -------------------------------- |
| foreground on background    | 4.5:1   | body text (SC 1.4.3)             |
| muted on background         | 4.5:1   | secondary text, mono labels      |
| each accent on background   | 4.5:1   | links, eyebrows, active states   |
| background on each accent   | 3.0:1   | icons on accent-filled buttons   |

The script exits non-zero on any failure. **Run it whenever a color pair
changes or a palette is added** — that is the whole regression suite.

Baseline established 2026-08-06: 12 failing light-scheme accents were
darkened to clear 4.5:1 (house ochre `#a4731f→#94681c`, house
chartreuse `#7d8c26→#6a7720`, plus eight guest-palette accents; hue
preserved, all changes 2–10% darker). tokens.css changes are mirrored in
the flattened `packages/femora-ds/styles.css` — keep them in sync.

**WARN lines** in the audit are the accent wash: `.accent-wash` mixes
the accent into the paper, strongest at the very top edge and gone by
55% down the viewport. The audit checks text against the wash at *full*
strength, which almost no real text sits on. Accepted as warnings by
policy; if a WARN pair ever hosts real body text at the top of a page,
treat it as a failure.

### 2. Keyboard and focus

- A single house focus style lives in
  `packages/femora-ds/utilities.css` (mirrored in `styles.css`):
  `:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px }`.
  It only appears for keyboard focus — pointer users never see it.
- **Never** use `focus:outline-none` / `outline: none` without an equal
  replacement indicator.
- Interactive things are native elements: `<button>`, `<a>`, `<input>`.
  No clickable divs. Icon-only buttons carry `aria-label`; toggles carry
  `aria-pressed` / `aria-expanded`; the gallery lightbox is
  `role="dialog" aria-modal` and closes on Escape.

### 3. Motion and media

- Every animation respects `prefers-reduced-motion` (site-wide rule,
  predates this doc).
- Images carry real `alt` text (enforced by the content schemas —
  gallery, tennis, wall of love all require `alt`).

## Out of scope, deliberately

Screen-reader flow optimization beyond semantic HTML, AAA criteria,
formal audits/VPAT, and conformance claims for third-party embeds.
These are conscious refusals for a personal site, not oversights.

## When adding new work

1. New palette → pairs in `palettes.css`, then `npm run audit:contrast`
   must pass before it ships.
2. New component → native interactive elements, labels on icon buttons,
   no suppressed focus outline, motion behind `useReducedMotion`.
3. New color token → add the pair, run the audit.
