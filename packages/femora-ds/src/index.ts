/**
 * @femora/design-system — the motion & mark primitives behind ifemora.dev.
 *
 * "Quietly alive": small travel, the house EASE, nothing performs. Every
 * primitive respects prefers-reduced-motion. Pair with the package's
 * styles.css (tokens, fonts, utilities) for the full look.
 */

export { Reveal, type RevealProps } from "./components/Reveal";
export { DrawnRule, type DrawnRuleProps } from "./components/DrawnRule";
export { MaskedLines, type MaskedLinesProps } from "./components/MaskedLines";
export { Highlight, type HighlightProps } from "./components/Highlight";
export { Spiral, type SpiralProps } from "./components/Spiral";
export {
  ProximityType,
  type ProximityTypeProps,
} from "./components/ProximityType";
export { IdentityFlip, type IdentityFlipProps } from "./components/IdentityFlip";
export { Magnetic, type MagneticProps } from "./components/Magnetic";

export { EASE } from "./lib/ease";
export { spiralPath } from "./lib/spiralPath";
