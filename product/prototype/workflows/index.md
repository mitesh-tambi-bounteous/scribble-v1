---
project: scribl
updated: 2026-09-01
---

# Prototype workflows

One page per flow. Flow names, numbering and membership come from the
[screen and flow inventory](/design/screen-flow-inventory); these pages do not
re-derive them, so there is one answer in the repo to "which flow is this screen
in."

| Flow | What it gets a person through | Screens |
|------|-------------------------------|---------|
| [F1 Launch and authentication](/prototype/workflows/f1-launch-and-authentication) | Cold start to either onboarding or today's prompt | 3 |
| [F2 First-run onboarding](/prototype/workflows/f2-first-run-onboarding) | Making a first Scribl before seeing the app proper | 7 |
| [F3 Invite and join](/prototype/workflows/f3-invite-and-join) | Accepting an invite and landing in the wall that sent it | 3 plus F2 in full |
| [F4 Daily create and submit](/prototype/workflows/f4-daily-create-and-submit) | The daily loop: see the prompt, draw it, caption it, post it | 6 |
| [F5 Wall browsing and composition](/prototype/workflows/f5-wall-browsing-and-composition) | Looking at what people posted, reacting, combining drawings | 4 |
| [F6 Share outside the app](/prototype/workflows/f6-share-outside-the-app) | Taking one response out of Scribl | 2 |
| [F7 Wall creation and administration](/prototype/workflows/f7-wall-creation-and-administration) | Starting a wall, adding people, choosing what it asks | 4 |
| [F8 Account and profile](/prototype/workflows/f8-account-and-profile) | Name, email, avatar, theme | 3 |
| [F9 Catch-all](/prototype/workflows/f9-catch-all) | The 404 | 1 |

Screen counts overlap. A screen sits in more than one flow often enough that the
column sums past 28: `/home` is in four flows, `/family` in four. The
[screens index](/prototype/screens/) lists all 28, grouped by the flow each
one leads with.

## What a workflow page carries

F2 is the fullest example. Every flow page has these sections, in this order:

1. **Provenance** -- which commit the code facts come from, which capture the
   tiles come from, and where the flow's name and membership come from.
2. **The journey** -- a Mermaid diagram. Solid arrows for the forward path
   carrying the real button label, dashed for guards and bounces, grey nodes for
   screens that belong to another flow. Then prose for each hop.
3. **Screens in this flow** -- route, what it is for, link to its screen page.
4. **Guards and forks** -- every place the flow refuses to advance, bounces
   back, or branches. This is where most of the planning conversation lands, so
   it gets its own section rather than a footnote.
5. **What the capture shows** -- the real tiles in journey order, with a plain
   statement of anything a tile fails to show.
6. **Notes for planning** -- the judgement calls, marked as authored here rather
   than read out of the app.

F9 skips the diagram. A two-node chart for a one-hop flow is worse than a
sentence, and the page says so.
