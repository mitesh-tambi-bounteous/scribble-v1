---
title: "Stage review: Jira backlog execution pass"
project: scribl
type: review
updated: 2026-09-02
---

# Stage review: Jira backlog execution pass (t137)

The 2026-09-02 filing draft was executed against the live SCRIBL board: 74
creates (epics SCRIBL-79..88 plus 64 stories), 62 updates, zero writes to the
16 protected issues, verified by before/after `updated` timestamps. Tickets
follow the new `handbook/story-ac-kit/template-feature-ticket.md`.

## What went well

- The draft's fenced bodies as the single source kept 136 payloads verbatim;
  a mechanical diff against the draft showed only the two intended insertions
  (QE standing line, Format link) plus Screen blocks.
- Splitting build (payload files on disk) from execution (API calls from
  payloads) made every write auditable and made subagent claims checkable
  against files instead of prose.
- The protected list held. Three planned "is blocked by SCRIBL-20" links were
  skipped because a Jira link writes both issues and would have moved the
  protected issue's timestamp.

## Friction, and the fix

- **The draft's screen links are format-inconsistent.** Most sections write
  `Screen: <url>`; E11 and E12 write bare URLs. A builder keyed on the prefix
  missed E11's four screen blocks until a sweep caught it. The playbook fix
  is for the draft generator to emit one canonical link form, or for the
  filing spec to key on the URL path, never on a label.
- **`handbook/story-ac-kit/index.md` still says the filing phase "has not
  started" and that no agent writes to Jira.** This run was Rob-gated and
  executed by agents, so that page is now stale. It was deliberately not
  rewritten here (policy text is Rob's); it needs a one-line update naming
  the 2026-09-02 execution pass and the gate that authorized it.
  **Closed 2026-09-04.** The policy was rewritten instead: the team writes to
  Jira, all four operations, with no approval gate, and every write pairs
  with its repo update in the same session. The stale page is fixed and
  `CLAUDE.md` is the single statement. See
  `reviews/2026-09-04-jira-write-policy-change.md`.
- **Two executors mis-handled paths or formatting once each** (a relative
  `SP/` literal landing payload files inside the repo worktree; literal `\n`
  in two create bodies, self-corrected). Both were caught by checks, not by
  luck: the worktree was inspected before commit, and the executor read back
  the tool response. Keep both checks in the playbook.

## Numbers

136 write ops planned, 136 executed ok, 3 links skipped (protected target),
6 links deferred cross-group then created. Post-run board: 152 issues.
