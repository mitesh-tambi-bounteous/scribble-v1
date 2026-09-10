---
date: 2026-08-25
type: meeting
meeting_kind: kickoff
title: Scribl Shape Kickoff
source: meetings/raw/2026-08-25-scribl-shape-kickoff.vtt
attendees: [Eric Rice, Matthew Kaplan, Rob Forshier II]
duration_min: 60
---

# Scribl Shape Kickoff -- 2026-08-25

Scheduled 12:00 to 13:00 CDT; the recording runs to 01:03:33, so the call ran
about four minutes over.

Invited: Eric Rice and Matthew Kaplan (Scribl), plus Rob Forshier II, Martin
Young, David Lawton, Angie Yap, John Kilgore and Pramod Kumar (Bounteous).
Only Rob Forshier II, Eric Rice and Matthew Kaplan speak substantively in the
transcript. Martin Young has a single one-word line ("Yap," 00:04:56). Rob
asks "Do you want to speak, Dave?" at 00:54:44 and no reply is recorded. The
transcript does not evidence participation by David Lawton, Angie Yap, John
Kilgore, or Pramod Kumar beyond the invite list; treat their attendance as
unconfirmed, not as absence.

Timestamps below are offsets into
`knowledge/meetings/raw/2026-08-25-scribl-shape-kickoff.vtt`.

Agenda, as Rob framed it at 00:02:49: walk the updated POC, then the open
questions on the Lucid board, then the backlog.

## TL;DR

- Staffing hit: the main iOS engineer has a family emergency this week and
  part of next, dropped to 30 percent, with a replacement engineer onboarding
  starting the same day (Rob Forshier II, 00:03:49 to 00:04:24).
- Stack confirmed: React Native with Expo, the same framework as the POC, so
  Android is technically reachable without a rewrite even though the phase
  stays iOS-focused (Rob Forshier II, 00:48:38).
- iOS-only for the beta was reopened and re-decided in the room. Matthew
  Kaplan pushed back that an iOS-only beta excludes mixed-platform families;
  Eric asked Rob to recommend; Rob proposed iOS focus plus best-effort free
  Android builds; Eric agreed. See Board questions answered below.
- Christina covers three screens only: the intro screen, the home screen, and
  the single-story shareable (Eric Rice, 00:07:13, 00:28:51, 00:36:17). Eric
  or Alex cover the rest.
- Canvas simplifies to one brush and drops the brush-size picker (Eric Rice,
  00:25:09). Eric asked for a trash button behind a confirmation dialog and
  for white as a provisional ninth swatch. He also asked for an eraser, and
  Matthew Kaplan pushed back on both erase and trash as scope creep without
  user data behind them (00:22:43 to 00:23:28). Eric took erase away to a
  Scribl-internal conversation and it is not a decision (00:23:38). The exact
  brush width is unresolved: Eric picked the second from the right off the
  screen share, Matthew, holding a phone, said the third, and neither yielded
  (00:25:15 to 00:26:07).
- Missed-day wall unlock stays open. Rob's POC lets a user explain a missed
  day to unlock the wall retroactively; Matthew is uneasy with rewarding a
  broken streak and wants an internal conversation with Eric before deciding
  the rule set (00:29:38 to 00:32:59).
- The artifact long-press compose feature (drag/resize/rotate individual
  drawings into a scene, Instagram-Stories style) is a real ask, not a
  hypothetical; Rob is going to try building it in the POC (00:40:41,
  00:44:08, 00:45:08).

## Decisions

- Stack is React Native with Expo, matching the POC (Rob Forshier II,
  00:48:38).
- iOS is the focus, with best-effort free Android copies shipped alongside
  rather than a full iOS-only beta. Decided with dissent recorded below
  (00:50:48 to 00:52:20).
- Phone first, iPad deferred: "Yes, just the closest start." -- Eric Rice,
  00:52:45.
- Canvas: one brush, no size picker, undo at a single step back, a trash
  button behind a confirmation dialog, and white as a provisional ninth
  swatch (Eric Rice, 00:21:33 to 00:27:35). An eraser is **not** decided;
  Eric took it to an internal Scribl conversation over Matthew Kaplan's
  objection (00:23:38). The brush width itself is **not** decided, because
  Eric and Matthew named different widths and neither conceded.
- A defined bounding box on the canvas, matching the B2B game's background
  treatment; same circular bounding box for the avatar-creation canvas (Eric
  Rice, 00:23:45 to 00:24:36).
- Logout moves out of the top-level avatar area into profile/personal options
  (Eric Rice, 00:28:13 to 00:28:51).
- Challenges stay in scope for MVP, but scoped down to custom or game-pack
  prompt injection only; the fuller "chance card" mechanic (restrict color,
  restrict hand, etc.) is deferred (Eric Rice, 00:32:59 to 00:34:45).
- Editing an already-submitted drawing: no, for now (Rob Forshier II,
  00:57:18). See Board questions answered for the full exchange.
- Environments this phase: dev only. QA and prod come later, closer to
  re:Invent (Rob Forshier II, 00:54:17 to 00:54:26).
