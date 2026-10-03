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

## 2026-10-02 — Act IV scoped and release one shipped (copy DRAFT)

Scoping conversation, Femi's answers on the record:

- **Marqeta line:** industry mechanism only. The act shows he knows the
  stack; it never says "this is the chapter I built". No employer
  internals anywhere in the copy.
- **Bank versus unbundled stack:** show both. Picking "A bank" as the
  company collapses three of the four seats into one house, which is
  the comparison without doubling the copy.
- **Reader's seat:** program manager. The cardholder opening ("why did
  my app give me a Visa?") is a future variant.
- **Funding positions:** three for a fintech (prefunded, just-in-time,
  credit), two for a bank (debit on deposits, credit on the balance
  sheet). The ledger strip wants three to sing.
- **Release order:** the PM's call; choices first because they need no
  animation. Release one = beats 1 to 3. Release two = the opened
  issuer stop on the Act I rail. Release three = the "who is on the
  hook" ending with the tap replayed, the seat takeaways, and the
  share card.

**Shipped (release one), as section 05 "Before the tap":** the build
sheet (`src/components/anatomy/CardBuild.tsx`, content in
`src/lib/cardBuild.ts`). Pick who you are (gig platform, neobank,
expense tool, a bank); meet the four seats (network, sponsor bank,
issuer processor, you the program), each with a one-line role, what it
asks of you, and a go-deeper door in the stage's pattern; then choose
where the money sits and read the ledger strip: the night before, at
the tap, on the hook, and a line for your company. User-paced
throughout, so the smoothness bar is met by construction. Three new
funnel events in `anatomyTrack.ts`: build_company, build_seat_opened,
build_funding. The hero now says "five acts".

**Refused for v1:** credit underwriting, tokenization and wallet
provisioning beyond a line, issuing economics beyond one line back to
Act II, country-by-country regulation, the launch timeline as a beat.

**Success metric (proposed, to pin before announcing):** reach of the
funding strip as a share of Act IV starts, benchmarked against Act
III's ending reach once release three lands.

**Open:** Femi's voice pass over every line (all DRAFT); releases two
and three; the home-page teaser and the page's own share card from
the earlier list.

## 2026-10-03 — Act IV release two: the first tap, replayed (copy DRAFT)

`src/components/anatomy/IssuerReplay.tsx`, the fourth step of the build
sheet. Act I's issuer stop (900 ms on the stage clock) opened into
three stops: the processor, the program, the books. The path follows
the card built above: prefunded and credit pass through the program
stop without asking it ("not asked. The money was already here."); a
just-in-time card asks it, and a pill chooses whether your service
answers in time (approved, 350 ms used) or is too slow (the window
closes, the processor stands in by the rule you wrote, DECLINED · 91,
760 ms used). A bank's card renames the stops (auth host, product
team, core ledger) and never leaves the house. Same grammar as the
stage: keyframe trail with `times`, timer-owned schedule, clock island
mapping wall time to issuer milliseconds, crossfading status lines,
no exit animations on buttons, vertical rail on phones. A new company
or funding choice remounts the stage (keyed), so a run in flight is
dropped rather than finished on the wrong path. Event:
`anatomy_replay_run` {company, funding, path}. Release three (the
ending ledger, seat takeaways, share card) is next.

## 2026-10-03 — The card program simulator (copy DRAFT)

`/follow-the-money/simulator`, from the "Card Program Simulator" spec
(VP Product mentor spec, 2026-10-03, kept outside the repo). The model
is `src/lib/program-economics.ts` (no React: types, defaults, presets,
`derive`, the interpretation lines, formatting); the view is
`src/components/anatomy/ProgramSimulator.tsx`; the page is
`src/app/follow-the-money/simulator/page.tsx`. Two columns on desktop
(controls, sticky results), one on phones. Three events:
`simulator_view`, `simulator_preset_applied`, `simulator_program_type_changed`.

Decisions, with Femi (2026-10-03):

- **A route, not a section.** The two-column sheet needs the 1100px
  shell, the acts sit in a 680px column, and a route gets its own
  metadata and clean analytics. Linked from the end of act five ("The
  card is built. What it costs to run one ... build a card program"),
  after the build sheet rather than from the "build one" sentence,
  because the build sheet is what that sentence introduces. In the
  sitemap and the smoke list; not in the nav (the Knowledge umbrella
  keeps one room until a second piece lands).
- **Presets span the model instead of repeating it.** The spec's three
  all landed profitable with the processor as the largest line, so
  clicking through taught one lesson three times. Now: Gig payouts
  (prepaid, pays; processor largest), Neobank debit (underwater at this
  scale with no fee and a team to pay; fixed costs largest; a two-dollar
  fee flips it), Credit builder (pays; credit losses largest). Each
  preset is a complete input set, so it always lands on the same screen.
- **Break-even is computed on the variable margin** (contribution before
  fixed costs, per card), not on contribution per card at the current
  scale as the spec's worked example did. The spec's definition said
  "never" for any program underwater today, even one whose cards each
  earn margin and simply need company, and then recommended "more
  cards" in the same breath. With the fix the prepaid defaults break
  even at 4,259 cards (the spec said 7,418); the three presets at 2,613,
  62,052 and 3,760. "Never" now means every card loses money on its own,
  and the line named beside it is the largest variable cost (the spec's
  AC5 wanted the processor; it gets the processor).
- Interchange lines say "debit interchange", not "regulated": the
  defaults are exempt-bank rates, and regulated debit is a different
  number.

## 2026-10-03 — Act IV release three: who is on the hook (copy DRAFT)

The ending of the build sheet, as its fifth step. For the card built
above, three nights it could fail (the tap with your service down,
settlement with you unable to pay, a dispute a month later) and who
pays on each, then a verdict that answers the page's question for that
card. Keyed by funding (`ENDINGS` in `src/lib/cardBuild.ts`), because
that was the choice that decided it; a bank's two positions have their
own. Crossfades with the funding strip. Event `anatomy_build_end`
{company, funding} fires once when the ending scrolls into view, which
makes it the act's completion beacon and the number the proposed
success metric reads.

With it: the three seat takeaways after the sheet, in the Act II
pattern (carry the card: the bank is on the back; run the shop: it
taps like any bank's card because to the terminal it is one; build the
rails: where the money sits is the whole design), and the page's own
share card (`src/app/follow-the-money/opengraph-image.tsx`, banknote
green, the carried question as the subtitle; the simulator inherits
it; the smoke test fetches it). Act IV is complete.

## 2026-10-03 — Act V is the simulator (Femi)

"Isn't this act v?", on the simulator spec. So the card program
simulator is the page's sixth section and fifth act in the log's count
(the acts are stage, settlement, dispute, build, program; the
economics slider in section 02 was never numbered as one). Section 06
"What it costs to run" carries the act on the page: a question-led
intro, the three preset stories with their outcome computed from the
model at build time (contribution, pays or underwater, largest line,
break-even), and the door to the sheet, which keeps its own route
because two columns need the 1100px shell. Hero and share card say
six acts. Nothing new was invented for an "Act V"; a launch-timeline
act (the months from the sponsor bank's yes to the first tap, in the
Act II time-compression grammar) is the obvious candidate for an Act
VI if the funnel asks for one.

## 2026-10-03 — the simulator gets its own door in the nav (Femi)

"Make 'Build a card program' its own path under knowledge nav, just as
we have 'follow the money.'" So the Knowledge umbrella has two rooms,
Follow the Money and Build a Card Program, both in banknote green, and
the "More soon" note that held the umbrella's place since 2026-09-30
retired. A room nested under another's path lights only the deepest
match, so the simulator does not light both rows.

