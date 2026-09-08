---
title: Meta-repo structure audit
date: 2026-08-24
status: decision-ready
type: review
---

# Meta-repo structure audit

What belongs in `meta-scribl-app`, what is dead scaffolding, and what should be
wired and is not. Nothing is applied in this pass. Three folders get a REMOVE
verdict.

Every count and citation below is against `2f8bc05`, the tip of `main` at the
time of writing. That matters: `main` gained 105 files since the brief's counts
were taken, including all of `scripts/jira-sync/`, so the brief's
`scripts/ 9` is now `scripts/ 50`. `README.md`, `CLAUDE.md`, and everything
under `docs/` are read-only for this pass because `meta-repo-frontdoor` is
rewriting them; line numbers in those three surfaces will move under that
worker's changes.

The finding that started this holds up. `context/`, `inbox/`, and `sessions/`
are brain-vault conventions that were scaffolded, described in a README, and
never populated or wired. No script, no VitePress config, and no `.claude`
skill or command reads any of them. `patterns/` is the interesting case: it is
the same scaffold, but somebody actually wrote a pattern into it, and that
pattern is invisible on the doc site because docs-sync has no rule for it.

## Verdicts

| Folder | Tracked files | What reads it | Verdict | Rationale |
|--------|---------------|---------------|---------|-----------|
| `docs/` | 163 | `vitepress` (`package.json:9-12`); written by `scripts/docs-sync.mjs`; `scripts/verify-schedule-plan.py:14` | KEEP | The rendered site. Four pages under it have no source and should flow back to `s2d/`, see below. |
| `s2d/` | 160 | `scripts/docs-sync.mjs:33-42, 54-56`, `scripts/context-ingest.mjs:69-73`, `scripts/flow-board/render.mjs:26` | KEEP | Primary source of truth. |
| `scripts/` | 50 | `package.json:7-17`, `scripts/jira-sync/run-tests.mjs` | KEEP | Grew 5x on `main`. Two of its three test suites are unreachable from `npm test`, see below. |
| `tracking/` | 34 | `scripts/docs-sync.mjs:43-53` | KEEP | The board and the stories. Source of truth. |
| `knowledge/` | 24 | `scripts/docs-sync.mjs:58`, `scripts/context-ingest.mjs:70` | KEEP | The knowledge base, and the real home of the standing facts `context/` only promised. |
| `reviews/` | 12 | `scripts/docs-sync.mjs:57`, `docs/.vitepress/sidebar.mts:118-123` | KEEP | Synced and in the sidebar. This file lands here. |
| `patterns/` | 2 | Nothing | WIRE | Holds real content (`patterns/multi-repo-roled-brain.md`) that never reaches the site. One docs-sync rule fixes it. |
| `context/` | 1 | Nothing | REMOVE | Only `context/README.md`. Its stated job (stakeholders, standing facts) is done by `knowledge/team/roster.md` and `s2d/context/`. |
| `inbox/` | 1 | Nothing | REMOVE | Only `inbox/README.md`. A routing convention with nothing ever routed through it. |
| `sessions/` | 1 | Nothing | REMOVE | Only `sessions/README.md`. The real session trail is the per-worker decision logs, which live outside the repo by design. |
| `vendor/` | 1 | `.gitmodules`, `CLAUDE.md:36` | KEEP (out of scope) | The `vendor/mobileapp` submodule. `meta-repo-frontdoor` owns its removal; this audit does not touch it. |

Eleven folders, three REMOVE, one WIRE.

### Evidence for the REMOVE verdicts

The three REMOVE folders are unread by every consumer in the repo. One grep
covers it:

```sh
grep -rnE "(^|[^./a-zA-Z-])(context|inbox|sessions|patterns)/" \
  scripts .claude docs/.vitepress package.json project.json README.md CLAUDE.md
```

Filtering out the `s2d/context` and `docs/context` routes, that returns nine
hits and every one is prose in a where-things-go table: `README.md:29-32` and
`CLAUDE.md:30-33`, plus `CLAUDE.md:76` telling agents to write learnings to
`reviews/` or `patterns/`. Zero code hits. Per consumer:

- `scripts/docs-sync.mjs:32-59`. The full `RULES` array, 26 rules. It names
  `s2d`, `tracking`, `reviews`, `knowledge`. It does not name `context`,
  `inbox`, `sessions`, or `patterns`.
- `scripts/context-ingest.mjs:69-73`. Reads `s2d/inputs` and `knowledge`,
  writes `s2d/context`, `docs/public/assets/context`, and
  `s2d/context.manifest.json`. Nothing else.
- `docs/.vitepress/config.ts` and `docs/.vitepress/sidebar.mts`. Every
  `context` reference in both files is the route `/context/`, which is
  `docs/context`, generated from `s2d/context` by `docs-sync.mjs:42`. Not one
  reference resolves to the top-level `context/`. Neither file mentions
  `inbox`, `sessions`, or `patterns` at all.
