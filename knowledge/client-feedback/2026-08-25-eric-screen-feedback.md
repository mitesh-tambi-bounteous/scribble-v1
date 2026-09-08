---
date: 2026-08-25
type: client-feedback
title: Eric's screen-by-screen feedback
source: "Figma board \"Scribl-Feature-Prioritization\", transcribed (board not directly viewable)"
from: Eric Rice <eric@scribl.co>
received: 2026-08-25 09:19 CDT
context: sent 2h40m ahead of the 2026-08-25 12:00 CDT prioritization workshop
---

# Eric's screen-by-screen feedback -- 2026-08-25

Eric Rice sent this screen-by-screen feedback by email 2h40m before the
prioritization workshop. It carries decisions Scribl already made internally
plus their open questions, mixed together on the board. This note separates
the two per screen group and lifts every open item to one list up front,
because that list is the reason this document exists today.

Screen groups keep Eric's own numbering. Where his wording carries a decision,
it is preserved.

This file cross-references the other three records from the same 2026-08-25
feedback pass. See "The four Eric records" at the bottom for what each one is
for.

## Open questions for the workshop

- **01 & 02 Login / intro** -- should the Home and Profile buttons on 01 skip
  the daily prompt completely?
- **01 & 02 Login / intro** -- should Christina's branding for these screens
  be designed with any animation in mind?
- **05 Canvas** -- a trash button, for a clean slate? RESOLVED 2026-08-26:
  settled, wanted. See "05 Canvas / Decided" below.
- **05 Canvas** -- a more defined bounding box, possibly a function of the
  background? RESOLVED 2026-08-26: settled, it is the B2B theme's background
  treatment. See "05 Canvas / Decided" below.
- **05 Canvas** -- color layout and order, possibly primary over secondary?
- **13 Home** -- the sign-out button next to the avatar? RESOLVED 2026-08-26:
  settled, off the home screen, lives only on the profile page. See "13 Home
  / Decided" below.
- **11 & 16 Walls & Challenges** -- alignment on challenges once Eric has
  discussed them internally; he does not believe there are big changes but
  wants alignment before committing.
- **10 Sharing** -- what should be added to sharing to maximize impact and
  participation (story, platform formatting, animated replay, wayfinding,
  rewards)?
- **Artifact** -- whether the Artifact is in the MVP, and to what extent?
  STILL OPEN as of 2026-08-26. Do not assume this was settled alongside the
  three items above; it was not. Eric put the whole thing outside the eight
  weeks himself, "we realized that this could be a ways out, phase two,
  three, 4, whatever" (00:45:00), but whether and to what extent the Artifact
  is in the MVP has no answer yet.

## 01 & 02 Login / intro

### Decided

- 01 is the screen on opening the app after a user has already signed in on a
  device via 02.
- Christina handles the branding of these screens.
- Scribl team handles copy.

### Open questions

- Should the Home and Profile buttons on 01 skip the daily prompt completely?
- Should these screens be designed with any animation in mind?

## 05 Canvas

### Decided

- Mimic the drawing canvas from the current B2B version of the game in
  simplicity and feel; the latest version on the board, post the onboarding
  update, is closer to the target.
- The canvas should have: a single brush size, similar weight to B2B; an undo
  button; eight colors.
- The eight colors, exact: `#db0632` red, `#f58c29` orange, `#ffd93b` yellow,
  `#afd129` light green, `#1d864a` dark green, `#99d9d9` light blue,
  `#20145f` dark blue, `#d51668` magenta.

  SUPERSEDED 2026-08-25: nine swatches, provisional, the eight above plus
  white. Eric asked for white explicitly on the call and named the internal
  disagreement himself: "I think you know white and race would be
  interchangeable. Let us, we'd probably just have you add a white option.
  Let us talk about it a little bit more. There seems to be some differences
  of opinion." (Eric Rice, 00:27:17). Rob decided to ship it on 2026-08-25.
  White landed on scribl-app PR 35. This does not decide the eraser (C20):
  Eric tied the two together in the same breath, but only white was decided.
  The eraser is still NOT decided.
- Erase button follows the same brush size; could also be seen as a white
  color option. Still an open, Scribl-internal question, not a decision (see
  the swatch note above).
- Branding of this screen follows the overall look of the game per Christina's
  designs for other screens.
- Not ROYGBIV for color order (decided against; the actual order is open, see
  below).
- The avatar creation screen follows the same format as the canvas.
- SETTLED 2026-08-26: a trash button that clears the canvas, behind a pop-up
  confirmation. The confirmation is a defect fix, not a feature: Abby cleared
  a finished drawing by mis-tapping in this POC (Eric Rice, 00:22:14 to
  00:22:35). Matthew Kaplan objected on scope-creep grounds, "it's just a lot
  more buttons that people will start to strive for perfection" (00:23:05 to
  00:23:15), and never withdrew it. Rob's decision is to build it. The
  objection stands next to the decision, unsoftened.
- SETTLED 2026-08-26: a more defined bounding box, coming from the B2B
  theme's background treatment rather than separate chrome. Source: Eric
  Rice, 00:23:45 to 00:23:57, "we have a very defined one in the B2B game. I
  think it might just be a function of the background."

### Open questions

