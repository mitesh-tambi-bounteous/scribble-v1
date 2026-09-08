# artifacts

Finished, self-contained deliverables. One file each, no build step to read
them, nothing here is generated into the VitePress site.

| File | What it is | Built by |
|------|------------|----------|
| `scribl-workshop-artifact.html` | The Shape kickoff walkthrough: the kickoff board, the rules, the roster, the meeting cadence, the open questions, and one page per epic, E00 through E18 | `npm run workshop:build` |
| `scribl-backlog-epics-v2.html` | The backlog read against the app that exists: every epic E00 to E18, every feature, and the capture of each POC screen next to the feature it backs | `npm run backlog:v2` |
| `access-runbooks.html` | The three access asks: Apple accounts, AWS access, GitHub access, the one-page email version, and the roster with the seat each person needs | Hand-authored |
| `shape-review-2026-09-04.html` | **Private, not client-facing.** Rob's live talk track for the 2026-09-04 Shape Review: the four blocks, an hour clock with per-section budgets and overtime carry-forward, and capture fields that export to the wiki | Hand-authored |

## Rules for this directory

- **One file, no dependencies.** Everything an artifact needs is inline: no CDN,
  no web fonts, no images fetched at open time. It has to work from a `file://`
  URL on a machine with no network and no repo checkout.
- **Generated, not hand-authored.** Every artifact here is the output of a
  script under `scripts/`, so it can be rebuilt when its sources move. If you
  find yourself editing the HTML, edit the generator instead. `access-runbooks.html`
  is the exception and is marked as such in the table: it was hand-authored
  against a standup deadline and has no generator yet. Treat that as debt, not as
  a second convention.
- **Brand tokens come from `index.html`.** Do not invent a look per artifact.
- **The committed file is the handed-over file.** What is in git is what went to
  the client. Git history is the archive; do not keep dated copies alongside.
- **Client-facing unless the file says otherwise.** `shape-review-2026-09-04.html` says
  otherwise. It is Rob's private operating surface for one meeting, it is never shown on
  screen or sent to the client, and it deliberately carries internal notes the rest of this
  directory must not.
  Everything else here goes to the client, so it carries no internal capacity or
  staffing arithmetic, no fees, no per-person day counts, and nothing from
  `reviews/` or `knowledge/meetings/raw/`.