- Code stays in Bounteous's Bitbucket for now, with a planned handoff once
  Scribl is ready to take ownership; Matthew Kaplan: "it probably makes sense
  for you guys to own everything now and then it's a handoff at some point"
  (00:59:44). **Superseded 2026-08-26**: Rob reversed this the next morning.
  The build goes into the client's GitHub, not Bitbucket, because the shared
  B2B repo has a GitHub folder in it and a later Bitbucket-to-GitHub pipeline
  migration would mean rewriting the pipeline from scratch. See the Board
  questions answered table, row 10, for the full correction and the access
  caveat.
- No web app, and B2B/D2C stay separate. Matthew Kaplan: "I think they should
  stay separate, Eric." Eric Rice: "Yeah, I agree... if it's going to take
  time away from the POC, then definitely it can wait" (01:01:43 to
  01:01:56).

## Staffing note

The main iOS engineer's family emergency drops him to 30 percent for this
week and part of next; a replacement engineer starts onboarding the same day
(Rob Forshier II, 00:03:49 to 00:04:24). Recorded as a staffing effect only;
the personal circumstance is out of scope for this digest.

## Design note

Christina is assigned three screens: the intro screen, the home screen, and
the shareable for a single story (Eric Rice, 00:07:13, confirmed again at
00:28:51 and 00:36:17). Eric or Alex cover the remaining screens. Nothing
beyond that is recorded about her availability or workload in this
transcript.

## Board questions answered

Rob walked the Lucid board's open-question set from 00:45:18 to 01:03:16. The
board carries ten questions; the AWS one splits into provisioning and best
practice, so it is two rows here and the table reads to eleven.

| # | Question | Answer | Who | Cue |
| --- | --- | --- | --- | --- |
| 1 | Do you have an AWS environment we can deploy to? | Yes, an existing AWS account hosting the B2B game. | Eric Rice | 00:45:38 to 00:46:01 |
| 2 | New instance or the existing one, and what is best practice? | Undecided in the room; Rob will ask Bounteous's AWS side and follow up with James (Scribl's AWS contact) and Bhasin (the technical contact James would loop in). | Eric Rice, Matthew Kaplan, Rob Forshier II | 00:46:01 to 00:47:44 |
| 3 | Do you have Apple accounts? | No. "We don't have anything." | Eric Rice | 00:48:15 to 00:48:18 |
| 4 | iOS only, or iOS plus Android? | Decided: iOS is the focus; Android ships as a lower-effort free build alongside it. Recorded with dissent -- see below. | Eric Rice, Matthew Kaplan, Rob Forshier II | 00:48:57 to 00:52:21 |
| 5 | iPad in scope, or phone first? | Phone first. "Yes, just the closest start." | Eric Rice | 00:52:26 to 00:52:45 |
| 6 | What test management software do you use? | Unknown. "To be honest, we don't know the answer to that question." Matthew Kaplan suggested routing the question to Nick. | Eric Rice, Matthew Kaplan | 00:52:59 to 00:53:24 |
| 7 | Do we need dev, QA, and prod environments this phase? | No -- dev only for this phase, with QA and prod added later as the team nears the re:Invent date. | Rob Forshier II | 00:53:48 to 00:54:26 |
| 8 | Do we ever let a user edit an already-submitted drawing? | No for now. Discussion covered why: strokes/keystrokes, not just the final image, are worth storing for reproducibility and future animation. Eric leans no on edit-after-submit but flagged that the original build vendor (Eric, 00:55:50: "I can even ask White Specter, or actually Slalom, who originally did it this way") may have reasoning on file for why keystrokes were captured. | Rob Forshier II (the "no for now" call), Eric Rice (background) | 00:55:24 to 00:57:18 |
| 9 | Crash analytics -- Sentry or Firebase, and does the client have anything already? | No, client has nothing; "a lot of this is uncharted territory for us." Which tool (Sentry vs. Firebase) is left to Bounteous. | Eric Rice, Matthew Kaplan | 00:57:29 to 00:57:56 |
| 10 | Where does the code live -- Bounteous Bitbucket now with a handoff later, or client-owned from day one? | **Superseded 2026-08-26.** On this call the room decided Bounteous Bitbucket now, handoff later. Matthew Kaplan: "it probably makes sense for you guys to own everything now and then it's a handoff at some point." That decision reversed the next morning at standup: the build goes into the client's GitHub instead. Rob, 2026-08-26 standup, 00:01:30 to 00:02:07: "when you shared the B2B repo, that had a GitHub folder in it... If we build it in Bitbucket, Bitbucket's pipeline versus GitHub pipeline, apples and oranges... we'd have to do like a migration to basically rewrite the entire pipeline." **Not yet a capability**: the client's GitHub org is administered by the former dev team, outside Scribl's current staff. Eric Rice committed to messaging them (2026-08-26 standup, 00:03:25 to 00:03:35, "I'll send a message right after this over to the former dev team and get the GitHub access"); access is unconfirmed pending that reply. Our code still starts in Bounteous's Bitbucket -- nothing about this reversal blocks work this week. Original 2026-08-25 answer preserved above for the record. | Eric Rice, Matthew Kaplan, Rob Forshier II | 00:58:10 to 01:00:48 |
| 11 | Do we want to support a web app, and do B2B and D2C merge? | No web app for now, and B2B/D2C stay separate. Matthew Kaplan: "I think they should stay separate, Eric." Eric Rice: "Yeah, I agree." | Matthew Kaplan, Eric Rice | 01:00:52 to 01:01:56 |

