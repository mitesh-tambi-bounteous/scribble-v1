---
title: "Jira description updates, drafted -- Eric's 2026-08-25 feedback"
status: draft, not yet applied to Jira
---

# Jira description updates, drafted

As of 2026-08-25, none of these updates had been applied to Jira. This is a
paste-ready draft of the description appendix for each affected SCRIBL issue,
correlated on `Enn-Fn`
and looked up against the live SCRIBL project (2026-08-25).

**As of 2026-08-26, this file is the single canonical home for Jira-shaped
draft text.** Where `tracking/eric-poc-change-requests-2026-08-25.md`'s
appendix used to carry its own wording for SCRIBL-41, SCRIBL-31 and
SCRIBL-52, that wording is now superseded there and the current draft lives
only here.

The written record's enumeration of what Eric asked for, screen by screen, is
in `knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`. The
reasoning behind each ask, cited by C-key, is in
`knowledge/client-feedback/2026-08-25-eric-spoken-feedback.md`. The single
enumerated change list, C01 to C26, is in
`tracking/eric-poc-change-requests-2026-08-25.md`. Backlog epic detail is in
`tracking/backlog-epics.md`. This file is the Jira-shaped excerpt of all of
that, keyed to SCRIBL issue numbers.

These rows are description and acceptance-criteria edits. Issue links are
supported if a row needs one: `linkIssues` in
`scripts/jira-sync/lib/jira.mjs`. Transitions are not, by this tool: the
filing scripts create and attach and never move an issue between columns
(`scripts/jira-sync/lib/render.mjs`, the status-values-reported-only line).
Transition through Jira itself or the Atlassian MCP server instead.

## SCRIBL-31 -- E02-F4 Guided onboarding, screens 1 to 8

Append:

> **Client feedback, 2026-08-25 (Eric Rice)**
> Decided (Rob, 2026-08-26): the returning-user onboarding screen leaves
> mobile scope. It existed only because the POC is a web app; per Eric, "The
> device I'm assuming is going to recognize the user post their first
> login... Is someone going to have to go through that every time?"
> (00:19:30), then "you log in once until you log out" (00:20:08). Rob:
> "on a mobile app, we don't need to do this... we can get rid of that
> screen for the mobile app users." (00:19:57).
> Requirement, still open which screen delivers it: the voice-or-text
> choice must be presented explicitly in onboarding. Eric: "We have to be
> like super implicit with this onboarding because we've learned a lot.
> It's that people just don't get stuff." (00:13:47). He neither asked for
> the removed split screen back nor endorsed its removal.
> Open: should the Home and Profile buttons on screen 01 skip the daily
> prompt completely? Open: should the login/intro screens (01, 02) be
> designed with any animation in mind? Christina owns the branding for these
> screens; Scribl's team owns the copy.

## SCRIBL-41 -- E04-F1 Skia canvas with the reduced tool set

Heading corrected 2026-08-26: this used to read "Skia canvas with the
six-ink reduced tool set". That wording is superseded, because the tool set
Eric described is not six ink colours; it is nine swatches (eight named
colours plus a provisional white) and one brush at one width. The heading
above is the current one.

Append (supersedes the appendix below dated 2026-08-26):