- `package.json:7-17`. No script path touches the three folders.
- `.claude/` (16 tracked files: 7 agents, 5 commands, 4 story-AC-kit skills).
  No reference, including in the newly installed kit.
- `.gitignore`. Ignores nothing under the three folders, so they are genuinely
  empty rather than full of ignored working files.

## Duplicated file pairs

No two tracked markdown files in the repo are byte-identical (checked by blob
hash over `git ls-files -s -- '*.md'`). Every apparent duplicate is either a
docs-sync copy or a distinct artifact. The findings:

**Not defects, docs-sync doing its job.** `docs/reviews/` and `docs/knowledge/`
mirror `reviews/` and `knowledge/`. Source is the top-level folder in both
cases. `docs/reviews/2026-07-01-scribl-poc-loom-loop-design.md` carries the
generated banner from `docs-sync.mjs:82-83` and a rewritten frontmatter title;
the source at `reviews/2026-07-01-scribl-poc-loom-loop-design.md` carries the
real frontmatter (`status: approved`, `increment: 1`). That is a generated copy,
not a hand-copy. `docs/knowledge/` differs from `knowledge/` only where
expected: it gains a generated `index.md` and drops `articles/.gitkeep` and the
two `.vtt` files, because `collectMarkdown` only picks up markdown.

**Not a defect, a provenance chain.** Four files cover the 2026-07-14 workshop:
`knowledge/meetings/raw/2026-07-14-workshop.md` (verbatim transcript, 1652
lines), `knowledge/raw/2026-07-14-scribl-kickoff-workshop-review.md`
(synthesis), `knowledge/wiki/sources/2026-07-14-scribl-kickoff-workshop.md`
(durable retro), and `knowledge/meetings/2026-07-14-workshop.md` (operational
digest). Each names its upstream in frontmatter or an HTML comment. The chain is
intact; the source of record is the transcript.

**A real overlap, low severity.** `patterns/multi-repo-roled-brain.md` and
`reviews/backflow-multi-repo-model.md` argue the same change: replace
`project.json`'s single `code_repo` with a roled `repos[]` array. By the repo's
own convention (`patterns/README.md`, `reviews/README.md`) that split is
correct, the pattern being the cross-project distillate of the
engagement-specific back-flow note. Keep both. But the back-flow note quotes
`code_repo: "rforsh/MobileApp"` while `project.json` now reads
`hs2studio/scribl-app`, so the note is stale on its own central fact.

**A real defect.** `knowledge/raw/` and `knowledge/meetings/raw/` both hold raw
captures, and `knowledge/README.md` declares only the first. One raw convention,
two directories.

## Commands to apply the REMOVE and MERGE verdicts

Not run in this pass. Sequenced so the docs-sync build never breaks.

`docs-sync.mjs` never prunes: `applyRule` (`scripts/docs-sync.mjs:179-194`)
writes and skips, it does not delete. So removing a folder that docs-sync syncs
would leave a stale page behind forever. None of the three REMOVE folders is
synced, so no `docs/` cleanup is needed and step 1 is safe to run alone.

```sh
# 1. Remove the three unread scaffolds. Nothing reads them, nothing generates
#    from them, so no docs/ page goes stale.
git rm -r context inbox sessions
npm test

# 2. Wire patterns/ so its content reaches the site. Add one rule after the
#    reviews rule at scripts/docs-sync.mjs:57:
#      { kind: 'tree', src: 'patterns', dst: 'patterns', title: 'Patterns' },
#    then add a sidebar group in docs/.vitepress/sidebar.mts modelled on the
#    reviews group at lines 118-123, and a nav entry in config.ts near the
#    Reviews Index entry at line 163.
npm run docs:sync
npm test

# 3. Drop the dead rows from the where-things-go tables. Do this only after
#    meta-repo-frontdoor lands, since both files are theirs today, and re-find
#    the line numbers after their rewrite.
#      README.md:29, 30, 32   -- delete the sessions/, inbox/, context/ rows
#      CLAUDE.md:30, 31, 33   -- delete the same three rows, keep patterns/
#      CLAUDE.md:76           -- keep as-is once step 2 makes patterns/ live

# 4. MERGE the four unsourced docs/ pages back to s2d/, one at a time, each
#    with its own docs-sync rule. Owned by whoever picks up after
#    meta-repo-frontdoor, since docs/ is theirs today.
git mv docs/onboarding.md s2d/onboarding.md
git mv docs/open-questions.md s2d/open-questions.md
git mv docs/lucid-board-manifest.md s2d/lucid-board-manifest.md
mkdir -p s2d/meetings && git mv docs/meetings/schedule-plan.html s2d/meetings/schedule-plan.html
#    Then add matching rules to the RULES array. Two cautions. The .html file
#    needs a straight copy, not a syncFile call: syncFile prepends markdown
#    frontmatter (docs-sync.mjs:128-137) and would corrupt it. And
#    scripts/verify-schedule-plan.py:14 hardcodes the docs/ path, so it has to
#    move with the file or the gate breaks.
npm run docs:sync && npm test && python3 scripts/verify-schedule-plan.py

# 5. Consolidate the two raw directories. knowledge/README.md declares raw/
#    as the single raw home, so the meetings copies move up.
git mv knowledge/meetings/raw/* knowledge/raw/
#    Then fix the `source:` and `transcript:` frontmatter pointers in
#    knowledge/meetings/*.md and knowledge/wiki/sources/*.md that name
#    meetings/raw/, and re-run docs:sync.
npm run docs:sync && npm test
```

