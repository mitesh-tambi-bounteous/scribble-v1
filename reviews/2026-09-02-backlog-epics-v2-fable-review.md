# Fable review: scribl-backlog-epics-v2 artifact and generator

Date 2026-09-02. Reviewed at commit 556ae20 on `backlog-epics-v2-fable-review`
(a snapshot; a parallel worker may have amended the branch since). Scope per
brief t102/t116: data accuracy, screen mapping, generator, prose, render.

## Verdict

Share it. The artifact is accurate, byte-reproducible from its sources, and
reads well. One stale number in an authored note (the "105 features" below) is
worth a two-minute fix and rebuild first, because it is exactly the kind of
figure a careful client reader reconciles against the overview and trips on.
Nothing else visible in the page rises above polish.

## What was verified, and how

- Rendered the file from a `file://` URL in headless Chrome and read four tabs
  (Overview, Coverage top and bottom, E02, E18, E00). All render clean, tabs
  honor `#tab-<id>`, every screen row shows its capture, no raw markup, no
  empty boxes.
- Rebuilt with `npm run backlog:v2`. Exit 0, output byte-identical to the
  committed file. The committed artifact is in sync with its sources at this
  HEAD.
- Recomputed every stated count from the sources. All hold: 19 epics, 102
  features in (87 ratified + 15 E00 spikes), 25 added (per-epic NEW chips
  E02=9, E03=4, E04=4, E05=7, E18=1 sum to 25), 3 retired, 127 out, 28 screens
  (map keys and screen pages match 1:1 both ways), 9 flows with per-flow reach
  3/7/10/7/4/2/6/3/1 matching the map, coverage 10 covered + 15 extends +
  3 gap + 0 unmapped = 28, "10 of 28 needed no change" matches.
- All 87 ratified feature ids, titles, and statuses match
  `tracking/backlog-epics.md` verbatim under the correct epic. All 15 E00
  spikes present. Jira keys and bands match `tracking/epic-board-mapping.md`;
  E09-E18 correctly read "not yet filed in Jira".
- The 556ae20 retirement is fully reflected. E18-F1/F2/F5 render as retired
  with date and reasons, ids not reused, none cited as live anywhere in the
  map, and E04-F1 carries the post-retirement title. The generator enforces
  retirement at parse, allocation, and render.
- Spot-checked 10 screen verdicts against the screen pages and the cited
  feature text (including /settings, /draw, /record, /response/[id],
  /wall/[id]/members). All defensible; the /settings gap claim is correct,
  nothing in the backlog covers account and profile management.
- Escaping audit of the generator found no path where source text reaches the
  page unescaped. Prose lint of the rendered text is clean: no em or en dash,
  no emoji, no unicode arrows, no absolute paths, no banned vocabulary.
- Offline claim: the only external references are Jira issue links, which are
  navigation, not fetched resources. Every image is an inline data URI.
  `scripts/check-artifact-offline.mjs` could not run here (playwright is not
  installed in this environment), so that gate is unexercised, not failed.

## Findings

### Blockers

None.

### Should-fix

1. **Stale count "the 105 features" in the /settings note.**
   `scripts/data/screen-backlog-map.json:497` opens "Nothing in the 105
   features covers account and profile management." 105 was the pre-retirement
   total (90 ratified + 15 spikes); the artifact's own overview now says 102 in
   and 127 out, so the page contradicts itself for a reader who checks. Fix the
   note (say "the backlog" or "102 features") and rebuild.
2. **Provenance constants can go stale silently.** `APP_COMMIT`, `TILE_COMMIT`,
   `TILE_DATE` at `scripts/build-backlog-epics-v2.py:53-55` match
   `product/prototype/index.md` today, but nothing cross-checks them at build
   time. The script already reconciles the backlog against a second dumber
   scan; the same discipline applied here (scrape one value from the Prototype
   index and die on mismatch) closes the one remaining way this artifact can
   lie without failing.

### Polish

3. **"1 screens" in the flow reach table.** F9 renders "1 screens"
   (`scripts/build-backlog-epics-v2.py:738` hardcodes the plural).
4. **Stale E04-F1 title in a source table.** `tracking/backlog-epics.md:252`
   (the old Shape-estimate table) still says "six-ink reduced tool set"; the
   live feature and the artifact both carry the post-556ae20 title. Source-doc
   cleanup, does not affect the artifact.
5. **Hardcoded table-divider string in `parse_screen_page`**
   (`build-backlog-epics-v2.py:287`) matches exactly ten dashes instead of a
   shape check like the sibling parser uses. Harmless today, latent trap.
6. **The tile-exists invariant in `load_map` is accidental**, not stated: a
   missing `"tile"` key only dies because `None not in page_tiles` happens to
   hold. Worth one explicit check so a refactor cannot un-enforce the
   docstring's promise.
7. **`gap` verdicts are not required to carry a proposal**, unlike
   `maps`/`extends` which must cite a feature. All three current gaps do
   propose features, so nothing renders wrong; the asymmetry is just
   unenforced.
8. **A corrupt tile PNG fails the build with a raw PIL traceback** instead of
   the named `die()` message every other failure path gets.

### Observations, no action asked

- The E00 tab's framing cites Sprint 0 era numbers (76 features, 108 lane-days)
  that predate the current 87-feature backlog. They are quoted history from the
  sprint-zero sources and read as such in context.
- The /splash capture tile is a different shape from the phone-framed captures
  (it is the raw splash art). Noticeable in the Coverage table, not wrong.
- The retirement treatment on E18 is the strongest page in the artifact: dated,
  reasoned, ids listed as never reused. That is the pattern to keep.

## Caveat on staleness

This review is of the worktree snapshot at 556ae20. If the parallel content
pass (`backlog-epics-v2-html`) has pushed since, findings 1, 3, and 4 may
already be addressed; re-check those three against the branch head before
acting on them.
