type Props = {
  children: React.ReactNode;
  /** Small mono label above an aside (ignored when pull is set). */
  label?: string;
  /** Render as a centered pull-quote climax instead of a side note. */
  pull?: boolean;
};

/**
 * Two voices set apart from the main column:
 *  - aside (default): a left-ruled, muted note (the asides to readers).
 *  - pull: a large centered pull-quote for a rhetorical climax.
 */
export default function EssayNote({ children, label, pull = false }: Props) {
  if (pull) {
    return (
      <div className="my-12 border-y border-rule py-8 text-center">
        <p className="mx-auto max-w-[30ch] font-serif text-2xl italic leading-snug tracking-tight text-accent sm:text-3xl">
          {children}
        </p>
      </div>
    );
  }

  return (
    <aside className="my-8 border-l-2 border-accent/60 pl-5 sm:pl-6">
      {label && (
        <p className="mb-2 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-accent">
          {label}
        </p>
      )}
      <div className="space-y-3 text-base italic leading-relaxed text-muted sm:text-[1.05rem] [&_p]:my-0">
        {children}
      </div>
    </aside>
  );
}
