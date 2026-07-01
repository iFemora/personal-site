# design-sync notes — @femora/design-system

Repo-specific gotchas for the converter + sync run. Read before re-syncing.

## Build & converter invocation

- Shape: **package** (no Storybook). Build: `npm run build --prefix packages/femora-ds` → `tsc` → `packages/femora-ds/dist/index.js`. That file is the `--entry`.
- `--node-modules` → repo-root `./node_modules`. `react`, `react-dom`, and `motion` are peer deps hoisted there; the package has no own `node_modules`.
- `dist/` is **gitignored** (build-only artifact — the live site consumes package *source* via a tsconfig path alias, so Vercel has no build-order dependency on it). Always run `buildCmd` before the converter.
- **Verified locally (2026-07-01):** build discovers **8 components**, `package-validate --no-render-check` exits with **0 errors** (`window.FemoraDS`, all `.d.ts` parse). Exact commands used:
  ```sh
  node .ds-sync/package-build.mjs --config .design-sync/config.json \
    --node-modules ./node_modules --entry ./packages/femora-ds/dist/index.js --out ./ds-bundle
  node .ds-sync/package-validate.mjs ./ds-bundle   # add --no-render-check only if no chromium
  ```

## Two converter gotchas already fixed (don't regress)

- **`package.json` needs top-level `types` (+ `main`/`module`).** The converter's ts-morph `projectFor` reads `pkg.types`/`pkg.typings`, **not** the `exports` map, to find the entry `.d.ts`. Without `"types": "./dist/index.d.ts"` it looks for `index.d.ts` at the package root, finds nothing, and reports `[ZERO_MATCH] no component exports` (0 components). Keep those three fields.
- **`cssEntry` (`styles.css`) must be self-contained.** The converter copies it verbatim to `ds-bundle/_ds_bundle.css`; relative sibling `@import`s (`./fonts.css` …) then dangle → `[CSS_IMPORT_MISSING]`. So `styles.css` is now a **flattened mirror** of `fonts.css` + `tokens.css` + `utilities.css`. Those three partials remain the **site's** source of truth (globals.css imports `tokens.css` + `utilities.css`; fonts come from next/font). **If you edit a partial, mirror the change into `styles.css`.**

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
- `projectId`: **`ed24f584-d1ea-4a7f-85f0-2e6cca502c59`** — project "ifemora.dev Design System", created + first synced 2026-07-01 (44 files, 8 components). Note: a separate, unrelated "Femora's House Design System" project also exists on claude.ai/design — do **not** push this bundle there.
