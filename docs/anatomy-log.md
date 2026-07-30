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