> **Client feedback, 2026-08-25 (Eric Rice), corrected 2026-08-26**
> One brush, one width, no size picker. The width is the second from the
> right of the four sizes on the client's own canvas frame, to be read off
> the frame rather than guessed; do not assert a pixel number. Eric:
> "the sizing that you just showed us, I think it was maybe second to the
> right was probably best" (00:25:15), restated at 00:26:04 as "second from
> the right". **Matthew Kaplan's dissent, unsoftened, never withdrawn:** he
> was holding a phone. He called the largest "massive": "that's massive...
> The smallest line on Rob's app on my phone is closest to the scribble
> game today" (00:25:23), then "I think that is either one, either that
> third one or 4th one to the right is probably close... I would say that
> third one is probably mimics mostly what we have today. So I would go
> with that one for the MVP." (00:25:52). Eric's reply was conditional, not
> a handover: "if you're on the phone and you think it needs to be smaller,
> then yeah, go for it." (00:25:49). Outstanding: shipped scribl-app code
> currently carries the client's own B2B width instead of Eric's pick, so a
> code change is outstanding there.
>
> Nine swatches, provisional (decided 2026-08-25 by Rob, shipped on
> scribl-app PR 35): the eight named colours -- `#db0632` red, `#f58c29`
> orange, `#ffd93b` yellow, `#afd129` light green, `#1d864a` dark green,
> `#99d9d9` light blue, `#20145f` dark blue, `#d51668` magenta -- plus
> white. Eric named the internal disagreement himself and asked for white
> anyway (00:27:17). Not ROYGBIV ordering.
>
> Undo stays, one step back. Decided: a trash button that clears the
> canvas, behind a pop-up confirmation, because Abby cleared a finished
> drawing by mis-tapping in this POC (00:22:14 to 00:22:35). Matthew Kaplan
> objected on scope-creep grounds, "it's just a lot more buttons that
> people will start to strive for perfection" (00:23:05 to 00:23:15), never
> withdrawn; the objection stands next to the decision to build it.
>
> Decided: the canvas bounding box comes from the B2B theme's background
> treatment rather than separate chrome. Eric: "we have a very defined one
> in the B2B game. I think it might just be a function of the background."
> (00:23:45 to 00:23:57).
>
> The eraser (C20) is still not decided. Scribl decides internally; do not
> build it yet.
>
> Corrected 2026-08-26: this description used to say eight colors with no
> white, presented the trash button and the bounding box as open, and said
> "not reconciled here" against a one-brush/four-size/six-ink spec. All of
> that is stale and is corrected above.

## SCRIBL-51 -- E05-F4 Wall grid and response detail

Append:

> **Client feedback, 2026-08-25 (Eric Rice)**
> Walls and challenges is the section Scribl has discussed least internally.
> Eric will align with his team before the workshop; he does not expect big
> changes but wants alignment confirmed.

## SCRIBL-52 -- E05-F5 Dashboard with Your Walls and the stats card

Append:

> **Client feedback, 2026-08-25 (Eric Rice), decided 2026-08-26**
> The home screen feels good overall. Decided: sign-out is off the home
> screen and lives only on the profile page. Eric: "I think the only
> question I had was about the logout button. Most of the time these days,
> I'm seeing logout buried kind of in your personal options... it's pretty
> much regulated to the, you know, the profile options section now."
> (00:28:13 to 00:28:51). This used to read as open ("placement of the
> sign-out button next to the avatar"); that wording is superseded as of
> 2026-08-26. Christina owns branding here; Scribl's team owns copy.

## Not yet filed -- detail lives in tracking/backlog-epics.md only

These `Enn-Fn` codes have no SCRIBL issue yet (epics E12, E13, E17 and E18
are not filed). Nothing to edit in Jira; carry the detail forward when the epic is
filed.

- **E18-F2 Challenges** (parked epic E18) -- Eric's short-term concept
  contradicts the existing blind-draw-off/leaderboard spec: challenges as a
  simple new prompt injected into the wall, sourced one of three ways
  (user-created/custom; a pre-written list, possibly themed/packed like
  B2B; Claude-generated from prior input by wall members).
- **E18-F4 Artifacts and keepsake composition** (parked epic E18) -- open:
  whether the Artifact is in MVP and to what extent; decided: a manual
  arrange-your-own-art option (like B2B) has proven engaging; named
  value-adds: content creation/sharing, replay/retention, future
  monetization, event display (ReInvent named, cross-ref E15).
- **E15** (re:Invent event wall, not filed) -- cross-referenced by the
  Artifact feedback's event-display mention above.

## Items that had no epic when this was written

See `tracking/backlog-epics.md`, section "Eric's 2026-08-25 items, and where
they now sit", for the full list of six (sharing personal, picking multiple
pictures, grouping them, comments, wall-creator toggles, monetization). All
six landed under E12, E13 and E17 in the renumber pass, and none of those
three epics is filed, so there is no SCRIBL issue to update.
