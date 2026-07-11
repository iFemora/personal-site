type DecisionArtifactProps = {
  label: string;
  title: string;
  caption: string;
  children: React.ReactNode;
};

export default function DecisionArtifact({
  label,
  title,
  caption,
  children,
}: DecisionArtifactProps) {
  return (
    <figure className="group mt-9 border-y border-rule py-6 sm:py-8">
      <div className="flex items-baseline justify-between gap-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent">
          Working model · {label}
        </p>
        <span
          aria-hidden
          className="font-serif text-2xl italic leading-none text-rule transition-colors duration-500 group-hover:text-accent"
        >
          ↗
        </span>
      </div>
      <h3 className="mt-3 max-w-[24ch] font-serif text-xl leading-snug tracking-tight sm:text-2xl">
        {title}
      </h3>
      <div className="mt-7">{children}</div>
      <figcaption className="mt-6 max-w-[62ch] font-mono text-[10px] uppercase leading-relaxed tracking-[0.14em] text-muted">
        {caption}
      </figcaption>
    </figure>
  );
}
