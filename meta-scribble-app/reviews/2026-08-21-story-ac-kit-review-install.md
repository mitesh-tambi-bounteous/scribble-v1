# Stage review: story/AC kit review and install (2026-08-21)

Reviewed David Lawton's story and acceptance-criteria kit (PR 90 on his
arc-ideation repo) and installed it into this repo: four skills under
`.claude/skills/`, the `/start-work-item` launcher under `.claude/commands/`,
guidance and templates at `s2d/handbook/story-ac-kit/` with a team usage doc
at its index. The full ranked review went in the PR body and the handoff,
deliberately not into this rendered site.

## What went well

- The kit installed almost unchanged. No hardcoded project keys, board ids,
  or credentials anywhere; everything is placeholder-driven. The
  `clients/scribl/` wrapper dropped cleanly per the install notes.
- Loading was verifiable cheaply: a fresh headless session started in the
  repo lists all four skills and the command.

## Friction, and fixes worth keeping

- The repo's no-em-dash rule collided with the kit's load-bearing
  "Scope -- modules and files in play" heading and the V3 priority literal.
  Converted to " -- " consistently across every installed copy so the skill
  binding stays self-consistent. If David's markdown-to-Jira sync scripts
  arrive, their parser expects the em-dash priority literal; reconcile then.
- VitePress reads bare `<placeholder>` text in markdown as HTML tags and
  fails the build. Template and guidance docs full of `<KEY>`-style
  placeholders need those wrapped in backticks before they land in
  `s2d/`. Worth a docs-sync lint rule.
- `npm run docs:build` fails on this branch in a pre-existing page
  (`docs/sow-mobile-app-development-extract.md:406`, untouched here), so
  green-build verification of new doc pages is not currently possible on a
  branch cut from this point. `docs:sync` plus targeted page checks was the
  workaround.

## Playbook note

The kit's filing pipeline depends on sync scripts its author deliberately
excluded. When ingesting a kit from another repo, check first for the
"described but not shipped" pieces; that gap, not the docs, decides whether
the thing is runnable.
