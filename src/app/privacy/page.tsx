import type { Metadata } from "next";
import { Reveal, DrawnRule, MaskedLines } from "@femora/design-system";
import { EMAIL } from "@/components/HireMe";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "What ifemora.dev collects about its visitors, what stays on your device, and how to opt out.",
  alternates: { canonical: "/privacy" },
};

/* Drafted on Femi's behalf; logged in docs/review-queue.md. Facts here
   mirror the code: SiteAnalytics (GPC), VideoEmbed (no-cookie YouTube,
   Vimeo dnt), the pre-paint theme script in layout.tsx. Change one,
   change the other. */
const sections: { label: string; body: React.ReactNode }[] = [
  {
    label: "What is collected",
    body: (
      <>
        Page views and a handful of interaction events: which link you used
        to book a call, which palette you picked, whether a video played.
        They reach Google Analytics 4 and Vercel Analytics. Google Analytics
        sets cookies on this domain to tell one visit from the next; Vercel
        Analytics sets none and keeps nothing that identifies you. There is
        no account, no form that stores anything, and no mailing list. The
        search on the Wall of Love runs in your browser, and what you type
        there never leaves it.
      </>
    ),
  },
  {
    label: "What stays on your device",
    body: (
      <>
        Your choice of light or dark, and of palette, is kept in your
        browser&apos;s local storage so the page does not flash on reload.
        Nothing else is stored there, and clearing site data removes it.
      </>
    ),
  },
  {
    label: "Third parties",
    body: (
      <>
        Videos on the reel load from YouTube&apos;s no-cookie domain, or
        from Vimeo with do-not-track on, and only after you press play.
        Booking an intro opens a Google Calendar page under Google&apos;s
        terms. Email goes to a Gmail address. The site runs on Vercel, which
        keeps ordinary server logs.
      </>
    ),
  },
  {
    label: "Opting out",
    body: (
      <>
        If your browser sends the Global Privacy Control signal, Google
        Analytics does not load at all. Blocking third-party scripts or
        cookies works too; the site is built to carry on without them.
        Google also publishes a browser add-on that opts you out of
        Analytics everywhere.
      </>
    ),
  },
  {
    label: "Questions",
    body: (
      <>
        Write to me at{" "}
        <a
          href={`mailto:${EMAIL}`}
          className="text-accent underline underline-offset-4 hover:no-underline"
        >
          {EMAIL}
        </a>
        . This page was last revised on 7 October 2026.
      </>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-[1100px] px-6 py-16 sm:py-24">
      <Reveal immediate>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
          <span className="text-accent">A short list</span> · what this site
          knows about you
        </p>
      </Reveal>
      <MaskedLines
        as="h1"
        lines={[{ text: "Privacy", className: "wonk" }]}
        delay={0.12}
        className="mt-6 font-serif text-[clamp(3.5rem,11vw,8rem)] font-medium leading-[0.95] tracking-tight"
      />
      <MaskedLines
        as="p"
        lines={[
          "A personal site collects less than most, and this is all of it.",
        ]}
        delay={0.28}
        className="mt-6 max-w-[680px] font-serif text-xl italic leading-snug text-muted sm:text-2xl"
      />

      <DrawnRule className="my-14 sm:my-20" immediate delay={0.4} />

      <div className="space-y-12 sm:space-y-14">
        {sections.map((s, i) => (
          <section
            key={s.label}
            className="grid gap-4 sm:grid-cols-[200px_minmax(0,640px)] sm:gap-12"
          >
            <Reveal immediate={i === 0} delay={i === 0 ? 0.45 : 0}>
              <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-muted">
                <span className="text-accent">{String(i + 1).padStart(2, "0")}</span>{" "}
                — {s.label}
              </h2>
            </Reveal>
            <Reveal immediate={i === 0} delay={i === 0 ? 0.5 : 0.05}>
              <p className="text-lg leading-relaxed">{s.body}</p>
            </Reveal>
          </section>
        ))}
      </div>
    </main>
  );
}
