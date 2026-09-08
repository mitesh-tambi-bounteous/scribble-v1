---
date: 2026-08-20
type: meeting
meeting_kind: internal-walkthrough
title: Kickoff material walkthrough/discussion
source: meetings/raw/2026-08-20-kickoff-walkthrough.vtt
attendees: [David Lawton, Karuna Arshakota, Neelesh Aggarwal, Pankaj Aggarwal, Pramod Kumar, Rob Forshier II]
duration_min: 60
---

# Kickoff material walkthrough/discussion -- 2026-08-20

Internal Bounteous only. No Scribl attendees. Pramod Kumar organized it as a
30 minute walkthrough of the 2026-08-19 client kickoff for the India delivery
team; the transcript runs 00:59:23, so it ran roughly an hour. John Kilgore was
on the invite and does not speak anywhere in the transcript, so he is not
counted as an attendee. David Lawton drops at 00:55:19 and the last four
minutes are Jira and Bitbucket access troubleshooting.

Timestamps below are offsets into
`knowledge/meetings/raw/2026-08-20-kickoff-walkthrough.vtt`.

This is the session that generated the engagement's iOS delivery questions.
The India team had not been on the client calls, so Neelesh Aggarwal, Pankaj
Aggarwal, and Karuna Arshakota asked the practical build-and-ship questions
nobody had asked yet. Most of them are open, and most of them are ours to
answer or to recommend on before Scribl can answer anything.

## TL;DR

- Nobody has decided which iOS versions, which iPhone models, or whether iPad
  is in scope. Scribl does not know either and expects Bounteous to recommend
  (Neelesh Aggarwal 00:21:58, David Lawton 00:22:29).
- Distribution has no plan. TestFlight is the leaning, it needs an Apple
  Developer account Scribl does not have, and the internal and external
  tester counts are unknown (Pankaj Aggarwal 00:35:53, David Lawton 00:36:21,
  Rob Forshier II 00:36:49, Neelesh Aggarwal 00:37:05 and 00:37:26).
- Build infrastructure is unowned. Pankaj Aggarwal asked for build machines and
  a CI/CD pipeline; the only firm answer was that the team gets Mac laptops
  (00:38:05, Rob Forshier II 00:38:25 and 00:38:44).
- Test scope is unsettled and expensive. Rob Forshier II asked for a full test
  suite plus end-to-end automation, Neelesh Aggarwal put an 80 percent unit
  coverage expectation on the table, David Lawton pushed back on spending the
  eight weeks on foundation (00:26:12 to 00:28:29).
- Mission Cloud is out entirely. Bounteous does 100 percent of the work going
  forward (David Lawton 00:46:47).
- Scribl has no infrastructure budget. The AWS funding is the funding, and
  Bounteous has to help them navigate hosting cost (Pramod Kumar 00:16:53,
  David Lawton 00:17:20).
- The Jira board exists. Rob Forshier II found an empty board named Scribl on
  the Bounteous instance and it is now the project board, with Pramod Kumar
  made admin (00:53:19 to 00:58:33). Whether the client can be given access to
  it is unresolved (David Lawton 00:52:03).
- An App Store release at the end of this phase is not a commitment. David
  Lawton: "We don't even know right now if we're pushing an App Store release
  at the end of this phase" (00:34:10).

## Decisions

- Bounteous does 100 percent of the remaining work. Mission Cloud produced the
  original six-page proposal and an earlier POC, is not in play, and takes
  responsibility for nothing going forward (David Lawton 00:46:22 to 00:47:41).
- The backend is a greenfield build. Scribl's existing scribl.co product is not
  a source of features or code to reuse. When asked about the existing
  observability build, the client said to provide the version Bounteous thinks
  is best (David Lawton 00:19:35).
- Every handoff is treated as a deployable product, not a throwaway POC. Three
  demos in the eight weeks, maybe four, with the first two weeks as discovery
  and no deliverable required at the end of it (David Lawton 00:30:50).
- Test automation is for Bounteous and for the client's long-term maintenance,
  not something Scribl asked for. Scribl means user testing when they say
  testing (David Lawton 00:28:44).
- Stylus and Apple Pencil support is deferred out of this phase. Android is
  also confirmed as wanted and descoped for timeline reasons (David Lawton
  00:42:42).
- The Bounteous Jira board named Scribl is the project board. Rob Forshier II
  owns it, Pramod Kumar was made admin during the call (00:53:41 to 00:56:11).
- Developers use Bounteous enterprise Claude subscriptions for build work, and
  should request the developer tier for the larger token budget. Bedrock is the
  application runtime question, not the developer tooling question (Rob
  Forshier II 00:06:35, David Lawton 00:07:08).
- Physical iOS test devices will be requested for the developers and testers.
  Pramod Kumar confirmed Bounteous does this on other projects (David Lawton
  00:39:12, Pramod Kumar 00:39:41).