**iOS-vs-Android dissent, in full.** Matthew Kaplan argued at 00:50:48 to
00:51:19 that an iOS-only beta distorts the beta group because families are
mixed-platform: "the only challenge with going with iOS only is that that's
going to really influence our beta group of users... if you have families
that are cross-functional on their phones, they're not going to be a fit for
our beta, which is a huge problem." Eric Rice asked Rob directly to
recommend at 00:51:32 ("What would you recommend, Rob?"). Rob proposed iOS
focus with best-effort free Android copies at 00:51:55 to 00:52:15 ("some
features may be ignored... but it'll be available because it'll just be for
free"). Eric closed it at 00:52:20: "Let's do that." The dissent is on the
record; it was not withdrawn, only outvoted by the proposed compromise.

## Change requests

Every change Eric asked for while walking the POC (canvas brush/erase/trash,
logout placement, wall-reveal timing, challenges scope, the artifact
long-press compose feature, and the rest) is enumerated separately in
`tracking/eric-poc-change-requests-2026-08-25.md`. This digest does not
repeat that list; read it there.

## Suggested action items

| Item | Suggested owner | Due | Source cue |
| --- | --- | --- | --- |
| Send the B2B game source code | Eric Rice | Same day (his commitment) | "I'll send it over momentarily" (00:27:55), reconfirmed 00:53:24 |
| Schedule the design working session with Christina | Rob Forshier II | 2026-08-26 | "I was thinking of maybe scheduling that meeting tomorrow for like an hour" (00:06:28 to 00:07:38) |
| Schedule the sprint demos on Fridays | Rob Forshier II | TBD (not dated) | "I'm going to schedule like our sprint demos... and put them Friday" (00:06:07) |
| Confirm Rob's edit access to the Figma board | Eric Rice | TBD (not dated) | "you should have edit access to that, but I'll double check" (00:07:04) |
| Reach out to James and Bhasin about the AWS environment (new instance vs. existing, best practice) | Rob Forshier II / Bounteous | TBD (not dated) | "I will reach out and let them... because they're more of the experts than I am at this" (00:46:48 to 00:47:39) |
| Re-ask James about the AWS account and about Apple accounts | Eric Rice | TBD (not dated) | "I did ask him in that e-mail... so I'll hit him up again" (01:03:00) |
| Start signing up for the Apple Developer account, with Rob pointing the way | Eric Rice | TBD (not dated) | "I'm happy to go through and do the work on it. I'm just pointing me in the right direction" (01:02:47) |
| Find out how long Apple account provisioning takes | Rob Forshier II | TBD (not dated) -- Rob said he does not know | "I'm going to have to get back to you on that because I've never built a mobile app" (01:02:36 to 01:02:41) |
| Make the POC record individual strokes, not only the final image | Rob Forshier II | TBD (not dated) | "I wasn't actually recording all the keystrokes... I'll have to go take a look at how we're doing that" (00:54:59) |
| Try the artifact long-press compose feature in the POC | Rob Forshier II | TBD (not dated) | "I'll play with that today. That sounds like honestly a good challenge" (00:40:41), reconfirmed 00:44:08 and 00:45:08 |
| Decide internally on the eraser and on white as a ninth swatch | Scribl | TBD (not dated) | "we can talk, what we talk about internally, now's not really the time" (00:23:38), "Let us talk about it a little bit more. There seems to be some differences of opinion" (00:27:17) |
| Decide the missed-day reveal rule set | Scribl | TBD (not dated) | "maybe we could have a little just kind of internal condo on that, Eric" (00:32:35 to 00:32:59) |

## Notable quotes

- "The only challenge with going with iOS only is that that's going to really
  influence our beta group of users." -- Matthew Kaplan, 00:50:48
- "What would you recommend, Rob?" -- Eric Rice, 00:51:32
- "Let's do that." -- Eric Rice, 00:52:20
- "To be honest, we don't know the answer to that question." -- Eric Rice,
  00:53:16
- "It probably makes sense for you guys to own everything now and then it's a
  handoff at some point." -- Matthew Kaplan, 00:59:44
- "I think they should stay separate, Eric." -- Matthew Kaplan, 01:01:43

## Where this leaves risk

The missed-day reveal rule and the eraser-and-white call both got punted
to an internal Scribl conversation with no date attached -- if either slips
past the next sprint boundary, the canvas and wall-unlock work will be built
against Rob's best guess instead of a client decision, and that is exactly
the kind of thing that gets re-litigated after the sprint demo.
