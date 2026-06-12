/**
 * The signature mark: an archimedean spiral as an SVG path in a
 * 100×100 viewBox. Shared by the on-page mark, favicon, app icon,
 * OG image, and nav.
 */
export function spiralPath(turns = 2.75, growth = 16, inner = 2): string {
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