- The POC gets rebuilt from scratch as proper React Native, iOS first, Android
  fast follow. The existing POC was vibe-coded and is a communication artifact,
  not a codebase (Rob Forshier II 00:11:27).
- Current AI usage in the app is speech to text and nothing else. The AI
  background-generation pipeline inherited from Mission Cloud's research was
  built, tried, and disabled at Scribl's request; prompts are seeded into the
  database rather than generated at runtime (Rob Forshier II 00:47:45,
  00:48:09).

## Blockers

- Scribl holds no Apple Developer account and no Google Play account, so there
  are no provisioning profiles and no signing identity on day one. Pankaj
  Aggarwal raised it as a day-one readiness item, Rob Forshier II confirmed the
  gap from the kickoff board (00:11:56, 00:12:13). This is the same blocker
  recorded on 2026-08-19; the walkthrough adds the provisioning and signing
  consequence.
- Pankaj Aggarwal could not get into the Bitbucket repo. Repeated invites did
  not arrive. Rob Forshier II's read is that he may need to be added to the
  HS2 Studio Bitbucket workspace first (00:57:09 to 00:58:54).
- No build or release pipeline exists, and no build host is provisioned. The
  question of whether builds get published from developer laptops or from CI
  was raised and left unanswered (Pankaj Aggarwal 00:38:05 and 00:38:38).
- No PM, and the definition of who owns the backlog on the Bounteous side is
  still loose. Rob Forshier II on the Jira setup: "I don't know who's going to
  be the product manager" (00:51:13). This matches the roster open gaps.
- The proposed 09:00 Central stand-up, 19:30 IST, conflicts with existing
  commitments for Karuna Arshakota on Tuesdays and Wednesdays and for Neelesh
  Aggarwal most days (00:50:01, 00:50:06).

## Open questions

Recorded as rows Q44 through Q57 on [the open questions page](/open-questions).
Listed here in the order they were raised, with the transcript cue.

- Which iOS versions, which iPhone models, and is iPad in scope (Neelesh
  Aggarwal 00:21:58). Scribl does not know and wants a recommendation (David
  Lawton 00:22:29).
- How does a build reach Scribl's testers, and is it TestFlight (Pankaj
  Aggarwal 00:35:53, David Lawton 00:36:21).
- How many internal and external testers, given TestFlight's caps (Neelesh
  Aggarwal 00:37:26).
- Who provisions the build host and the release pipeline, and do builds ship
  from laptops or CI (Pankaj Aggarwal 00:38:05 and 00:38:38).
- How many physical test devices, and who raises the request (David Lawton
  00:39:12, Pramod Kumar 00:39:41).
- Which testing layers are in scope, manual, automation, unit, and is 80
  percent unit coverage the bar (Neelesh Aggarwal 00:26:19 and 00:27:11, Rob
  Forshier II 00:26:50, David Lawton 00:27:34).
- Does the Bounteous Jira instance support test case management, or do test
  cases live elsewhere (Karuna Arshakota 00:50:44, Pramod Kumar 00:51:27).
- Can the Bounteous-hosted Jira board be shared with Scribl, given that
  backlog visibility was promised to them (David Lawton 00:52:03, Pramod Kumar
  00:52:22).
- Who pays for AWS hosting during this phase, given that Scribl has no
  infrastructure budget (Pramod Kumar 00:16:53, David Lawton 00:17:20).
- What user base, concurrency, and regions should the infrastructure be sized
  and costed for (Neelesh Aggarwal 00:21:24 and 00:30:33).
- Who built scribl.co's existing backend, and what AWS infrastructure does
  Scribl already hold (Neelesh Aggarwal 00:18:15, David Lawton 00:18:39, who
  named Martin Young as the person who would know).
- Is an App Store submission part of this phase at all (David Lawton
  00:34:10).
- Is 09:00 Central the stand-up, given the two conflicts (Karuna Arshakota
  00:50:01, Neelesh Aggarwal 00:50:06).

## Asked and answered

Recorded so nobody takes these to Scribl a second time.

- Does Scribl have an existing test automation framework we can use. No. A
  recommendation has to come from Bounteous (Karuna Arshakota 00:28:29, David
  Lawton 00:28:38). Karuna Arshakota set out her own starting order at 00:43:40,
  documented and reviewed requirements in Jira first, then test cases generated
  from those requirements plus the screenshots, because a mockup does not show
  what the screen was meant to achieve.
- Real devices or simulators and hosted device farms. Bounteous chooses and
  recommends. The caveat is that Scribl is unlikely to pay subscription fees
  without a case being made for a specific one (Karuna Arshakota 00:29:45,
  David Lawton 00:30:13).
- Are we reusing the scribl.co backend. No, greenfield (Neelesh Aggarwal
  00:19:14, David Lawton 00:19:35).
- Is Mission Cloud still in play, and was there parallel work. No on all of
  it. Bounteous does 100 percent (Pramod Kumar 00:45:55, David Lawton
  00:46:47).
