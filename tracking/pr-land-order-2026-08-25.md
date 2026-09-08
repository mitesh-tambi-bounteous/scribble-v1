---
title: "scribl meta repo: open PR land order, 2026-08-25"
project: scribl
type: planning
status: recommendation, awaiting a human merge decision
updated: 2026-08-25
---

# Open PR land order, 2026-08-25

Seven draft PRs are open on `hs2studio/meta-scribl-app`, all targeting `main`.
Nobody had reconciled them. This page says what each one is, where they
actually collide, what order to land them in, and what to do about the
generated `docs/` tree, which is 24 pages stale on `main` right now.

Baseline for everything below: `origin/main` at `0f52c39` ("Merged in
workshop-epic-artifact (pull request #40)").

Method. The PR set came from the Bitbucket API
(`/2.0/repositories/hs2studio/meta-scribl-app/pullrequests?state=OPEN`), which
reports `size: 7`. Every path claim comes from
`git diff --name-only origin/main...origin/<branch>`. Every conflict claim
comes from `git merge-tree --write-tree`, run pairwise and then replayed as a
sequential landing simulation. No branch was modified; gates were run in a
throwaway detached worktree.

## The seven

| PR | Branch | Head | Commits | Files (docs / source) | What it changes | `npm test` | `docs:sync` clean at head | `docs:build` |
|----|--------|------|---------|----------------------|-----------------|-----------|---------------------------|--------------|
| 38 | `wiki-ia-execute` | `2c3d9ea` | 8 | 136 (113 / 23) | Rewrites the wiki information architecture: cuts internal trees from the rendered site, moves `knowledge/wiki/` content under `product/context/`, hardens `scripts/docs-sync.mjs` and adds `scripts/test-docs-sync.mjs`, rebuilds the sidebar. Site drops from 169 to 126 pages. | PASS | yes (0 files) | PASS |
| 39 | `engineering-practice-docs` | `8d2e20e` | 3 | 27 (14 / 13) | Adds the `handbook/engineering/` section (11 new pages) and makes `docs-sync` path output platform-independent. | PASS | no (1 file: `docs/reviews/index.md`) | PASS |
| 41 | `eric-feedback-ingest` | `ff3d886` | 1 | 5 (1 / 4) | Ingests Eric's emailed screen-by-screen feedback to `knowledge/client-feedback/2026-08-25-eric-screen-feedback.md` and folds it into `tracking/backlog-epics.md`. | PASS | yes (0 files) | PASS |
| 42 | `artifact-roster-questions` | `a3f22ee` | 1 | 7 (0 / 7) | Carries the iOS roster change through the capacity arithmetic across four `tracking/` documents and rebuilds `artifacts/scribl-workshop-artifact.html`. Touches no `docs/` page. | PASS | no (27 files) | PASS |
| 43 | `b2b-stack-review` | `0034db0` | 1 | 4 (2 / 2) | Adds `knowledge/research/scribl-b2b-stack-review.md` and a standalone `b2b-stack-review.html`. | PASS | yes (0 files) | PASS |
| 44 | `kickoff-transcript-ingest` | `92a31fe` | 1 | 14 (6 / 8) | Ingests the 2026-08-25 Shape kickoff and standup transcripts (including two raw `.vtt` files) and extracts `tracking/eric-poc-change-requests-2026-08-25.md`. | PASS | no (24 files) | PASS |
| 45 | `team-briefing-html` | `9dbc45c` | 1 | 1 (0 / 1) | Adds `team-briefing.html` for the 2026-08-26 standup. One file, nothing else. | PASS | yes (0 files) | PASS |

Reading the `docs:sync` column. "Clean at head" means `npm run docs:sync`
followed by `git status --porcelain -- docs` produced nothing, so the branch's
committed `docs/` matches what its own generator produces from its own
sources. `origin/main` itself is **not** clean: it produces 24 changed or new
files. PRs 42 and 44 inherit exactly that 24-file drift from `main` because
they branched from `0f52c39` and did not re-sync; 42 adds 3 more of its own
(`docs/knowledge/team/roster.md`, `docs/sprint-zero.md`,
`docs/timeline-and-milestones.md`), for 27. PR 39's single drift file is its
own. See the drift section below.

Branch points differ and this matters. PRs 38 and 39 branched at `69c4fcf`,
PRs 41, 43 and 45 at `aa74a1c`, PRs 42 and 44 at current `main` (`0f52c39`).
The two oldest carry generated `docs/` produced from pre-renumber sources.

## Conflict matrix

All 21 pairs were computed with `git merge-tree --write-tree --name-only` on
the two branch heads. "Path overlap" is set intersection of the two diffs;
"conflict" is what git actually reports.

| Pair | Path overlap | Textual conflict |
|------|--------------|------------------|
| 38 x 39 | `scripts/docs-sync.mjs`, `docs/reviews/index.md` | Yes. Content conflict in `scripts/docs-sync.mjs`; modify/delete on `docs/reviews/index.md` (38 deletes it, 39 modifies it). |
| 38 x 41 | `scripts/docs-sync.mjs` | Yes, but not there. `docs-sync.mjs` auto-merges; `docs/backlog-epics.md` conflicts. |
| 38 x 42 | `tracking/client-priority-to-delivery-week.md` | Yes, but not there. That file auto-merges; `package.json` conflicts (and that conflict is against `main`, not against 42 -- see below). |
| 38 x 43 | `docs/knowledge/index.md` | Yes. Content conflict in `docs/knowledge/index.md`, plus a file-location warning: 43 adds `docs/knowledge/research/scribl-b2b-stack-review.md` inside a directory 38 renamed. |
| 38 x 44 | `knowledge/meetings/index.md`, `knowledge/meetings/standups.md`, `docs/knowledge/index.md`, `docs/knowledge/meetings/index.md`, `docs/knowledge/meetings/standups.md` | Yes. `docs/knowledge/index.md` and `package.json`. The two `knowledge/meetings/` source files auto-merge. |
| 38 x 45 | none | No. |
| 39 x 41 | `scripts/docs-sync.mjs` | Yes, but not there. `docs/backlog-epics.md` conflicts. |
| 39 x 42 | none | No. |
| 39 x 43 | none | No. |
| 39 x 44 | none | No. |
| 39 x 45 | none | No. |
| 41 x 42 | `tracking/backlog-epics.md` | Yes. `tracking/backlog-epics.md` and `docs/backlog-epics.md`. |
| 41 x 43 | none | No. |
| 41 x 44 | none | Yes. `tracking/backlog-epics.md` and `docs/backlog-epics.md`, from `main`-side history rather than shared paths. |
| 41 x 45 | none | No. |
| 42 x 43 | none | No. |
| 42 x 44 | none | No. |
| 42 x 45 | none | No. |
| 43 x 44 | `docs/knowledge/index.md` | No. Both add distinct entries and the hunks merge. |
| 43 x 45 | none | No. |
| 44 x 45 | none | No. |

Two things this table hides, both important.

**Path overlap is a weak predictor here.** Four of the five `scripts/docs-sync.mjs`
overlaps auto-merge; the one that does not (38 x 39) is the one where both
sides rewrote the generator. Conversely three pairs conflict on files neither
diff has in common, because the pairwise merge base is older than `main` and
`main`'s own commits show up on one side. That is why the recommendation below
comes from a sequential simulation, not from this table.

**Two PRs conflict with `origin/main` today, before any other PR lands.**

- PR 38: `package.json`. `main` added `"workshop:build"` at `532be39`; 38 added
  `"test:docs-sync"` and extended `"test"` on the adjacent lines. Trivial to
  resolve, keep both.
- PR 41: `tracking/backlog-epics.md` and its rendered `docs/backlog-epics.md`.
  Not trivial. 41 branched at `aa74a1c`, before `main`'s epic renumber and the
  three new epics landed in `532be39`, and it edits the same 95 KB file.

Neither can land as-is regardless of order. Both need a rebase onto `main`
first.

## Recommended land order

**45, 43, 42, 39, 41, 44, 38.** Then one `docs:sync` regeneration commit.

Verified by replaying the whole sequence with `git merge-tree` onto
`origin/main` (five orders were tried; nothing was pushed). This order gives
two conflicted steps touching six files. The obvious alternative, 38 first
because it is the biggest, gives five conflicted steps.

| Step | PR | Result in simulation | Why here |
|------|----|----------------------|----------|
| 1 | 45 | clean | One new HTML file, zero overlap with anything. Free. |
| 2 | 43 | clean | Two new files plus one generated page. Its only entanglement is with 38, so it goes before 38. |
| 3 | 42 | clean | Seven source files, no `docs/` page touched at all. Its `tracking/backlog-epics.md` edit conflicts with 41, and 42 is the smaller change, so 42 goes first and 41 rebases onto it rather than the reverse. |
| 4 | 39 | clean | Additive `handbook/engineering/` section. Its `docs-sync.mjs` change is a small path-separator fix that conflicts only with 38's rewrite, so it must precede 38. |
| 5 | 41 | CONFLICT: `tracking/backlog-epics.md`, `docs/backlog-epics.md` | Unavoidable, it already conflicts with `main`. Rebase 41 onto the current head, redo the `backlog-epics.md` edit against the renumbered epics, re-run `docs:sync`. |
| 6 | 44 | clean | Ordered after 41 by a hard content dependency, not by conflict: `knowledge/client-feedback/2026-08-25-eric-spoken-feedback.md` on 44 says in its own frontmatter that it is a "standalone companion, pending the written record landing on main", and names 41's file as what it should have enriched. Landing 44 first leaves that dangling reference in the wiki. Land 41, then land 44 and merge the two Eric notes. |
| 7 | 38 | CONFLICT: `package.json`, `scripts/docs-sync.mjs`, `docs/knowledge/index.md`, `docs/reviews/index.md` | Last, deliberately. 38 is the only PR that renames directories and deletes 42 rendered pages. Every conflict it has is either a one-line `package.json` merge or a generated file that `docs:sync` reproduces. Resolve the two source files by hand, then delete the `docs/` conflicts and re-run `docs:sync`. Landing 38 first pushes six of the seven remaining PRs into conflicts against a moved tree. |

Where two orders are defensible: steps 2 and 3 (43 and 42) are
interchangeable, and either can move anywhere before step 7. I put 43 second
only to get it clear of 38. Steps 1 through 4 could be landed in any internal
order and all four simulate clean.

Where the order is not negotiable:

- 39 before 38. Both rewrite `scripts/docs-sync.mjs`. 39's change is three
  lines about path separators; 38's is a hardening rewrite with new unit
  tests. Rebasing 39's three lines onto 38 is cheap; rebasing 38 onto 39 is
  not.
- 41 before 44. Content dependency, stated on the branch itself.
- 38 last. Five candidate orders were simulated; 38-last was the only shape
  that kept the conflicted-step count at two.

Whoever lands 38 owns re-running `docs:sync` on the merge result. 38's
committed `docs/` tree was generated from `69c4fcf` sources. All 17 of the
drift-overlapping generated files in 38 differ from what `main`'s generator
produces today, checked file by file with `cmp`. Merging 38's `docs/` verbatim
would put pre-renumber epic pages back on the site.

## The `docs/` drift, and what to do about it

**The finding.** `origin/main` at `0f52c39` is stale against its own
generator. `npm run docs:sync` on a clean `origin/main` checkout reports
"synced 169 page(s)" and leaves 24 files dirty: 20 modified
(`docs/backlog-epics.md`, `docs/board-selection.md`,
`docs/client-priority-to-delivery-week.md`, `docs/epic-board-mapping.md`,
`docs/epics/{e00,e03,e04,e05,e07,e08,e09,e10,e11,e12,e13,e14,e15}.md`,
`docs/epics/epics.json`, `docs/epics/index.md`, `docs/reviews/index.md`) and 4
new (`docs/epics/e16.md`, `e17.md`, `e18.md`,
`docs/reviews/2026-08-24-wiki-ia-audit.md`).

**The cause, traced.** `docs:sync` at `aa74a1c` leaves zero files dirty. At
`532be39` it leaves 24. That commit, "Carry the renumber and the three new
epics into the meta repo", landed as part of PR 40 and edited `tracking/`
sources without re-running the generator. This is one commit's omission, not
accumulated rot.

**Does landing these PRs regenerate the drift into their diffs?** Partly, and
not evenly. PR 38 already carries 17 of the 24 drift paths, PR 39 carries 2,
PR 41 carries 1, and PRs 42, 43, 44 and 45 carry none. But not one of those
carried files matches what `main`'s generator produces today. 38's are
generated from pre-renumber sources; 39's `docs/reviews/index.md` differs;
41's `docs/backlog-epics.md` differs. So no PR resolves the drift, and three
of them re-encode a stale version of it.

**Recommendation: land the drift as its own commit LAST, after all seven. Do
not land it first.**

This was simulated both ways.

- Drift commit first, then order 45/43/42/39/41/44/38: three conflicted steps,
  16 conflicted files. The regeneration commit collides with PR 39
  (`docs/reviews/index.md`), and then with PR 38 on thirteen files, including
  eight modify/modify conflicts on `docs/epics/e08.md` through `e15.md` and
  modify/delete conflicts on pages 38 deletes outright.
- Drift commit last: two conflicted steps, six conflicted files, and the
  regeneration commit is by construction conflict-free because it sits alone
  on top.

The mechanism is simple and worth stating plainly, because it is the thing
that would waste the day. This repo commits its generated output. A commit
that touches nothing but generated files therefore has maximal surface against
every other PR that also committed generated files, and zero of that surface
is real disagreement. Landing it first buys nothing and forces a human to
hand-resolve sixteen files of generator output.

What I would do, concretely:

1. Land 45, 43, 42, 39 as-is. All four simulate clean against `origin/main`.
2. Rebase 41, redo its `tracking/backlog-epics.md` edit against the
   renumbered epics, land it.
3. Land 44, merging its Eric note into 41's.
4. Rebase 38. Resolve `package.json` by keeping both scripts, and
   `scripts/docs-sync.mjs` by keeping 38's rewrite with 39's path-separator
   fix re-applied on top. Do not hand-resolve the `docs/` conflicts either
   way. Delete those files, run `npm run docs:sync`, commit what it writes.
5. Land one final commit, `npm run docs:sync` on the merged head, message it
   as regeneration only.

For reference on step 5's size: after landing the four clean PRs (45, 43, 42,
39) plus 44, a simulated merge head re-synced to 26 dirty files. The final
number after 41 and 38 land is unverified, because both need a human rebase I
did not perform.

**The real fix, one line.** The drift exists because nothing enforces
`docs:sync`. `npm test` on `main` runs `test:content && test:jira &&
test:schedule` and never checks that `docs/` matches its sources. PR 38
already adds `test:docs-sync` (`scripts/test-docs-sync.mjs`), but that tests
the generator's logic, not the tree's freshness. Add a gate that runs
`docs:sync` and fails on a dirty `docs/`, and this class of drift cannot
recur. Recommendation only, out of scope for this page.

## Triage: anything worth closing rather than landing

Nothing here should be closed. All seven pass `npm test` and `docs:build` at
their heads, and all seven carry content that is not on `main`. Two
observations for whoever lands them:

- PRs 41 and 44 both ingest Eric's 2026-08-25 feedback, 41 from his email and
  44 from the kickoff transcript, into two separate files
  (`2026-08-25-eric-screen-feedback.md` and
  `2026-08-25-eric-spoken-feedback.md`), and both write a `tracking/`
  extraction of his change requests (`jira-updates-2026-08-25-eric-feedback.md`
  and `eric-poc-change-requests-2026-08-25.md`). That is one topic split across
  four files by two workers who could not see each other. Landing both leaves
  a reader two documents where they want one. Worth a merge pass after step 3,
  not a close.
- PR 38 is the stalest at eight commits from `69c4fcf` and the largest at 136
  files, and it is the only PR whose committed `docs/` would regress `main`.
  It is also the only PR that fixes the generators. Land it, but land it last
  and re-sync it.
