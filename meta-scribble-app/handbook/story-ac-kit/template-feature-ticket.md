# Feature Ticket Template (the filed backlog shape)

The standard shape of a feature ticket filed into the SCRIBL Jira project from
this hub's backlog (`tracking/backlog-epics.md`, `tracking/backlog-sprint0.md`).
Every filed epic, story and spike follows this layout, so a reader can find the
same information in the same place on every ticket.

This is the intake shape, one stage before the four-section contract in
`template-issue-work-item.md`. A ticket in this shape is filed, sequenced and
priced; it is not Ready. Before an agent session executes it, the description
gets upgraded to the four-section contract (Outcome, Acceptance criteria,
Scope, Explicitly out of scope) with EARS-form criteria per the
`ears-acceptance-criteria` skill. The QE (draft) block below is the raw
material for that upgrade, not a substitute for it.

## Summary line

- Feature: `E<nn>-F<n> <title>`, the wiki's exact title.
- Epic: `E<nn> <title>`.
- The `E<nn>-F<n>` id is the join key back to the hub backlog. Never reuse a
  retired id.

## Description body, in order

Blocks 2 to 5 are the Frontend / Backend / QE separation. A block that does
not apply (a backend-only feature has no screen; a spike has no QE block) is
omitted, not left empty.

1. **Lead paragraph.** What the feature is and why it exists, two to five
   sentences. Decision-register citations inline (`register 2.5`), POC
   divergences stated plainly.
2. **Frontend.** What the screen does and how it behaves, drawn from the
   screen page under `product/prototype/screens/`.
3. **Backend.** The endpoints by method and path, and where they sit in the
   backend layering. Taken from the screen page's Data calls table.
4. **Reads/writes.** What the feature reads on entry and writes on exit, from
   the screen page's State in, state out section.
5. **QE (draft).** Happy path, edge cases, and the named test tier for each.
   The block opens with this standing line, verbatim:
   `Draft cases for QE review. These become EARS-form acceptance criteria per
   the story-ac-kit before the item is Ready; they are inputs to that pass,
   not a substitute for it.`
6. **Screen.** The screen named before any link, so the reader knows which
   screen it is before clicking:
   - `Screen: <route> (<page>.md)` on its own line, for example
     `Screen: /sign-up (sign-up.md)`.
   - Wiki entry: the GitHub link to the screen page.
   - Capture: the GitHub link to the capture PNG. This is a link, not an
     embed; inline display needs a manual attachment upload.
   - `Features on this screen:` the feature list from the screen page's
     Features table, one line each, so the ticket shows what the screen
     actually does beyond this feature.
7. **Engineering context.** The stack named concretely, not by feel: the
   build repo (ScriblOrg/scribl-mobile-app, pnpm workspace monorepo), the
   relevant layering from `handbook/engineering/architecture.md`, and the
   test tiers from `handbook/engineering/engineering-standards.md` section 4
   that apply, invariant tests first as launch gates for anything touching
   authorization, contract tests against `packages/contracts` for anything
   crossing the app/backend boundary.
8. **Size.** `Size (rough): <n> <lane>-days` from the backlog, or
   `Size: not sized`.
9. **Flagged risk.** Present only when the ticket sits on a recorded
   contradiction (POC pattern versus decision register, or two register
   entries that disagree). Names the register entry and the risk. A flagged
   risk travels as a risk; filing it does not resolve it.
10. **Undecided.** Open questions stay open, named by their `Q<n>` label or
    register entry. Do not invent scope to make a ticket look finished; an
    undecided line that says what is undecided and who owns the call is the
    finished state.
11. **Links.** Every link points at GitHub (the host resolves from
    `project.json` `brain_repo`, the same source `scripts/build-backlog-epics-v2.py`
    uses; never Bitbucket, archived 2026-09-02):
    - Hub source of truth: the backlog page, with the `E<nn>-F<n>` anchor
      named in parentheses.
    - Flow: the workflow page when the feature sits in a flow.
    - Decision register, when the body cites it.
    - Format: this template,
      `handbook/story-ac-kit/template-feature-ticket.md`.

## Field conventions

- Labels carry the band (`GREEN`, `ORANGE`, `GRAY`, or `SPRINT0`), the lane
  (`iOS`, `Backend`, `AWS`, `QA`, `Platform`, `Product`, `Delivery`, or a
  joined form like `Backend-and-iOS`), open-question tags (`Q<n>`), and
  `rough-points` where the backlog sized the item. Updates replace the full
  label set.
- Stories and spikes parent to their epic. Dependencies are `is blocked by`
  links, created only when the target exists and not duplicated.
- No assignees, no story points, no status changes at filing time. Sizing
  stays in the body; assignment stays human.
- No em dash anywhere in a filed body.

## Spikes and epics

- A spike body replaces blocks 2 to 6 with **Question**, **Artifact**,
  **Unblocks**, then reasoning; a spike is done when its artifact exists.
- An epic body is the lead paragraph at epic altitude (why the epic exists
  and what fights it has to win), plus Links. Feature-level detail lives on
  the features.