- Is there a client-supplied backlog and product owner to work against. No.
  The inputs are the POC story, the client feedback, and the Figma designs,
  and Bounteous builds the backlog and validates it with Scribl (Pramod Kumar
  00:24:24, Rob Forshier II 00:25:21, 00:25:36).
- Which monetization model. Scribl has no answer and no philosophy yet, and
  monetization is not an expectation of this phase (Neelesh Aggarwal 00:34:46,
  David Lawton 00:35:10, Rob Forshier II 00:35:19).
- Do we support stylus input. Long term yes, deferred out of this phase (Pankaj
  Aggarwal 00:42:31, David Lawton 00:42:42).
- What does Bounteous get out of an eight-week build for a startup. Continued
  phases, an agreed press release with the client and internal leadership
  sign-off, and the AI-forward delivery methodology fed back into the company
  and into ARC (Neelesh Aggarwal 00:32:05, David Lawton 00:32:50).
- Is Claude access via Bedrock or via subscriptions. Bedrock is the
  application question. Developers sign in to Bounteous enterprise Claude, and
  should request the developer tier (Pramod Kumar 00:06:11, Rob Forshier II
  00:06:35, David Lawton 00:07:08).
- Can the team try the product. The POC is hosted on Vercel with the link and
  password in the meeting chat, an Android APK is available on request, and
  scribl.co offers a free 30 day trial that needs several invited users before
  it unlocks (Karuna Arshakota 00:39:55, Rob Forshier II 00:40:12, David
  Lawton 00:41:06 and 00:41:59).

## Suggested action items

| Item | Suggested owner | Due | Source cue |
| --- | --- | --- | --- |
| Recommend target iOS versions, device models, and an iPad in-or-out call, then confirm with Scribl | Neelesh Aggarwal with Pankaj Aggarwal | TBD (not dated on the call) | "we should tell them, here's what I believe OS versions you should target for iPhone" |
| Recommend the tester distribution method, TestFlight or otherwise, as a written process | David Lawton with Rob Forshier II | TBD (not dated) | "whether that's test flight or some other method, we need to come up with something" |
| Scope the testing commitment to what fits eight weeks and get it agreed before it is promised | Karuna Arshakota with Neelesh Aggarwal | TBD (not dated) | "understand the timelines and be very realistic on what you can deliver in this duration" |
| Raise the request for physical iOS test devices for developers and testers | Pramod Kumar | TBD (not dated) | "a couple of devices with the testers, the developers, we should be able to get those" |
| Book the follow-up infrastructure and architecture conversation with Scribl | David Lawton | TBD (not dated) | "we should have a meeting discussion and ask about the infrastructure pieces" |
| Ask Martin Young who built scribl.co's backend and what AWS infrastructure Scribl already holds | David Lawton | TBD (not dated) | "we can ask Marty those questions. He will actually know that" |
| Review the Lucid board and the kickoff material, then bring back the remaining mobile questions | Neelesh Aggarwal | 2026-08-21 (morning, his commitment) | "by tomorrow morning, I'll try to spend some time to understand what is there" |
| Send the meeting and stand-up invites, with alternate stand-up slots for the two conflicts | Rob Forshier II | 2026-08-20 (his commitment on the call) | "I'll get all that shipped out today" |
| Check whether the Bounteous Jira board can be shared with Scribl for backlog visibility | Pramod Kumar | TBD (not dated) | "we did promise them visibility into the backlog" |
| Get Pankaj Aggarwal into the HS2 Studio Bitbucket workspace and confirm repo access | Rob Forshier II with Pramod Kumar | TBD (not dated) | "they might just need to make sure that they're a part of HS Studio" |
| Request Lucid access for anyone on the delivery team who does not have it | Team | TBD (not dated) | "make sure if you don't have lucid access to request lucid access" |

## Notable quotes

- "They don't seem to know the answers to those and they're looking for our
  guidance... They've never done mobile development before." -- David Lawton,
  00:22:29
- "We don't even know right now if we're pushing an App Store release at the
  end of this phase." -- David Lawton, 00:34:07
- "Apple account is anyway needed for even for beds and all." -- Pankaj
  Aggarwal, 00:37:21
- "I'm expecting we'll be looking for at least an 80% coverage here from the
  unit test cases." -- Neelesh Aggarwal, 00:27:11
- "We just need to be careful not to spend too many cycles on building the
  foundation and architecture and test case base." -- David Lawton, 00:27:53
- "So it's a POC to us, but they don't think of it that way. They think of it
  as a paired down MVP that continues to build." -- David Lawton, 00:30:50
- "The expectation is Bounteous is going to do 100% of the work moving
  forward." -- David Lawton, 00:46:47
- "They don't have a budget for AWS hosting or anything like that. Like we
  have to help them navigate." -- David Lawton, 00:17:44
