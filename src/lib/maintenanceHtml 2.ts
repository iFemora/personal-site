/**
 * A self-contained "out, briefly" page served by middleware for every
 * route while the site is dark. No same-origin asset dependencies, so it
 * works even when middleware intercepts everything (including /_next).
 */

// Archimedean spiral path in a 100×100 box — same mark as the live site.
function buildSpiral(turns = 2.75, growth = 16, inner = 2): string {
  const cx = 50;
  const cy = 50;
  const b = growth / (2 * Math.PI);
  const steps = 140;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const theta = (i / steps) * turns * 2 * Math.PI;
    const r = inner + b * theta;
    const x = cx + r * Math.cos(theta);
    const y = cy + r * Math.sin(theta);
    pts.push(`${i === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`);
  }
  return pts.join(" ");
}

const SPIRAL_D = buildSpiral();

const GRAIN =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E";

export function maintenanceHtml(): string {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>Femi Siji-Kenneth — back soon</title>
<meta property="og:title" content="Femi Siji-Kenneth — out, briefly" />
<meta property="og:description" content="The site's in the back, getting edited. Back soon." />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;1,9..144,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet" />
<style>
  :root {
    --bg: #faf7f0;
    --fg: #1f1b16;
    --muted: #6f675c;
    --accent: #9a3b1e;
    --rule: #e2dccf;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #16120e;
      --fg: #ece6da;
      --muted: #9a9183;
      --accent: #e8997b;
      --rule: #2e2920;
    }
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  html, body { height: 100%; }
  body {
    background: var(--bg);
    color: var(--fg);
    font-family: "Fraunces", Georgia, serif;
    -webkit-font-smoothing: antialiased;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    overflow: hidden;
  }
  .wrap {
    position: relative;
    z-index: 2;
    max-width: 640px;
    width: 100%;
  }
  .eyebrow {
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.72rem;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 0.7rem;
  }
  .eyebrow .dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--accent);
    animation: pulse 2.4s ease-in-out infinite;
  }
  @keyframes pulse { 0%,100% { opacity: .35 } 50% { opacity: 1 } }
  .spiral { width: 56px; height: 56px; margin: 2rem 0 1.6rem; color: var(--accent); display: block; }
  .spiral path {
    stroke: currentColor; stroke-width: 5; fill: none; stroke-linecap: round;
    stroke-dasharray: 1; stroke-dashoffset: 1;
    animation: draw 2.4s cubic-bezier(0.16,1,0.3,1) forwards, spin 60s linear infinite 2.4s;
    transform-origin: 50% 50%;
  }
  @keyframes draw { to { stroke-dashoffset: 0 } }
  @keyframes spin { to { transform: rotate(360deg) } }
  h1 {
    font-weight: 500;
    font-size: clamp(3rem, 11vw, 6rem);
    line-height: 0.98;
    letter-spacing: -0.02em;
    font-variation-settings: "WONK" 1, "SOFT" 4;
  }
  h1 em { font-style: italic; color: var(--accent); }
  .lede {
    margin-top: 1.6rem;
    font-size: clamp(1.1rem, 2.4vw, 1.4rem);
    line-height: 1.55;
    color: var(--fg);
    max-width: 30em;
  }
  .sign {
    margin-top: 2rem;
    font-style: italic;
    color: var(--muted);
    font-size: 1.05rem;
  }
  .hello {
    margin-top: 2.6rem;
    font-family: "IBM Plex Mono", monospace;
    font-size: 0.72rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .hello a {
    color: var(--accent);
    text-decoration: underline;
    text-underline-offset: 4px;
  }
  .hello a:hover { text-decoration: none; }
  .grain {
    position: fixed; inset: -50%; width: 200%; height: 200%;
    z-index: 1; pointer-events: none;
    opacity: 0.5; mix-blend-mode: overlay;
    background-image: url("${GRAIN}");
    animation: grain 1.6s steps(8) infinite;
  }
  @media (prefers-color-scheme: dark) {
    .grain { mix-blend-mode: soft-light; opacity: 0.65; }
  }
  @keyframes grain {
    0%,100% { transform: translate(0,0) }
    25% { transform: translate(-1.5%, 1.2%) }
    50% { transform: translate(1.4%, -1.3%) }
    75% { transform: translate(-1.2%, -0.8%) }
  }
  @media (prefers-reduced-motion: reduce) {
    .spiral path { animation: draw 0.01s forwards; }
    .grain, .eyebrow .dot { animation: none; }
  }
</style>
</head>
<body>
  <div class="grain" aria-hidden="true"></div>
  <main class="wrap">
    <p class="eyebrow"><span class="dot"></span> ifemora.dev — back soon</p>
    <svg class="spiral" viewBox="0 0 100 100" aria-hidden="true"><path pathLength="1" d="${SPIRAL_D}" /></svg>
    <h1>Out, <em>briefly.</em></h1>
    <p class="lede">
      I&rsquo;m in the back, editing &mdash; some of what lived here deserved
      better words, and a few deserved fewer. The doors reopen once the
      sentences can stand on their own.
    </p>
    <p class="sign">&mdash; Femi, thinking in spirals as usual</p>
    <p class="hello">
      Need me sooner? <a href="mailto:oluwafemiakinseye@gmail.com">say hello</a>
    </p>
  </main>
</body>
</html>`;
}
