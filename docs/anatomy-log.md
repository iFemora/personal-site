# Anatomy — product decision log

Working title: "The Anatomy of a Payment" (placeholder, Femi to name).
Purpose: product proof — one concept taken from idea to production solo,
documented as it happens so the /work case study can be written from
this log with real dates and real numbers.

## 2026-07-31 — scoping

**Problem observed:** every explanation of how a card payment works is a
consultant's diagram. Nobody has made one beautiful, and nobody made one
for civilians. Femi's site now has traffic (wall of love sharing) and
his professional audience overlaps exactly with the people who share
payments explainers.

**V1 decisions (Femi's calls):**
- Journey: the card tap. One journey told completely over three told
  shallowly. Plays to issuing depth (Marqeta) + acquiring (Paystack).
- Shape: chaptered scroll story, one interactive moment per chapter.
  Sandbox deferred; funnel data from the story decides if it's v2.
- Placement: own route, NOT in the nav at launch. Teased from home,
  shared by link. Nav promotion is a decision to be made from usage.

**V1 refuses (agreed):** cross-border + FX, bank transfers (natural v2,
where the Nigeria depth comes in), refunds + chargeback lifecycle, 3-D
Secure beyond a mention, tokenization beyond a sentence, live/real fee
rates. The interchange moment teaches the mechanic with illustrative
numbers, labelled as such, so the page can never go stale or be wrong
about someone's actual fees.

**Instrumentation from first deploy:** chapter-reached events,
completion, interaction events (card tapped, decline flipped, slider
used) via Vercel Analytics custom events. Success metric: TBD with
Femi before launch announcement.

**Build notes:** static route, no backend, existing design system and
motion primitives only, accent borrowed from work (slate teal) until
the page earns its own. All copy shipped as DRAFT for Femi's voice pass.

## 2026-07-31 — first user test (Femi, on phone), same day as v1

**Verdict: the idea works, the execution is prose.** Direct quotes worth
keeping: "the idea here is to take people on a journey, not writing
prose" / "show it in real time — 1.8 seconds, how it moves from here,
to here, to here" / "it says beep everywhere but there's no beep."

**V2 decisions from the feedback:**
- Rebuild around one real-time simulator (the stage): choose a fate,
  tap the card, watch the request run the actual route at actual speed
  with a live millisecond clock, then get the explanation after the
  run, in context. Replay by tapping the card again; slow motion for
  following the pulse.
- Every stop becomes its own visual actor (terminal, acquirer, network,
  issuer: own glyph, own live status line, own timing) instead of
  paragraphs about stops.
- A real beep. Approvals and declines sound different. Mutable.
- The card gets real furniture: chip, contactless arcs, scheme roundel,
  number line, valid-thru.
- Prose demoted to supporting acts: economics slider and the settlement
  epilogue stay, everything the stage now embodies is cut.
- Mobile is the primary layout: the rail runs vertical on phones.

## 2026-08-01 — book study + Act I greenlit

Mapped The Anatomy of the Swipe (Siddiqui) as the depth benchmark. Rule
agreed: recreate the territory, never the book — facts and lifecycle in
Femi's own words, zero reuse of its text or examples, with a courteous
further-reading credit on the page. Four-act product: I the two seconds
(clickable actors), II clearing + settlement, III the dispute, IV where
cards come from. Femi greenlit Act I starting with the issuer panel.
New requirement, his words: the flow must be smooth "like the about
page" — smoother than v2. Smoothness is now an explicit quality bar for
every anatomy interaction.

## 2026-08-01 — rail geometry feedback + Act II built

Femi's screenshot showed the desktop rail lying: line from 7% to 93%
while actor centers sit at 12.5% and 87.5%, so the dot began before the
terminal and died past the issuer, and the line missed the glyphs'
vertical middle. Fixed exactly: rail runs center-to-center through the
glyph middles, and the pulse now leaves a lit trail — each actor lights
as reached and stays lit, per his description. Default pace slowed to
half speed ("a little bit slower naturally"), clock still counts the
true 1800 ms; real time and quarter speed are one tap away.

Act II greenlit and shipped same day: "That night, and the next day."
The settlement prose became a player: press play, eighteen and a half
hours in ten seconds — tap 5:03 PM, batch close 10:14 PM, netting
2:00 AM, settlement 9:00 AM, arrival 11:30 AM — same grammar as the
two seconds (rail, travelling light, scenes stay lit), wall-clock
readout with a "next day" marker, scene lines in place of prose.

## 2026-08-02 — the fix that never shipped

Femi reported nothing changed. He was right: the rail-geometry + Act II
push never got a Vercel deployment (webhook missed it), so production
sat on the previous build while we discussed fixes he could not see.
Lesson recorded into practice: a push is not a release — verify the
deployment reaches READY and the production HTML serves the new markers
before reporting anything as live. Also fixed for real this round: the
iPhone sound (beep fired from a timer, which iOS refuses; the tap now
warms the audio engine), everything on both rails sized up, and the
default pace eased to 0.4x so the trail lighting is watchable.

## 2026-08-02 — story pace, four doors, night polish

The uniform-slowdown insight from Femi's review: no factor makes a
150 ms terminal readable, so story pace (the new default) gives every
actor a readable dwell while the clock advances through the true
milliseconds for that stop, piecewise. Real time stays one tap away;
the quarter-speed button retired. Copy: tap or swipe or insert; the
night's first scene pins "no money moved" to the moment of payment;
the ending gains its "And". Night rail breathes to 880px on desktop
(mobile untouched, per Femi). Verdict panel sits lower to clear the
doors. And Act I completes: terminal, acquirer, and network get their
go-deeper chapters beside the issuer's.

## 2026-08-02 — named, sticky, and the case file opens

The page is named: Follow the Money (Femi's pick over When You Pay,
How Money Moves, The Two Seconds). Route /follow-the-money with a
permanent redirect from /anatomy; nav joins as MONEY, short form like
Notes, between Work and Writing. The nav itself now sticks sitewide,
translucent paper over blur. The "No money moved today" heading he
caught becomes "No money moved when you paid."

Act III ships in a third grammar, chosen because a dispute is an
argument you sit inside, not a journey you watch: a case file that
unfolds at the reader's pace, filings attributed to actors, the reader
making the two calls that matter (the merchant's fight-or-fold, then
the issuer's ruling from the chair Femi used to build for), three
endings, and a sticky ledger always showing whose money the $120 is
right now. Fast-tap double-advance guarded; the action area keeps no
exit animations so the next tap is never dead.

## 2026-08-02 — one dispute becomes four (backfilled 2026-08-06)

Femi, from the bug-dump review: "right now it's only fraud cases... I
want them to be able to sort of role-play different kinds of cases."
Act III's single fraud case became a four-case file behind the same
"Open the case" door: fraud ($120), goods not received ($240, teaches
the contact-the-merchant-first rule and the delivered-vs-received gap),
cancelled subscription ($14.99, turns on fee economics and the
charge-vs-mandate distinction), and duplicate charge ($68, the only
case that can end with no dispute filed — reading pending vs posted).
Each case keeps its own steps graph, ledger amount, and closing coda;
endings offer rerun or switch. All branch graphs validated
exhaustively (20 complete paths, all endings reachable). Copy DRAFT.

## 2026-08-06 — external feedback: three seats and an objective

First outside review, from a colleague who is an accessibility PM,
reading on her phone. The sharp lines, verbatim: "took a few seconds
to understand the interaction and what I was clicking and why" / "as a
user of payment cards or methods I wasn't sure why or what to do with
the information. I think card operators will definitely understand" /
"wondering whether tying the flow to an objective will bring the
pipeline knowledge and maybe optimization ideas forward" / "if the
case/simulation starts with a question or big idea/hypothesis it helps
the reader engage" / "Perhaps I should be asking who the intended
audience is."

**Femi's audience ruling:** three seats, all first-class — card
carriers learning how money moves, small merchants understanding what
integration means, and payments professionals reading for competence.
"That part has to really work for all three."

**Shipped (copy DRAFT for his voice pass):**
- Hero orientation: names the three seats, says the page is playable,
  and hands the reader the carried question — where is the money right
  now, and who is on the hook if this step fails? (Act III answers it.)
- Question-led intros for economics ("So who pays for the two
  seconds?") and settlement ("when does the shop actually get the
  money?"). The dispute act already opened with tension.
- Three-seat takeaways after the interchange slider: what the split
  means if you carry the card (rewards are funded by interchange, why
  card minimums exist), run the shop (most of the fee is
  non-negotiable; the acquirer margin is what you shop around on), or
  build the rails (interchange as the system's gravity).

**Refused:** an audience toggle / per-seat content filter. Three static
paragraphs serve the lens without a state machine to maintain; revisit
only if funnel data says the page still loses one of the seats.

## 2026-08-06 — the accessibility floor (site-wide, logged here
because her feedback triggered it)

Her line: "conformance requires all themes to be accessible." Femi's
scope: WCAG 2.2 AA as the minimum, pragmatic, "not necessarily
everything." Shipped: `npm run audit:contrast` (all 8 palettes x 2
schemes, 550 checks), 12 failing light-scheme accents darkened 2–10%
hue-preserved (house ochre and chartreuse among them), one house
:focus-visible style, wash overlaps accepted as WARN by policy. Full
standard in docs/accessibility.md; short rules in CLAUDE.md.

## 2026-09-27 — unlisted from the nav (backfilled 2026-09-30)

Femi took MONEY out of the nav: visitors told him a lone item with that
label was confusing. The page stayed live at /follow-the-money, like
/tennis, and the plan was a "Knowledge" umbrella (a dropdown like
Studio, holding this page plus future how-to-build and AI-agent
pieces) once there was a second piece to put beside it.

## 2026-09-30 — back in the nav, under Knowledge

Decision from the senior-PM audit, Femi's call: don't wait for
company. The site's job right now is a job search, and this page is
the single best proof of craft on it; hiding it cost more than a
one-item dropdown ever could. Shipped: a "Knowledge" umbrella in the
nav between Studio and Notes, opening to "Follow the Money" (dot in
the borrowed slate teal) over a muted "More soon" line. The Nav now
supports any number of umbrellas, so the next knowledge piece is one
array entry. The page itself is untouched; the open items above (voice
pass, Act IV, success metric, OG image) still stand.


## 2026-10-01 — its own accent

From the site audit's "Later" batch, on Femi's "ship it". The page no
longer borrows the work slate teal: `--accent-money`, a banknote green
(`#2e6b47` light, `#8fcfa5` dark) from the earthy family, with a Radix
step-11 hue per guest palette (bronze in ember, jade in riso and grove,
teal in chalk, green in tide; ink and cobalt stay monochrome). The
Knowledge dropdown's dot and `html[data-accent="money"]` follow it.
Contrast audit passes in all 8 x 2. Act IV is still to be scoped with
him; nothing on the page itself changed.
