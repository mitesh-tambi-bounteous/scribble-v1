# CLAUDE.md -- START HERE (scribl project brain)

This repo is a generated **project brain**. It is, at once: the S2D playbook
outputs, a knowledge base, a built-in planning/tracking board, a living
documentation site, and the hub that pairs with the code repo.

**Read this file at the start of every session.**

- **Project:** scribl
- **Type:** mobile-app-poc
- **Code repo:** hs2studio/scribl-app on Bitbucket (the thing we are building;
  a separate clone, not vendored here; see `project.json`)

## This is the wiki and brain, not a running pipeline

The S2D playbook already ran. Its outputs are rehomed at the top level:
`product/` (`overview.md`, the spec, the ADRs under
`inputs/reference/decisions/`, design history, input artifacts), `tracking/`
(`status.md`, the roadmap and board), and `handbook/` (how we work). Work
against those source files directly, then re-render the doc site with
`npm run docs:sync`.

- Build work is spawned into the code repo's worktrees; the build skills live
  in the code repo's own `.claude`, not here.

## Where things go

| Path | Holds |
|------|-------|
| `product/` | What we are building: the spec, `inputs/`, `overview.md`, ADRs under `inputs/reference/decisions/`, design history, MVP scope |
| `handbook/` | How we work: definition of ready, definition of done, ceremonies, estimation, release management, the story/AC kit |
| `tracking/` | The built-in board: `roadmap.md`, `board.md`, `status.md`, `stories/` (per-work-item) |
| `knowledge/` | Brain knowledge base: `raw/`, `research/`, `wiki/`, `articles/`, `meetings/` |
| `patterns/` | Reusable learnings extracted from work |
| `reviews/` | Self-improvement: per-stage reviews plus the final postmortem |
| `artifacts/` | Finished client deliverables, one self-contained HTML file each, offline and no build step. Rules in `artifacts/README.md` |
| `docs/` | The VitePress doc site (rendered from `product/` and `tracking/` by docs-sync) |
| `project.json` | Pointer to the code repo and type |
| `index.html` | Standalone front door. What this repo is and how to talk about it, no install needed |

Single source of truth for the doc site is `product/`, `tracking/`,
`handbook/`, `reviews/`, and `knowledge/`. Run `npm run docs:sync` to render
those into `docs/` pages, then `npm run docs:dev` to preview. Never hand-edit
the generated dashboard pages under `docs/`. Source pages under `product/`
and `tracking/` use site-root links (like `/roadmap`) that resolve only in
the rendered site; this is by design, do not "fix" them.

## Hub model and story-sync pairing

This meta repo is the hub. App code lives in its own repo, hs2studio/scribl-app
on Bitbucket, cloned separately. The living wiki and stories
(`tracking/stories/S-*.md`) live here. Process stays in one place so the wiki
can never fall out of sync with what actually shipped.

- **Mandatory story-sync pairing.** Any change in the app repo that advances or
  completes a story MUST, in the same unit of work, update that story's source
  at `tracking/stories/S-*.md`: move its `status` across the board states in
  `tracking/board.md` (Now / Next / Blocked / Done) and check off the `## AC`
  boxes that are now satisfied. Then run `npm run docs:sync` so the rendered
  wiki under `docs/` reflects reality. Never let the wiki drift from shipped
  code.
- **Jira board.** scribl production stories live on the SCRIBL board (project
  key SCRIBL): https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog
  -- mapping conventions in `tracking/jira-board.md`. POC stories (S-*) stay
  hub-only.

## Baked-in habits (do these without being told)

These are standing conventions, not one-offs. Agents working in this brain
follow them by default:

1. **Record learnings as work happens.** When something is learned, surprising,
   or reusable, write it to `reviews/` (engagement-specific) or `patterns/`
   (reusable across projects) at the moment, not later.
2. **Run an end-of-stage review at each task boundary.** At the end of every
   stage or task, write a short review to `reviews/`: what went well, what took
   too long, what to change in the playbook. Do this even when working by hand.
