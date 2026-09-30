<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Shared verification note

Claude Code may create nested worktrees under `.claude/worktrees/`. Their
generated `.next` output is intentionally ignored in `eslint.config.mjs` and
must not be treated as authored site code or lint failures. Keep this rule in
place so `npm run lint` reports only real project issues.

# Owner status

Femi's Marqeta role ended September 2026 and he is job-hunting; the site
now carries "open to work" signals (home hero pill + booking CTA, CV
dates and seeking line, meta description). See "Owner status" in
CLAUDE.md before writing copy about his current role. Never describe him
as a current Marqeta employee.
