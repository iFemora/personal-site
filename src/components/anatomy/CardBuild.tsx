"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useReducedMotion } from "motion/react";
import { EASE } from "@femora/design-system/ease";
import { anatomyEvent } from "@/lib/anatomyTrack";
import IssuerReplay from "@/components/anatomy/IssuerReplay";
import {
  COMPANIES,
  ENDINGS,
  FUNDING,
  ONE_HOUSE_NOTE,
  SEATS,
  type Company,
  type FundingKey,
  type SeatKey,
} from "@/lib/cardBuild";

/* Act IV, release one: the build sheet. User-paced by construction
   (pills and doors, no clocks), so the smoothness bar is met without a
   single keyframe. Release two opened the issuer stop on the Act I rail;
   release three ends on who is on the hook for the card you built. */

const pillClass = (on: boolean) =>
  `relative rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] transition-colors duration-300 ${
    on ? "border-accent text-accent" : "border-rule text-muted hover:text-foreground"
  }`;

function Thumb({ id }: { id: string }) {
  return (
    <motion.span
      layoutId={id}
      aria-hidden
      className="absolute inset-0 rounded-full bg-accent/10"
      transition={{ duration: 0.35, ease: EASE }}
    />
  );
}

export default function CardBuild() {
  const reduced = useReducedMotion();
  const [company, setCompany] = useState<Company>(COMPANIES[0]);
  const [openSeat, setOpenSeat] = useState<SeatKey | null>(null);
  const [fundingKey, setFundingKey] = useState<FundingKey>(COMPANIES[0].funding[0]);

  const funding = FUNDING.find((f) => f.key === fundingKey) ?? FUNDING[0];
  const options = FUNDING.filter((f) => company.funding.includes(f.key));
  const ending = ENDINGS[funding.key];

  /* The ending is the act's completion beacon: once per visit, with the
     card it was reached on. */
  const endRef = useRef<HTMLDivElement>(null);
  const endInView = useInView(endRef, { once: true, margin: "0px 0px -20% 0px" });
  const endSent = useRef(false);
  useEffect(() => {
    if (!endInView || endSent.current) return;
    endSent.current = true;
    anatomyEvent("anatomy_build_end", { company: company.key, funding: funding.key });
  }, [endInView, company.key, funding.key]);

  const pickCompany = (c: Company) => {
    setCompany(c);
    if (!c.funding.includes(fundingKey)) setFundingKey(c.funding[0]);
    anatomyEvent("anatomy_build_company", { company: c.key });
  };

  const toggleSeat = (key: SeatKey) => {
    const next = openSeat === key ? null : key;
    setOpenSeat(next);
    if (next) anatomyEvent("anatomy_build_seat_opened", { seat: key });
  };

  const pickFunding = (key: FundingKey) => {
    setFundingKey(key);
    anatomyEvent("anatomy_build_funding", { company: company.key, funding: key });
  };

  const seatRow = (seat: (typeof SEATS)[number], index: number, inHouse: boolean) => {
    const open = openSeat === seat.key;
    return (
      <li key={seat.key} className="border-b border-rule">
        <div className="grid gap-3 py-5 sm:grid-cols-[2.5rem_minmax(0,1fr)] sm:gap-5">
          <span className="font-mono text-[11px] tracking-[0.18em] text-accent sm:pt-1">
            {String(index).padStart(2, "0")}
          </span>
          <div>
            <h3 className="font-serif text-xl leading-snug tracking-tight">
              {inHouse && seat.key !== "network" ? (
                <>
                  {seat.name}{" "}
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em] text-muted">
                    · in house
                  </span>
                </>
              ) : (
                seat.name
              )}
            </h3>
            <p className="mt-1.5 text-[15px] leading-relaxed">{seat.role}</p>
            <p className="mt-2 text-[13px] leading-relaxed text-muted">
              <span className="font-mono text-[11px] uppercase tracking-[0.15em]">
                {inHouse && seat.inHouse ? "In house" : "Asks of you"}
              </span>{" "}
              · {inHouse && seat.inHouse ? seat.inHouse : seat.asks}
            </p>
            <button
              type="button"
              aria-expanded={open}
              onClick={() => toggleSeat(seat.key)}
              className="mt-3 font-mono text-[11px] uppercase tracking-[0.15em] text-accent transition-colors duration-300 hover:text-foreground"
            >
              {open ? "close −" : "go deeper +"}
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key={seat.key}
                  initial={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  animate={reduced ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                  exit={reduced ? { opacity: 0 } : { height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="overflow-hidden"
                >
                  <div className="mt-5 border-t border-rule pt-5">
                    <h4 className="font-serif text-lg leading-snug tracking-tight">
                      {seat.depth.title}
                    </h4>
                    <p className="mt-2 max-w-[560px] font-serif italic leading-relaxed text-muted">
                      {seat.depth.intro}
                    </p>
                    <dl className="mt-5 space-y-5">
                      {seat.depth.sections.map((s) => (
                        <div key={s.label}>
                          <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                            {s.label}
                          </dt>
                          <dd className="mt-2 max-w-[560px] text-[15px] leading-relaxed">
                            {s.body}
                          </dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </li>
    );
  };

  return (
    <section className="mt-10">
      {/* 1. Who are you */}
      <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
        First, choose who you are
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        {COMPANIES.map((c) => {
          const on = c.key === company.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-pressed={on}
              onClick={() => pickCompany(c)}
              className={pillClass(on)}
            >
              {on && <Thumb id="build-company-thumb" />}
              <span className="relative">{c.label}</span>
            </button>
          );
        })}
      </div>
      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={company.key}
          initial={reduced ? { opacity: 1 } : { opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="mt-4 max-w-[560px] font-serif text-lg italic leading-snug text-muted"
        >
          {company.purpose}
        </motion.p>
      </AnimatePresence>

      {/* 2. The cast */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          {company.oneHouse ? "The house you already are" : "The cast you must recruit"}
        </p>
        <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
          {company.oneHouse
            ? ONE_HOUSE_NOTE
            : "Four seats, and you fill only the last. Each one asks something of you before your first card can tap."}
        </p>
        <ol className="mt-5 max-w-[640px] border-t border-rule">
          {SEATS.map((seat, i) => seatRow(seat, i + 1, company.oneHouse))}
        </ol>
      </div>

      {/* 3. Where the money sits */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Then, decide where the money sits
        </p>
        <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
          This is the choice that decides who is on the hook. Act II showed
          that no money moves at the tap; here is where it was waiting.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((f) => {
            const on = f.key === funding.key;
            return (
              <button
                key={f.key}
                type="button"
                aria-pressed={on}
                onClick={() => pickFunding(f.key)}
                className={pillClass(on)}
              >
                {on && <Thumb id="build-funding-thumb" />}
                <span className="relative">{f.label}</span>
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`${company.key}-${funding.key}`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-6 max-w-[640px] border-y border-rule"
          >
            <dl className="grid sm:grid-cols-2">
              <div className="border-b border-rule py-5 sm:border-b-0 sm:border-r sm:pr-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  The night before
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">{funding.nightBefore}</dd>
              </div>
              <div className="py-5 sm:pl-6">
                <dt className="font-mono text-[11px] uppercase tracking-[0.2em] text-muted">
                  At the tap
                </dt>
                <dd className="mt-2 text-[15px] leading-relaxed">{funding.atTap}</dd>
              </div>
            </dl>
            <div className="border-t border-rule py-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
                On the hook
              </p>
              <p className="mt-2 text-[15px] leading-relaxed">{funding.hook}</p>
              {funding.forYou[company.key] && (
                <p className="mt-3 text-[13px] leading-relaxed text-muted">
                  <span className="font-mono text-[11px] uppercase tracking-[0.15em]">
                    For {company.label.toLowerCase()}
                  </span>{" "}
                  · {funding.forYou[company.key]}
                </p>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* 4. The first tap, replayed (release two) */}
      <div className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Then, replay the first tap
        </p>
        <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
          Act I gave the issuer nine hundred milliseconds and drew it as one
          stop. Here it is opened up, for the card you just built: the
          machine that answers, the seat that is sometimes asked, and the
          book that remembers.
        </p>
        <IssuerReplay
          key={`${company.key}-${funding.key}`}
          company={company}
          funding={funding}
        />
      </div>

      {/* 5. Who is on the hook (release three) */}
      <div ref={endRef} className="mt-12">
        <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-accent">
          Finally, who is on the hook
        </p>
        <p className="mt-2 max-w-[560px] text-[15px] leading-relaxed text-muted">
          The question this page carries, answered for the card you built.
          Three nights it could fail, and who pays on each.
        </p>
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={`end-${company.key}-${funding.key}`}
            initial={reduced ? { opacity: 1 } : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="mt-6 max-w-[640px]"
          >
            <dl className="border-t border-rule">
              {ending.moments.map((m) => (
                <div
                  key={m.label}
                  className="grid gap-2 border-b border-rule py-5 sm:grid-cols-[minmax(0,11rem)_minmax(0,1fr)] sm:gap-6"
                >
                  <dt className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.15em] text-muted">
                    {m.label}
                  </dt>
                  <dd>
                    <p className="font-serif text-lg leading-snug tracking-tight">{m.who}</p>
                    <p className="mt-1.5 text-[15px] leading-relaxed">{m.line}</p>
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-7 font-serif text-xl italic leading-snug text-accent sm:text-2xl">
              {ending.verdict}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
