---
title: "scribl board selection"
project: scribl
type: planning
status: draft for team review
updated: 2026-08-20
---

# scribl board selection

Rob narrowed the scope. His words: he does not want all of this on the board,
there is too much in it. He named the capacity arithmetic specifically,
because that is what the team needs to lay against the sprints, who is on
what and what it looks like. This page supersedes the broader manifest from
the earlier meta survey. A list of everything is not a selection, so the
rejections below carry as much weight as the inclusions.

## In, five items

### 1. The capacity arithmetic

Source: `tracking/backlog-epics.md`, the "Capacity arithmetic" section,
specifically the supply-and-demand-per-lane table and the three numbers
under it.

Earns board space because Rob named it and because it is the one fact that
changes what the team agrees to.

Shape on a board: four lane columns, each with its supply drawn as a fixed
number of empty slots (30, 39, 30, and Pankaj's share inside the backend
column). Cards fill slots. Overflow cards sit outside the frame with nowhere
to go. Make the frame the constraint, so filling past it is physically
visible rather than arithmetically true.

### 2. The sprint 1 ranked queue

Source: `tracking/backlog-epics.md`, "Sprint 1, restated as a ranked queue
with a cut line."

Shape: four vertical lanes, cards in rank order, one hard horizontal line
drawn across all four lanes at capacity. One line, not four. The cut line is
the whole artifact; if each lane gets its own line, the reader sees four
local decisions instead of one sprint.

### 3. The dated calendar

Source: [Timeline and Milestones](/timeline-and-milestones), "The calendar,"
itself off the confirmed meeting plan.

Shape: a single horizontal band, four phase segments, the four demo
Wednesdays as fixed markers, and the three holiday collisions as marks on
the band rather than notes under it.

### 4. The milestone view, what is true and what is not yet true

Source: [Timeline and Milestones](/timeline-and-milestones), "Milestones."

Shape: one column per milestone, and the "not yet true" half must occupy the
same space as the "true" half. If it is smaller it reads as a footnote, and
it is the half a client needs.

### 5. The two gates on the anchor demo

Source: `tracking/open-questions.md` Q5, plus E07-F1, E07-F3 and E07-F4. And Q17
with Q49, plus E01-F1 and E01-F2.

Both, not just Q5. Q5 decides whether there is a build a tester can install.
Q17 and Q49 decide whether there is a back end for it to talk to. The
week-four demo needs both, so putting only Q5 on the board would leave the
other half of that milestone looking like a lock when it is not.

Shape: two gate markers sitting on the week-four milestone itself, not cards
in a risk list. They are the conditions on the anchor demo and they belong on
the anchor demo.

## Out, and why

- **The 76 feature cards.** This is the "too much in it" Rob is reacting to.
  The board is for laying work against sprints; feature-level detail is what
  the clickable HTML view and later SCRIBL are for. Rejected.
- **The board mapping table, all twelve items.** It maps this page back to
  the kickoff board. The board it maps from is the board. Rejected as
  circular.
- **The metadata field dictionary.** Jira import plumbing. Nobody reads it at
  a standup. Rejected.
- **The staffing options 2 and 3, and their cost multipliers.** This is the
  hard call, and the answer is no, not yet. Keep the arithmetic on the board
  and keep the options off it. A sticky reading "add two engineers, 57
  percent more team cost" hands the client a number before David Lawton, who
  owns that conversation, has framed it. Internal board only, and only after
  he has.
- **The full open-questions register.** Fifty-nine rows is a different
  artifact with its own page. Put the five that gate these eight weeks on the
  board (Q5, Q8, Q17 with Q49, Q44, Q48) and leave the rest where they live.
- **E18, the parked capability.** It matters to the record and it is wrong
  for a planning board. To a client it reads as a list of things that were
  taken away. Keep it in the backlog page where its framing survives.

## Must not reach a client-visible board

- The E03 false history sentence. It is corrected in the backlog. Do not let
  a copy of it survive on a board. It is a false statement to Eric Rice on
  the one topic he was emphatic about.
- The single-points-of-failure read, and any card that names a person as a
  risk. "One sick week is a slipped demo" is true and necessary internally.
  Naming individuals as risks on a client-visible surface is not acceptable.
- Pankaj's 0.6 allocation and Q26. Internal staffing.
- The QA execution funding gap stated raw. It is a Bounteous quality
  problem. It reaches the client as E06-F3, the priced coverage commitment,
  which is the same fact in a form the client can act on.
- The staffing cost multipliers, per the rejection above.

## See also

- [Backlog: Epics and Features](/backlog-epics) for the feature detail this
  page deliberately leaves off the board.
- [Open Questions](/open-questions) for the register this page draws the
  five gating rows from.
