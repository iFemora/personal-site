import Link from "next/link";
import Image from "next/image";
import BookIntroLink from "@/components/BookIntroLink";
import { Reveal } from "@femora/design-system";

/** The one-line positioning statement, reused wherever the signal lives
    so the wording can change in one place. Drafted on Femi's behalf;
    logged in docs/review-queue.md. */
export const SEEKING_LINE =
  "Open to Solutions Architect, Customer Success and Product roles, in Vancouver or remote across Canada.";

export const EMAIL = "hello@ifemora.dev";

const linkClass =
  "link-swipe font-mono text-xs uppercase tracking-[0.18em] text-accent";

/**
 * The recruiter close. Full form sits at the end of the professional
 * pages (home, work, case studies, CV); `compact` is the author card
 * under essays and notes. Part of the "open to work" signal: see
 * Owner status in CLAUDE.md for the removal sweep.
 */
export default function HireMe({
  location,
  compact = false,
}: {
  /** GA `link_location` for the booking click. */
  location: string;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <aside
        aria-label="About the author"
        className="mt-12 flex gap-5 border-t border-rule pt-8"
      >
        <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm border border-rule">
          <Image
            src="/about/femi-profile-2026.jpg"
            alt=""
            fill
            sizes="56px"
            className="object-cover object-[50%_24%] saturate-[0.9]"
          />
        </div>
        <div className="min-w-0">
          <p className="font-serif text-lg leading-snug tracking-tight">
            Femi Siji-Kenneth
          </p>
          <p className="mt-1 text-sm leading-relaxed text-muted">
            Product leader, ten years in payments and banking. {SEEKING_LINE}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-3">
            <BookIntroLink location={location} />
            <Link href="/work" className={linkClass}>
              The work →
            </Link>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <section
      aria-label="Open to new roles"
      className="grid gap-6 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
    >
      <Reveal>
        <p className="inline-flex items-center gap-2.5 font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span aria-hidden className="h-2 w-2 rounded-full bg-accent" />
          Open to new roles
        </p>
      </Reveal>
      <Reveal delay={0.08}>
        <p className="font-serif text-2xl leading-snug tracking-tight sm:text-3xl">
          {SEEKING_LINE}
        </p>
        <p className="mt-4 max-w-[560px] leading-relaxed text-muted">
          Twenty minutes on a call is the quickest way to find out whether
          the fit is real. The calendar link books straight into my week.
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4">
          <BookIntroLink location={location} />
          <Link href="/cv" className={linkClass}>
            Read the CV →
          </Link>
          <a href={`mailto:${EMAIL}`} className={linkClass}>
            Email →
          </a>
        </div>
      </Reveal>
    </section>
  );
}
