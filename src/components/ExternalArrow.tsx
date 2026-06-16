/**
 * A small diagonal "opens elsewhere" arrow drawn as SVG, so it renders
 * identically across platforms (the ↗ glyph turns into a colored emoji
 * on iOS). Sized in em, inherits color from its parent.
 */
export default function ExternalArrow({
  className = "ml-1 text-muted",
}: {
  className?: string;
}) {
  return (
    <svg
      width="0.62em"
      height="0.62em"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className={`inline-block shrink-0 ${className}`}
      style={{ verticalAlign: "0.04em" }}
    >
      <path
        d="M3.5 8.5 8.5 3.5M8.5 3.5H4.25M8.5 3.5V7.75"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
