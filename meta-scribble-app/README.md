# scribl

A generated **project brain** for the scribl mobile-app POC. Read `CLAUDE.md`
first for the working agreement and where everything lives.

Open `index.html` for the fastest orientation. It is a standalone page,
double-click it, nothing to install.

## What it is

This repo is the hub for the scribl engagement (type: mobile-app-poc). The
app itself lives in a separate repo, `hs2studio/scribl-app` on Bitbucket. This
repo is everything around the app:

- **The engagement record** -- the spec, the ADRs, the design history, and the
  MVP scope, all in `product/`.
- **Knowledge base** -- research, articles, wiki, and meeting transcripts.
- **Tracking board** -- a built-in roadmap, kanban board, and per-work-item
  stories that drive the build.
- **Living docs** -- a VitePress site rendered from the source data, kept
  current automatically.

## Why it exists and how to use it

The answer to "what did we decide, and where is that written down" should take
one search. The plan, the decisions, the board, and the process are files in
one repo, and the wiki is generated from those same files, so a page cannot go
stale on its own.

Three files orient you. `product/overview.md` is what scribl is in one page
plus the engagement contract. `tracking/board.md` is what is in flight.
`handbook/` is how we work, covering definition of ready, definition of
done, ceremonies, estimation, and how we operate in front of the client.

Why the stack is what it is lives in the eleven ADRs under
`product/inputs/reference/decisions/`. Read the ADR titles, not the
filenames. ADR 0004 was renamed on 2026-08-24 from
`0004-dynamodb-single-table.md` to `0004-aurora-serverless-system-of-record.md`
to match its own title, "Aurora Serverless v2 (PostgreSQL) as system of
record"; DynamoDB single-table is kept only as a forward-scale option. If an
old link still points at the previous filename, this note is why.

## Layout

```
docs/           155 files. The client-visible VitePress wiki, generated from product/, tracking/, handbook/, and knowledge/. Do not hand-edit.
product/        140 files. What we are building: the full-app spec, the eleven ADRs, the design history, the client input artifacts, and the MVP scope. The doc site renders from here.
scripts/        51 files. Doc sync, context ingest, the flow board renderer, the Jira filing pipeline, prose and content guards.
tracking/       40 files. roadmap.md, board.md, the backlogs, stories/.
knowledge/      28 files. raw/, research/, wiki/, articles/, meetings/.
handbook/       22 files. How we work: definition of ready, definition of done, ceremonies, estimation, release management, and the story/AC kit.
.claude/        16 files. Slash commands, skills, subagent definitions.
reviews/        14 files. Per-stage reviews plus the final postmortem. Repo-only, excluded from the rendered site.
patterns/       2 files. Reusable learnings extracted from work.

index.html      Standalone orientation page. Open it directly, nothing installed.
CLAUDE.md       START HERE
README.md       This file.
project.json    Pointer to the code repo and type.
package.json    Doc-site tooling and scripts.
```

## Commands

### Knowledge commands

- `/ingest` -- ingest a URL into the knowledge wiki, or route a meeting
  transcript into `knowledge/meetings/`.
- `/ingest-standup` -- ingest a call or standup transcript into
  `knowledge/meetings/` and extract suggested action items. A human promotes
  those to stories. With `--kind=standup` it also prepends the day to the
  running standup log at `knowledge/meetings/standups.md`.
- `/query` -- ask a question against the knowledge wiki and get a cited
  answer.
- `/remote-ingest` -- ingest one or more URLs and ship each as its own merged
  PR.

### The story and AC kit

The kit David added. It governs how a work item goes from a backlog line to
filed, verified, and done.

- `/start-work-item` -- picks the next ready work items, checks them for
  collisions, gates once on a human, then launches one scoped session per
  item in its own worktree.
- `acceptance-criteria-lock` -- binds a session to the work item's acceptance
  criteria verbatim, so it keeps going until every criterion has evidence.
- `ears-acceptance-criteria` -- puts each criterion into one of the six EARS
  forms with a machine-runnable verification line.
- `scope-checkpoint` -- binds a session to the item's declared scope and
  out-of-scope lists, so parallel sessions cannot collide.
- `adversarial-spec-review` -- five personas review the item in parallel and
  return a verdict, catching thin acceptance criteria while they are still
  cheap to fix.

### The Jira filing pipeline

Under `scripts/jira-sync/`. Run through
`node scripts/jira-sync/jira-sync.mjs <command> <file>`.

- `preflight` -- parses the file and validates every parser and content
  rule.
- `dry-run` -- prints the full creation plan as readable text, never touches
  the network.
- `create` -- files the epic and its stories, gated behind `--execute`.
  Without it you get the dry-run plan again.
- `attach` -- attaches local files referenced from the story descriptions to
  the issues created earlier, also gated behind `--execute`.

Two rules on this pipeline are not negotiable. Every write is gated behind
`--execute` after a dry run, and no agent ever creates, edits, or transitions
a Jira issue on its own. Stories are drafted to markdown for human review
first, and the filing step is gated by a human.

Production stories live on the Jira board, project key `SCRIBL`. Mapping
conventions are in `tracking/jira-board.md`. The S-numbered POC stories stay
in this repo.

### Subagents

Defined in `.claude/agents/`. Four maintain the wiki: `wiki-ingestor`,
`wiki-querier`, `wiki-linter`, `wiki-refresher`. Two handle Android builds:
`android-native-build`, `android-emulator`. One, `entire-search`, searches
this repo's checkpoint and session history.

## How docs build

The doc site renders from four sources: `product/`, `tracking/`, `handbook/`,
and `knowledge/`. The sync script (`scripts/docs-sync.mjs`, plus
`scripts/context-ingest.mjs`) copies those into renderable pages under
`docs/`.

`reviews/` and internal material -- raw meeting transcripts, the team roster,
the research digests, and a few other internal-only pages -- stay repo-only.
They are named in the exclude list in `scripts/docs-sync.mjs` and never reach
`docs/`, because the rendered site is client-visible.

```bash
npm install
npm run docs:sync      # render source data into docs/ pages
npm run docs:dev       # local preview with hot reload
npm run docs:build     # production build (CI gate)
npm run docs:preview   # serve the built output
npm run docs:clean     # wipe the VitePress cache and dist
npm run context:ingest # pull source documents into the context set
npm run wiki:update    # context:ingest followed by docs:sync
npm run board:render   # render the flow board
npm test               # all four suites: content, jira-sync, schedule-plan, docs-sync
npm run test:content   # the content guard and the prose normalizer
npm run test:jira      # the 11 jira-sync tests
npm run test:schedule  # the schedule-plan gate
npm run test:docs-sync # the docs-sync render and exclude-list checks
```

Never hand-edit the generated dashboard pages under `docs/`. Edit the source
in `product/`, `tracking/`, `handbook/`, or `knowledge/` and re-run `docs:sync`.

`docs:dev` and `docs:build` auto-run `docs:clean` first (via npm pre-scripts),
wiping `docs/.vitepress/cache` and `docs/.vitepress/dist` -- a stale VitePress
cache previously caused the site to render blank.