3. **Ingest meeting transcripts.** Client and internal call transcripts go to
   `knowledge/meetings/`. On ingest, extract a "Suggested action items" section.
   A human promotes those to `tracking/stories/` (auto-creation is out of scope
   for now).
4. **Keep the tracking board current.** `tracking/board.md` always reflects
   reality across Now / Next / Blocked / Done. Move cards as state changes.
5. **On methodology friction, capture the fix.** If a convention gets in the
   way, record the friction and the proposed fix in `reviews/` so the playbook
   can improve. Do not silently patch around it.

## Self-improvement flywheel

Per-stage reviews accumulate in `reviews/`. When the work ships and the delivery
team rolls on, produce a final postmortem in `reviews/` (durations, friction,
wins, inventory). Those reviews plus a compact project record feed the playbook
so it improves from every engagement.

## Prose-lint and brand rules (grep-checked)

- No em-dash character anywhere. Use commas, colons, or " -- " (ASCII hyphens
  with spaces) instead.
- No emoji.
- Do not name the legacy consulting firm in committed docs.
- No absolute machine paths in committed docs. Refer to source material by
  description, not by filesystem path.
- Use ASCII arrows "->", not unicode arrows.
- Apply NASA Power-of-10 in spirit for any scripts: bound loops, assert
  invariants, check returns, small functions, tight scope.

## Work-item execution (story/AC kit)

The team's story and acceptance-criteria kit is installed in this repo: four
skills under `.claude/skills/`, the `/start-work-item` launcher under
`.claude/commands/`, guidance and templates at `handbook/story-ac-kit/`
(usage doc: `handbook/story-ac-kit/index.md`).

- Every work item carries `Acceptance criteria`, `Scope -- modules and files
  in play`, and `Explicitly out of scope`. An item missing any of them is not
  ready; ask, never invent.
- First two actions of a work-item session: invoke `acceptance-criteria-lock`,
  then `scope-checkpoint`.
- A work item is complete only when every acceptance criterion has recorded
  evidence; when all do, stop.
- Jira is the system of record for issue state, and the team writes to it.
  Comment, edit, create, transition: all four are allowed, from a session or
  from an agent working on the team's behalf. No operation waits on one
  person's approval. Work the board.
- Check the Jira connection before promising any Jira change. Access comes
  from whatever the person is using, the Atlassian MCP server, the Jira
  connector in the Claude desktop app, or `JIRA_*` in the environment for the
  filing scripts. Confirm it, do not assume it: call
  `getAccessibleAtlassianResources` and look for a site carrying
  `write:jira-work`, or check the four `JIRA_*` variables that
  `scripts/jira-sync/README.md` names.
- With no Jira connection, say so in the first reply and stop short of the
  Jira half: "I have no Jira connection, so I can only change the meta repo."
  Then ask whether to make the repo-side changes alone. If the answer is no,
  change nothing. Never write a repo-side change that claims a Jira write
  happened, and never report a Jira change you could not make.
- A Jira write is half the job. Whatever the repo also records about that
  issue gets updated in the same session and the same commit: the story file
  under `tracking/stories/`, the card in `tracking/board.md`, and a row in
  `tracking/jira-mirror.md`. A Jira write that leaves the repo saying
  something else is an incomplete operation, and the wiki drifting from the
  board is the one failure this hub exists to prevent. If nothing in the repo
  covers what you changed, the mirror row alone is enough.
- Editing a description replaces the whole body. Prefer a comment for
  findings, status notes, and evidence. When you do edit a description, read
  the current body first and send it back whole with your change applied,
  never a retype from memory, or you will quietly mangle the acceptance
  criteria.
- Creating in bulk still goes through the filing pipeline
  (`handbook/story-ac-kit/jira-filing-pipeline.md`), preflight and dry run
  first. That is a practice against filing 40 half-formed stories, not a
  permission gate: whoever is running it reads the dry run and decides.

## Working agreement

- Do not assume. Surface tradeoffs rather than silently choosing.
- Produce the minimum docs that solve the problem.
- Touch only what you must.
- Define success criteria up front and verify against them before claiming done.