- A trash button, for a clean slate? RESOLVED 2026-08-26, see Decided above.
- A more defined bounding box, possibly a function of the background?
  RESOLVED 2026-08-26, see Decided above.
- Color layout and order, possibly primary over secondary?

**Contradiction with the backlog.** `tracking/backlog-epics.md` `E04-F1`
currently specifies one brush, four sizes, and six fixed inks (from the
client's earlier canvas frame). This feedback decides a single brush size and
eight named colors instead. Both are now recorded in the backlog; reconciling
which one ships is Rob's call in the workshop.

SUPERSEDED 2026-08-25: the "eight named colors" line above is nine,
provisional, the eight plus white. See the swatch note in Decided above. The
eraser (C20) is still not decided.

## 13 Home

### Decided

- The home screen feels good overall.
- Christina handles the branding here; Scribl team handles copy.
- SETTLED 2026-08-26: sign-out is off the home screen and lives only on the
  profile page. Source: Eric Rice, 00:28:13 to 00:28:51, "Most of the time
  these days, I'm seeing logout buried kind of in your personal options...
  it's pretty much regulated to the, you know, the profile options section
  now."

### Open questions

- The sign-out button next to the avatar? RESOLVED 2026-08-26, see Decided
  above.

## 11 & 16 Walls & Challenges

### Decided

- Short-term, challenges are simply a new prompt injected into the wall,
  created one of three ways: user-created or custom; chosen from a list of
  pre-written prompts, which may be organized by themes or packs similar to
  B2B (including the prompt with this was called out as key); generated by
  Claude based on previous input from members of that wall.
- Additional gamified features that enliven this could be considered given
  time and input for testing.

### Open questions

- This is the section Scribl has discussed the least internally. Eric will do
  so before the meeting; he does not believe there are big changes but wants
  alignment.

**Contradiction with the backlog.** `tracking/backlog-epics.md` `E18-F2`
(parked) specifies challenges as a blind draw-off with a custom word, a time
limit, server-enforced blindness until reveal, and a star-rating leaderboard.
This feedback's short-term concept is a simpler prompt-injection mechanic with
three sourcing paths, no draw-off or leaderboard mentioned. Both are now
recorded; reconciling is Rob's call.

## 10 Sharing

### Decided

- Sharing is surfacing as one of the most important features to Scribl's
  stakeholders.
- In the current B2B version, users can share a drawing from that session with
  a branded prebuilt background, including the prompt with this was called out
  as key.
- Christina handles the branding for the output.

### Open questions

- What should be added to make the most impact and ensure participation:
  including the story, either text or voice; formatting for specific
  platforms; animating the act of drawing over time; wayfinding and
  encouragement; rewards or recognition for shares.

**No backlog home.** External/social sharing of a drawing (this screen) is
not covered by any filed epic; `E05-F3` covers picking which internal walls a
submission posts to, not sharing outside the app. Recorded under Net-new
below.

## Artifact

### Decided

- A manual option, similar to B2B, where users choose, manipulate and arrange
  the art, has proven engaging.
- The Artifact is a rewarding ending to the experience and also adds:
  additional options for content creation and sharing; replay value and
  retention; potential avenues for future monetization; display options for
  events, ReInvent named.

### Open questions

- Whether the Artifact is in the MVP, and to what extent.
- Discovery was done with Mission to automate it. It would need additional
  work to get it right.

## Design ownership

Christina takes 01/02 login/intro, 13 home, and 10 sharing output. Eric
believes that is enough to influence everything else; Eric or Alex supplement
from there.

## Net-new, no backlog home

Six items surfaced across this feedback and prior conversations have no filed
epic or feature. Recorded here rather than inventing epics for them; filing
is the workshop's job.

1. Sharing personal / external sharing of a drawing (screen 10, this
   feedback) -- story or voice, platform-specific formatting, animated
   drawing replay, wayfinding, rewards for shares.
2. Picking multiple pictures.
3. Grouping them.
4. Comments -- deferred at the 2026-08-19 kickoff; if built, would ship as a
   per-wall-host toggle (see `E05-F6`).
5. Wall-creator toggles (paired with comments above).
6. Monetization -- infrastructure hooks decided at kickoff to exist even if
   switched off at launch; no dedicated epic exists. This feedback's Artifact
   section separately names monetization as a future avenue.

Items 2 and 3 are not elaborated further in this feedback pass; they carry
forward from the client's covering email with no additional detail to record.

## The four Eric records, and what each is for

This file is one of four records from the 2026-08-25 feedback pass. Reconcile
them, do not merge them; each does a job the others do not.

- `knowledge/client-feedback/2026-08-25-eric-screen-feedback.md` (this file).
  The emailed written record. What Eric wants, screen by screen, in his own
  numbering.
- `knowledge/client-feedback/2026-08-25-eric-spoken-feedback.md`. The call.
  Why he wants it. Reasoning only, cites C-keys rather than restating
  requests.
- `tracking/eric-poc-change-requests-2026-08-25.md`. The single enumerated
  change list, C01 to C26. The one place a request is counted.
- `tracking/jira-updates-2026-08-25-eric-feedback.md`. The Jira-shaped
  paste-ready excerpt, keyed to SCRIBL issue numbers.
