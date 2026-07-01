# design-sync notes — @femora/design-system

Repo-specific gotchas for the converter + sync run. Read before re-syncing.

## Build & converter invocation

- Shape: **package** (no Storybook). Build: `npm run build --prefix packages/femora-ds` → `tsc` → `packages/femora-ds/dist/index.js`. That file is the `--entry`.
- `--node-modules` → repo-root `./node_modules`. `react`, `react-dom`, and `motion` are peer deps hoisted there; the package has no own `node_modules`.
- `dist/` is **gitignored** (build-only artifact — the live site consumes package *source* via a tsconfig path alias, so Vercel has no build-order dependency on it). Always run `buildCmd` before the converter.

## Styling is Tailwind utility classes, not component CSS — read this

- The components ship **no CSS of their own**. Their entire look is Tailwind v4 utility classes (`bg-rule`, `text-accent`, `font-serif`, `wonk`, …) resolved from the `@theme` tokens in `styles.css`. Expect the build to report `[CSS_PLACEHOLDER]` / `[CSS_RUNTIME]` for `_ds_bundle.css` — that's correct, there's nothing to compile there.
- **Consequence:** static preview cards render largely *unstyled* unless the card environment compiles Tailwind (it doesn't). This is the §4.2 "headless/unstyled DS" case. When authoring `previews/*.tsx`, either add inline styles or accept thin cards. The durable value of the component sync is the **functional bundle + `.d.ts` API contracts + `.prompt.md`**, on top of the always-on-brand **tokens + fonts** from `styles.css`. Don't oversell pixel-perfect component cards.
- Provider: **none** — every component is self-contained (no context). Leave `cfg.provider` unset.

## Fonts

- Loaded via a remote Google Fonts `@import` in `fonts.css` (Fraunces w/ WONK+SOFT+opsz, Newsreader, IBM Plex Mono). Expect `[FONT_REMOTE]` (informational, no action). No local font files to ship, so no `extraFonts` needed.
- `ProximityType` needs the **variable Fraunces** axes `WONK`, `SOFT`, `wght`. `styles.css` requests them.

## Environment

- ESLint is **broken in this environment** (pre-existing `@babel/types` version mismatch — `defineAliasedType is not a function`, fails even on untouched files). Unrelated to the design system. Don't block on it; the TypeScript build is the real gate.
- Upload requires interactive `/design-login` auth — not available in headless/claude.ai-code sessions. Run the sync from an interactive `claude` terminal in this repo.

## Re-sync risks

- `conventions.md` was validated against package **source** (tokens.css / utilities.css / index barrel) on 2026-07-01, not against a built `ds-bundle`. Re-validate its class/token/component names against the built bundle on the first authenticated run.
- Site imports the package via tsconfig `paths` (`@femora/design-system` → `packages/femora-ds/src/index.ts`, plus `/spiral-path` and `/ease` subpaths). If those aliases change, update `srcDir` / the exports.
- No `projectId` recorded yet — set on first project creation during the authenticated run.