Step 3 is the only step with a cross-worker dependency. Steps 1, 2, and 5 can
run in any order today.

## What is missing

Brain conventions this repo should have and does not.

1. **`npm test` reaches only one third of the test suites.**
   `package.json:17` runs `test-guard.mjs` and `test-normalize-prose.mjs`. It
   does not run `scripts/jira-sync/run-tests.mjs`, which discovers and runs the
   11 `test-*.mjs` files in that directory (`scripts/jira-sync/README.md:127`),
   nor `scripts/verify-schedule-plan.py`. Roughly 2000 lines of tests arrived
   on `main` with no entry point in the one command anyone runs. This is the
   highest-value fix in this audit: add both to the `test` script.
2. **`patterns/` is not on the site.** The one pattern written here has been
   invisible since it was committed. The `RULES` array has a rule for `reviews`
   (`docs-sync.mjs:57`) and none for `patterns`, though `CLAUDE.md:76` treats
   the two as peers.
3. **Four pages are authored inside the generated tree.** `docs/onboarding.md`,
   `docs/open-questions.md`, `docs/lucid-board-manifest.md`, and
   `docs/meetings/schedule-plan.html` are the only tracked pages under `docs/`
   (excluding `.vitepress/`, `public/`, and the site landing `index.md`) that no
   docs-sync rule covers. `CLAUDE.md` says the single source of truth is `s2d/`
   plus `tracking/` and that generated pages are never hand-edited. These four
   contradict both, and they survive only because docs-sync does not prune.
4. **No drift gate on `docs/`.** Nothing checks that `docs/` matches its
   sources, so nothing would catch a hand-edit to a generated page, which is
   exactly the failure mode `CLAUDE.md` warns about. A `docs:check` script that
   re-runs the sync into a temp dir and diffs would close it, and it would have
   to allowlist the four pages in item 3.
5. **`knowledge/team/` is undeclared.** The subdirectory table in
   `knowledge/README.md` lists `raw/`, `research/`, `wiki/`, `articles/`,
   `meetings/`. The roster lives in `knowledge/team/`, which is not in the
   table. The table is the convention, so it should gain the row. `README.md:28`
   repeats the same incomplete list.
6. **`knowledge/articles/` is an empty `.gitkeep`.** Declared in the README,
   never used. Same shape as the three REMOVE folders, but it costs nothing and
   the README already explains it. Leave it.
7. **No postmortem.** `reviews/README.md` requires `postmortem-scribl.md` when
   the work ships. It does not exist, which is correct for now; the POC has not
   shipped. Flagged so the flywheel is not forgotten at rollover.
8. **The `sessions/` habit has no owner.** `CLAUDE.md:30` promises AI
   work-session transcripts in the repo. The actual trail is the per-worker
   decision logs, which live outside the repo deliberately. Removing the folder
   is the honest fix; the alternative, having handoff write a copy in, would put
   process exhaust into a client-facing brain. Hence the REMOVE verdict.

## What I could not determine

- **Whether the three unsourced markdown pages under `docs/` are intentional.**
  All three are dated `updated: 2026-08-20`, so they are live content someone
  maintains by hand. `docs/meetings/schedule-plan.html` is the clearer case: it
  has a dedicated 291-line gate script at `scripts/verify-schedule-plan.py`, so
  it is deliberate, just unmoved and ungated by `npm test`. Whether the other
  three were meant for `s2d/` and got written to the wrong tree, or whether
  hand-authored `docs/` pages are an accepted exception, is Rob's call. What
  would settle it: a one-line answer, or an `authored: true` frontmatter
  convention that a future `docs:check` honors.
- **Whether the four orphan pages render.** I did not run `npm run docs:build`,
  because a build writes into `docs/.vitepress/` and `docs/` is read-only for me
  this pass. What would settle it: one `npm run docs:build` and a grep of the
  dist output.
- **Whether `vendor/mobileapp` should go.** Out of scope by constraint; the
  submodule is `meta-repo-frontdoor`'s. The KEEP above means only that this
  audit does not act on it.
