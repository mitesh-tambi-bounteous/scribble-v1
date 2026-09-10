# Story/AC Kit: How the Team Uses It

David Lawton's story and acceptance-criteria kit, reviewed and installed
2026-08-21 from PR 90 on his arc-ideation repo. Start any session in this
repo and you get the same commands and gates as everyone else. Provenance
and the full component list are in [kit-readme.md](kit-readme.md).

## The pairing rule

Jira is the system of record and the team writes to it: comment, edit,
create, and transition are all in bounds. What the rule governs is timing: a
Jira write and the repo update happen in the same session, so the wiki here
can never drift from the board.

Bulk creation still goes through the gated filing pipeline, with a dry run
read before anything is filed. David Lawton's reason for that gate, verbatim:
"because when it was working directly in JIRA, it just created noise
everywhere." That is the argument for reading the dry run before filing
forty stories, not an argument against writing to Jira at all.

`CLAUDE.md`, section "Work-item execution (story/AC kit)", is the single
statement of what an agent may and may not write; read it there. This file
does not restate it.

## Before you start: check the connection

Confirm Jira access before promising any Jira change: call
`getAccessibleAtlassianResources` and look for a site carrying
`write:jira-work`, or check that `JIRA_BASE_URL`, `JIRA_EMAIL`,
`JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY` are set. If there is no connection,
say so up front, "I have no Jira connection, so I can only change the meta
repo," then ask whether to make the repo-side changes alone. If the answer
is no, change nothing.

## What to run, in order

1. **Writing stories.** Use the four-section contract in
   [template-issue-work-item.md](template-issue-work-item.md): Outcome,
   Acceptance criteria, Scope -- modules and files in play, Explicitly out
   of scope. Write every criterion with the `ears-acceptance-criteria`
   skill (one of six EARS forms plus a machine-runnable `Verification:`
   line). Draft to markdown under version control, never into Jira.
2. **Before a story goes Ready.** Run the `adversarial-spec-review` skill.
   Five personas, one verdict; any REWORK stops the story. This is the
   "is it at the right level" gate. Granularity and verbosity are the two
   known failure modes; the size-by-outcome rules are in
   [backlog-management.md](backlog-management.md).
3. **Filing to Jira.** Filing is live: the sync scripts live under
   `scripts/jira-sync/` (see that directory's README) and the process is
   [jira-filing-pipeline.md](jira-filing-pipeline.md): pre-flight, epic,
   dry run, create, attachments, with a confirmation at every stage before
   the next one runs. In practice that's `node scripts/jira-sync/jira-sync.mjs
   preflight <file>` until it reports zero errors, then `dry-run <file>` read
   in full, then `create <file> --execute` once the plan looks right, then
   `attach <file> --execute`. Running anything past preflight needs
   `JIRA_BASE_URL`, `JIRA_EMAIL`, `JIRA_API_TOKEN`, and `JIRA_PROJECT_KEY` in
   the environment; a teammate without them needs them provisioned first. The
   V3 markdown format it parses is
   [template-story-v3-jira.md](template-story-v3-jira.md). Filed tickets
   follow the intake shape in
   [template-feature-ticket.md](template-feature-ticket.md).
4. **Executing a work item.** Run `/start-work-item`. It filters for
   readiness (all four sections present), checks collisions, gates once on
   a human, and writes a per-session brief. The session's first two actions
   are the `acceptance-criteria-lock` skill (what must be done: every
   criterion needs recorded evidence, and when all have it, stop) and the
   `scope-checkpoint` skill (where it may edit: anything else becomes a
   finding, not an edit).

## What it produces

Markdown story drafts, a per-session `.agent/ac-lock.md` evidence table and
`.agent/scope.md` footprint file, findings as comments (never new issues),
and a completion report that is the evidence table, not prose.

## Client-safety rule for story drafting

Jira may be client-visible. The backlog pages carry internal content that
must never reach an issue description: staffing splits and named-person
allocations, the capacity arithmetic and its cost-increase figures, QA
funding commentary, and internal deliberation about the client. When
drafting stories from the backlog, carry over the outcome and the testable
behavior, never the staffing or cost prose around it. The filing pipeline's
pre-flight checks format only; it will not catch this for you. The human
review of the draft file is where this gets caught.

## Priorities stay human

The kit does not prioritise and neither do agents. Ranking, sprint
assignment, and cut lines are set by hand. An agent may select the next
ready item off a human-ranked board; it may not reorder the board.
