# Review queue

Everything on the site that was drafted or decided on Femi's behalf and
still needs his eyes, in one place. Sessions append here instead of
scattering asks across chat. Resolve a line by editing the thing, then
delete the line. Dated on entry.

Format: **what** · where · how to resolve.

## Copy drafted in Femi's voice (2026-09-30, PM audit phases 0–2)

- **CV seeking sentence.** "I am now open to Solutions Architect,
  Customer Success, and Product leadership roles, in Vancouver or
  remote across Canada." · `src/app/cv/page.tsx`, Summary · rewrite or
  keep.
- **CV Marqeta bullets recast in past tense.** In particular "Led
  Resolve's credit expansion across FCRA disputes…" (was "Leading"):
  if that work had not shipped when the role ended, "Scoped" or
  "Started" is truer · `src/app/cv/page.tsx` · confirm each verb.
- **Hero pill and CTA wording.** "Open to new roles" and "Book an
  intro" are the audit's words · `src/app/page.tsx`,
  `src/components/BookIntroLink.tsx` · keep or reword.
- **Meta description.** "Femi Siji-Kenneth is a product leader open
  to Solutions Architect, Customer Success, and Product roles.
  Vancouver + remote Canada." · `src/app/layout.tsx` (three places)
  · keep or reword.
- **Resolve case study tense.** Eyebrow "Marqeta · 2025 – 2026";
  standfirst "…and expanded it in small releases after that"; "four
  product areas I carried" · `src/app/work/resolve/page.tsx`.
- **Knowledge dropdown note.** "More soon" · `src/components/Nav.tsx`.
- **Case study testimonial section.** Label "In their words", link
  "More on the wall of love →" · `src/components/CaseStudy.tsx`.
- **Colophon Build sentence.** "…a design-system package inside the
  same repository, so the site and its system move together" ·
  `src/app/colophon/page.tsx`.

## Essays as imported from Substack (2026-09-30)

- **The Wrong Scoreboard** keeps its closing sign-off ("Femi
  Siji-Kenneth writes about product, culture, tennis…") ·
  `content/writing/2026-04-09-the-wrong-scoreboard.mdx` · keep on-site
  or cut.
- **Go Fetch** says "I am a Lead Product Manager at a publicly traded
  fintech company", true when written · `content/writing/2026-03-01-go-fetch.mdx`
  · leave as a dated piece, or add a one-line note.
- **Plentywaka** (2019, the Medium-era piece) is now the oldest
  on-site entry · `content/writing/2019-09-23-plentywaka.mdx` ·
  happy with it here, or `homepageHidden: true`, or remove.
- **Making Sense at the Edges** opens with a Wikimedia photo; the
  photographer credit survived in the caption but the CC BY-SA licence
  link was an empty image link and got stripped ·
  `content/writing/2025-08-01-making-sense-at-the-edges.mdx` · add the
  licence link back if you want it explicit.
- **Substack canonical.** Substack has no canonical-URL setting, so
  both copies coexist. If you care, add "Originally published at
  ifemora.dev/writing/…" to each Substack post · on Substack, not here.

## Decisions that are Femi's (2026-09-30)

- **Tennis / notes cadence.** Counter is hidden below three entries;
  nothing else changed. Commit to a rhythm or don't · no code needed
  either way.
- **Morakinyo Adejare on the corporate-banking case study.** He is
  Lead Product Designer at FCMB, but the wall says you know him from
  NUTM; confirm he was on that work or swap the quote ·
  `src/app/work/corporate-banking/page.tsx`.
- **A Marqeta voice for Resolve.** The case study has no testimonial
  because nobody from Marqeta is on the wall. Ask one colleague to
  fill the form · then add a `voices` entry in
  `src/app/work/resolve/page.tsx`.
- **Follow the Money, still open from the playbook.** Voice pass over
  all copy (Act III most sensitive), Act IV (where cards come from),
  the page's own accent (touches locked tokens + 8 palettes), a
  success metric before any announcement ·
  `docs/follow-the-money-playbook.md`.
- **GA4.** New events `book_intro_click` and `nav_knowledge_open` now
  fire; the 12 custom dimensions are still pending in GA4 Admin
  (property G-1Z3809BM26) · GA4 Admin, not code.
- **Google Calendar "Meet with Femi".** Check the schedule's timezone
  and hours after the Vancouver move · Google Calendar settings.
- **The audit file.** `ifemora-dev-pm-audit-roadmap.md` lives in
  ~/Downloads. Move it into `docs/` if you want future sessions to
  read it without being handed the file · your call, it is your
  auditor's document.
