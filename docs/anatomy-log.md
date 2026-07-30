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
