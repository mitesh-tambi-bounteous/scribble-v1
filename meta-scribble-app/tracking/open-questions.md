---
title: Open questions
description: Every open question on the Scribl engagement, dated from when it was first raised, grouped by what it blocks.
updated: 2026-08-31
---

# Open questions

This is the running list of everything the Scribl engagement is waiting on an answer for.
Every entry carries the date it was first raised and the document it came from, so nothing
gets re-litigated and nothing quietly disappears. Answers are recorded here with the date
they arrived, which means the page shows the list being worked down rather than a snapshot.
Every "today" and "now" on this page reads as of the `updated` date in the front matter.

Groups are by urgency, not by source. Group A blocks work that is running right now.
Group B blocks the next items in the sequence. Group C waits on a scheduled client call.
Group D is people and ownership. Group E is later-phase and can wait.

The sequence referenced below is the work breakdown in
[the POC realignment plan](/design/poc-realignment-plan), section 5, and the item numbers in
the blast-radius column are that plan's numbering. Items 1 to 3 are the theme, icon, and
reduced tool set. Items 4 and 5 are onboarding and invites. Items 7 and 8 are voice notes
and artifacts, both gated on a client decision.

Owner conventions. Eric Rice owns backlog and scope decisions in practice, with a two
business day turnaround. Christina Strachoff owns design answers. Some questions are
Bounteous-internal and sit with David Lawton, Pramod Kumar, or Rob Forshier.

## A. Blocking work in flight

| ID | Question | First raised | Source | Owner | Blast radius | Status |
|---|---|---|---|---|---|---|
| Q46 | How many internal and external testers will Scribl need on the beta? TestFlight caps both, and the number also sizes the device request. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:37:26 | Eric Rice | Sets the shape of the beta group and the TestFlight configuration. Also feeds Q50, because the tester count is the only real user number anyone has | Open |
| Q48 | Which testing layers are in scope, manual, automation, or unit, and is 80 percent unit coverage the bar? Three different answers were given in one call and none was agreed. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:26:19, 00:26:50, 00:27:11, 00:27:34 | Pramod Kumar with Karuna Arshakota and David Lawton, internal | Highest on capacity. An 80 percent unit coverage commitment across three two-week sprints is a different engagement from a manual-plus-smoke commitment. This is the largest uncosted item on the page | Open |
| Q1 | Should the drawing canvas be a dark surface or paper-white? The Figma frames draw on `#1E1E1E`. Every mockup in the sales deck shows drawings on white cards on a paper-light background, and the indigo ink is close to invisible on dark. | 2026-08-20 | POC realignment plan, sections 6 and 7, client call 3 | Christina Strachoff | Highest. The background token is being written into the single brand theme on 2026-08-20. Getting this wrong means re-doing every screen that inherits the theme | Open |
| Q3 | Does the splash animate, or ship static? The Figma frame names say animation, and the two exports we hold are near-identical stills. | 2026-08-20 | POC realignment plan, section 1, app icon and splash | Christina Strachoff | Sequence item 2, the icon and splash swap, is a half-day of work in flight. Static ships now either way; an animation is new work | Open |
| Q4 | What is the muted text color? The deck gives us no vector value, so the plan carries a sampled estimate in the gray-violet family. | 2026-08-20 | POC realignment plan, section 1, token before and after table | Christina Strachoff | Sequence item 1. One token, but it appears on every subtitle and meta line in the app | Open |
| Q5 | Will Scribl provision an Apple Developer account, and when? Scribl holds neither an Apple Developer nor a Google Play account today. This phase is iOS only, so Apple is the urgent half. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, Blockers. Also roster open gaps. Restated in `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Blockers, 00:11:56 and 00:12:13, where Pankaj Aggarwal named it as a day-one readiness item because it also means no provisioning profiles and no signing identity | Eric Rice, with Matthew Kaplan if it needs a signature | Highest on the iOS track. No account means no signing identity, no provisioning profiles, no TestFlight, no device distribution, and no App Store submission path. Eric Rice was going to ask the AWS rep what account assets are available | Open |
| Q6 | Who is the full-time iOS developer under Neelesh Aggarwal? The role is still unfilled. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, team structure and Blockers. Restated in the roster open gaps | Pramod Kumar | Highest on staffing. This is what makes iOS feature work serial rather than parallel, and it is the single biggest risk to the engagement's person-weeks | Open |
| Q7 | Does sprint 1 start Wednesday 2026-09-02 or Wednesday 2026-09-09? | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, Open questions, as "sprint start day". Dated and costed in the meeting schedule plan, sprint shape section | David Lawton internally, then Eric Rice to confirm the demo dates | Starting 2026-09-09 pushes the final demo to 2026-10-21, past the week 8 end of 2026-10-16 and up against the re:Invent freeze around 2026-10-23. Starting 2026-09-02 costs the Shape phase three working days. Every recurring client invite is waiting on this | Open |
| Q42 | Which day is the sprint release day? The 2026-08-18 call listed it as its own open item alongside sprint start day, and only sprint start has been worked since. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, Open questions | David Lawton with Pramod Kumar | Rides on Q7. Once the sprint boundary is fixed, release day is a same-conversation answer, and leaving it implicit is how a sprint ends with nothing cut | Open |

## B. Blocking the next items

| ID | Question | First raised | Source | Owner | Blast radius | Status |
|---|---|---|---|---|---|---|
| Q8 | Will Scribl fund the hosted invite landing page and the invite token backend? The designed invite flow opens on a web page before the app is installed. Nothing in the current backlog pays for hosting it, and the POC's share link admits in its own code comment that the endpoint is not real. | 2026-08-20 | POC realignment plan, sections 3 and 7, client call 2. Code reference `app/share.tsx:20` in the scribl-app repo | Eric Rice | Sequence item 5, invites, cannot ship without it, and item 5 already depends on item 4 landing first. This gates the whole invited-user experience | Open |
| Q9 | Does Scribl expect zero-friction invite redemption, where the link survives an App Store install and drops the person straight into the inviter's wall? Full deferred deep linking is heavy. The lighter plan of record asks for an invite code on first launch when the link does not survive. | 2026-08-20 | POC realignment plan, section 3, what the invite flow requires, and section 5 item 5 | Eric Rice | Sets the size of sequence item 5. The light version is in the plan at 3 to 4 days. Deep linking is unpriced and not in any backlog | Open |
| Q10 | Is the "Get Inspired" examples gallery in scope, and what goes in it? The onboarding prompt screen offers it as a branch and no Figma frame exists for where it leads. | 2026-08-20 | POC realignment plan, section 3, screen 5, and section 5 closing paragraph | Christina Strachoff for the design, Eric Rice for the scope call | Sequence item 4. Either it is cut for now or it needs a frame and content before onboarding is built | Open |
| Q11 | Is onboarding and the invited-user flow in the first group of work? It is a live sticky on the kickoff board and named as known new design work, but it is not in the FIRST group, while the designs treat it as the core of the product. | 2026-08-20 | POC realignment plan, section 5, backlog position on items 4 and 5 | Eric Rice | Sequence items 4 and 5, roughly 7 to 9 implementer-days, are unprioritized. If they stay out, the client's own guided first-scribble flow does not ship | Open |
| Q12 | What content goes in the "Your Stats" card on the dashboard? The frame shows the card. Nothing tells us which numbers it holds. | 2026-08-20 | POC realignment plan, section 3, screen 16, and section 5 item 6 | Eric Rice, informed by Matthew Kaplan's metrics list | Sequence item 6. The wall restyle can ship without the stats content; the card cannot | Open |
| Q13 | Where is the analytics and success-metrics list Matthew Kaplan offered on the kickoff call? It was not dated on the call. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, suggested action items | Matthew Kaplan | Feeds Q12 and any instrumentation work. Without it we guess at what to measure | Open |
| Q14 | What is Christina Strachoff's availability through the fall? Eric Rice said on the kickoff call that it is up in the air. A weekly 20 to 30 minute sync with Rob was agreed as required for her. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, Blockers and decisions. Restated in the roster open gaps | Eric Rice or Christina Strachoff | Every design answer on this page routes through her. Low availability turns Q1 through Q4 into week-long waits | Open |
| Q15 | Which screens does Christina fully design, and which does Rob replicate her theme across? The kickoff agreed the split. The specific screens were never named. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, decisions and suggested action items | Eric Rice with Rob Forshier | Determines how much of the sequence is blocked on her and how much Bounteous can run ahead on | Open |
| Q16 | Are the 23 Figma PNG exports the complete set, and can we have direct access to the Figma file rather than image exports? The prototype was walked in a browser, so the flow is confirmed, but exports go stale the moment she edits. | 2026-08-20 | POC realignment plan, source register. Related blocker in `knowledge/meetings/2026-08-19-kickoff.md`, updated Figma assets promised end of day and not landed by the end of that call | Christina Strachoff | Any frame we do not hold is a screen we build twice. Also affects how fast Q1 through Q4 can be answered by looking rather than asking | Open |
| Q17 | Do the AWS environments and accounts come from Scribl, from their AWS representative through the funding relationship, or from Bounteous in the interim? | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, decisions, records Bounteous accounts used initially. Restated as open in `knowledge/meetings/2026-08-19-kickoff.md`, Open questions. Restated again in `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:16:53 and 00:17:20, where David Lawton confirmed Scribl has no infrastructure budget at all | Eric Rice with Angie Yap | Backend work is not in flight yet, so nothing is stalled today. It becomes urgent the moment the invite backend or the voice pipeline is funded. Now paired with Q49, which asks who actually pays the bill | Open |
| Q49 | Who pays for AWS hosting during this phase? Scribl has no infrastructure budget. The AWS funding covers the engagement fee, and AWS wants the workload in their environment. Nobody has said whose account carries the runtime cost. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:16:53 and 00:17:20 | David Lawton with Eric Rice and Angie Yap | Distinct from Q17, which is about account provenance. This one is about money. Any backend work started on a Bounteous account is unbilled cost with no agreed handover point | Open |
| Q50 | What user base, concurrency, and regions should the backend be sized and costed for? Infrastructure cost and architecture both hang off the number, and the only figure anyone has offered is a small beta test group. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:21:24 and 00:30:33 | Eric Rice with Matthew Kaplan | No architecture can be signed off without it, and the AWS cost estimate in Q49 cannot be produced. Separate from Q21, which is the re:Invent event wall at roughly 100,000 concurrent | Open |
| Q51 | How many physical iOS test devices does the team need, and who raises the request? David Lawton asked for the request to be started and does not know the Bounteous process. Pramod Kumar said a couple of devices for developers and testers is normal on other projects. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:39:12 and 00:39:41 | Pramod Kumar, internal | Simulator-only testing hides performance and touch behaviour on real hardware, which is most of what this app is. Procurement lead time is the risk, not the decision. Sized by Q44 and Q46 | Open |
| Q53 | Does the Bounteous Jira instance support test case management, or do test cases live somewhere else? Karuna Arshakota asked whether it is Jira or spreadsheets and the answer was that it needs checking. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:50:44 and 00:51:27 | Karuna Arshakota with Pramod Kumar, internal | QA cannot start writing test cases into a system that has not been chosen. Small, and it is week one work | Open |
| Q56 | Is an App Store submission part of this phase at all? David Lawton said out loud that nobody knows yet. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:34:10 | David Lawton with Eric Rice and Matthew Kaplan | Sets how urgent Q5 is and whether App Store review time has to fit inside the eight weeks. A TestFlight-only phase and a submission phase are different plans | Open |

## C. Gated on a client call

| ID | Question | First raised | Source | Owner | Blast radius | Status |
|---|---|---|---|---|---|---|
| Q18 | Voice recording is in the designs and cut from the board. The Figma flow puts Record on the onboarding story step and on the daily loop. The kickoff board's key decision 1 cut voice memos from the MLP to reclaim one to two weeks and a native module. The 2026-07-14 workshop had already decided voice memo was a fast-follow after MLP. Which one wins? | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, decisions, as the fast-follow call. Contradiction surfaced in the POC realignment plan, section 4 scope flag and section 7, client call 1 | Eric Rice, with Matthew Kaplan since he made the original call | Sequence item 7, 4 to 5 implementer-days plus a native module and an S3 encode pipeline. Nothing should enter a sprint until this is reconciled. Building it silently is the failure mode to avoid | Open |
| Q19 | Are artifacts still parked for Beta? They appear in the prototype's wall flow with selection and a composed keepsake, and key decision 6 on the kickoff board parked them. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions, as Exciting Artifact scope. Restated in the POC realignment plan, section 5 item 8 and section 7, client call 4 | Eric Rice, with Matthew Kaplan | Sequence item 8 is not sized. Q20 closed on 2026-08-20, so ownership is no longer the blocker, scope still is | Open |
| Q21 | What is the scope and funding of the re:Invent event wall, including capacity at roughly 100,000 concurrent users? | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions, per-wall capacity and enterprise scale | Eric Rice and Matthew Kaplan, with Angie Yap, since it runs on the AWS funding | Sits outside the eight-week scope today. It has its own scheduled session on 2026-09-22 | Open, session scheduled 2026-09-22 |

## D. People and ownership

| ID | Question | First raised | Source | Owner | Blast radius | Status |
|---|---|---|---|---|---|---|
| Q22 | Who is Scribl's product owner? The SOW promises one. Nobody has been named. Eric Rice acts as backlog owner in practice and the board card still reads "Eric Rice?" with the question mark on it. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, team structure and Blockers. Restated in the roster open gaps. Restated again in `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Blockers, 00:51:13, where Rob Forshier said he does not know who the product manager will be | Matthew Kaplan or Eric Rice, said out loud in a meeting | Every scope question on this page needs a decision-maker. It works today because Eric Rice answers anyway. It stops working the moment he is unavailable or overruled | Open |
| Q23 | Who are `helen@scribl.co` and `abbie@scribl.co`? Both appear on engagement mail threads with no name or role attached, and neither is on any meeting in the schedule plan. The 2026-07-14 workshop attendee list carries a Helen Leffers and an Abigail Knapton, which is a lead and not a confirmation. Do not add either address to anything until someone says who they are. | 2026-08-20 | Roster open gaps, `knowledge/team/roster.md`. Names on the attendee list in `knowledge/meetings/2026-07-14-workshop.md` | Eric Rice | Low today, real later. Abigail Knapton was the voice on Scribl's reporting requirement at the workshop, so if that is the same person she belongs on analytics conversations | Open |
| Q24 | Does Jeffrey Sparr, Scribl's CRO and co-founder, belong on the sprint demo? He is active on the threads and is deliberately on no meeting in the plan. | 2026-08-20 | Roster open gaps, `knowledge/team/roster.md` | David Lawton with Rob Forshier, then Eric Rice to confirm | Low. One invite either way. Worth asking rather than assuming a co-founder does not want to see the demo | Open |
| Q25 | Who is the PM on this engagement? No PM is assigned. David Lawton raised it on 2026-08-18 and nobody addressed it on the 2026-08-19 kickoff. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, team structure and Blockers. Restated in the roster open gaps | Pramod Kumar with David Lawton | Ceremony ownership, status reporting, and the definition of ready and done all currently have no owner | Open |
| Q26 | Is Pankaj Aggarwal full time on this engagement, or is the split across accounts permanent? He is the engineering lead and architect per the SOW and is currently split. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, team structure and Blockers. Restated in the roster open gaps | Pramod Kumar | Architecture decisions and backend direction depend on his availability. Closing this needs either a staffing decision or explicit acceptance of the split | Open |
| Q27 | What are David Lawton's away dates? We still do not have the window. | 2026-08-20 | Raised by Rob Forshier in the 2026-08-20 review of the meeting schedule plan. Not recorded in any committed source, which is itself part of the problem | David Lawton | He owns six meetings in the plan, R4 the client sprint demo, R8 the leadership sync, O1 the materials handover, and the three one-off client scope sessions O8, O9, and O10. Any of those landing inside his away window needs a delegate named in advance | Open |
| Q55 | Is the daily stand-up 09:00 Central, 19:30 IST? Rob Forshier proposed it on the call. Karuna Arshakota has conflicts on Tuesdays and Wednesdays and Neelesh Aggarwal has conflicts most days at that time. Pramod Kumar asked for alternate slots to choose from. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Blockers, 00:49:03 to 00:50:17 | Rob Forshier with Pramod Kumar, internal | Low blast radius, immediate. The invite goes out on 2026-08-20 and two of the five delivery people cannot attend as proposed | Open |
| Q43 | What are the definition of ready and the definition of done for this team? Neither is defined. A ways-of-working session is on the calendar, which schedules the conversation rather than answering it. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, Open questions, and the follow-up action item on cadence and definitions | Pramod Kumar with Rob Forshier, and whoever fills Q25 | Every story accepted before this exists gets accepted on somebody's judgement. It is cheap to write and expensive to retrofit mid-sprint | Open |

## E. Later phase, not urgent

| ID | Question | First raised | Source | Owner | Blast radius | Status |
|---|---|---|---|---|---|---|
| Q28 | Is the deck mascot, the purple blob creature on the deck's home mockup, brand canon or deck garnish? It appears in no Figma frame and no POC screen. | 2026-08-20 | POC realignment plan, section 6 | Christina Strachoff | None today, the plan parks it. It becomes real work if it is canon and belongs on the home screen | Open |
| Q29 | How many fixed channels ship, three or four, and is coworkers its own channel? Instinct in the room converged near three to four and it was left open. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, decisions, channel model, and Open questions | Eric Rice | Affects the wall list and the share-to checklist in onboarding. A constant, not a structure | Open |
| Q30 | What is the pricing model, what sits in front of and behind the paywall, and is there a free-tier archive cap? Paywall timing is post-launch, and the monetization hooks are meant to be built now regardless. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, decisions and Open questions. Restated in `knowledge/meetings/2026-08-19-kickoff.md`, Open questions, as speed to monetization. Restated again in `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Asked and answered, 00:34:46 to 00:35:19, where David Lawton confirmed Scribl has no monetization philosophy yet and wants help forming one. Rob Forshier's read is that in-app advertising would cut against their mental-health positioning | Matthew Kaplan | Nothing is blocked. The infrastructure hooks go in without the prices | Open |
| Q57 | Who built the existing scribl.co backend, and what AWS infrastructure does Scribl already hold? Neelesh Aggarwal asked and nobody in the room knew. David Lawton named Martin Young as the person who would, and said Scribl probably has some AWS infrastructure already. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:18:15 and 00:18:39 | Martin Young, asked by David Lawton | Low. The mobile build is greenfield either way. It matters for Q17 and Q49, because existing accounts or credits would change the hosting answer, and for any later phase that couples the two products | Open |
| Q31 | How deep does moderation and content-safety tooling go beyond a written point of view for phase one? Explicitly deferred to a future roadmap item. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, Open questions | David Lawton with Eric Rice | Deferred by agreement. The fail-safe policy from the workshop stands in the meantime | Deferred, 2026-08-19 |
| Q32 | Does Apple's parental-approval flow mitigate the under-13 requirement, and how stringent are current rejections? David Lawton took the research. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions and suggested action items | David Lawton | The under-13 family edition is a separate submission after launch. It has its own scheduled session on 2026-10-13 | Open, session scheduled 2026-10-13 |
| Q33 | What are the beta, public-launch, and first-submission dates? All of them are pending Scribl's internal sync. re:Invent remains the north star on both sides. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions and suggested action items. re:Invent alignment restated in `knowledge/meetings/2026-08-19-kickoff.md`, TL;DR | Matthew Kaplan | The eight-week engagement clock is independent of these. They matter for anything past it | Open |
| Q35 | Should the AWS account executive be looped in for a progress check-in, and when? Angie Yap raised it and it was not scheduled. | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, Open questions | Angie Yap | None on delivery. Relevant to the funding relationship and to Q5 and Q17 | Open |
| Q36 | Is the reshaped scope actually one third of the original SOW? David Lawton characterized it that way twice. It has not been verified against the SOW document. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, closing note on the possible SOW discrepancy | David Lawton with Rob Forshier, internal | Internal only. It matters for the additional-budget conversation, not for the build | Open |
| Q37 | What is the final North Star wording? Connection is locked and "simple" is going in. The wording was to be finished with Helen. | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions | Matthew Kaplan. The workshop says the wording gets finished with Helen, who is one of the two unidentified addresses in Q23 | None on delivery. It is a positioning line, and it is also a thread to Q23 | Open |

## Answered and closed

Kept here so the record shows the list being worked down. Do not delete rows from this page.

| ID | Question | First raised | Source | Answer | Answered |
|---|---|---|---|---|---|
| Q38 | Which platform does this phase target? | 2026-08-19 | `knowledge/meetings/2026-08-19-kickoff.md`, TL;DR and decisions | iOS only for this phase. David Lawton proposed it and Eric Rice confirmed on the client's behalf on the kickoff call, "I would assume iOS is probably the best way forward". Recorded as closed for now, not reopened | 2026-08-19 |
| Q39 | Who fills the QA role? It was unfilled at the pre-kickoff and Pramod Kumar expected it closed within a day or two. | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, team structure and Blockers | Karuna Arshakota, confirmed on the roster from engagement mail threads and the walkthrough invite | 2026-08-20 |
| Q40 | What are the Scribl email addresses, and what are Matt's and Christina's surnames? | 2026-08-19 | Roster work and the meeting schedule plan gaps | The Scribl domain is `scribl.co` and addresses are first name only. The Bounteous `first.last` rule does not apply. Matthew Kaplan is the CEO and Christina Strachoff is the designer, both confirmed from real message headers and a calendar acceptance | 2026-08-20 |
| Q41 | Which board tool, which file-sharing channel, and what demo cadence? | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, Open questions, backlog location and cadence | JIRA for the board, Google Drive for files with anything outside the Microsoft ecosystem preferred, and demos on Wednesday mornings US time to preserve the India overlap. All three confirmed by Eric Rice on the kickoff call | 2026-08-19 |
| Q20 | Where is the boundary between Bounteous and Mission Cloud on the AI-enhancement pipeline, and who owns the keepsake work? | 2026-07-14 | `knowledge/meetings/2026-07-14-workshop.md`, Open questions and suggested action items. Restated in the POC realignment plan, section 5 item 8. Answered in `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, decisions, 00:46:47 | There is no boundary, because Mission Cloud is out. David Lawton: "they are not using them in any way, and the expectation is Bounteous is going to do 100% of the work moving forward". Mission Cloud wrote the original six-page proposal and built an earlier POC and takes responsibility for nothing going forward. The AI-enhancement pipeline from their research was rebuilt into the POC by Rob Forshier and then disabled at Scribl's request, 00:47:45. Ownership is settled. The size of the keepsake work is not, and stays open as Q19 | 2026-08-20 |
| Q58 | Does Scribl have an existing test automation framework the team can use? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Asked and answered, 00:28:29 and 00:28:38 | No. David Lawton: "They don't have something. We have to make a recommendation and provide it for them" | 2026-08-20 |
| Q59 | Does QA test on real devices, on simulators, or on a hosted device farm? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Asked and answered, 00:29:45 and 00:30:13 | Bounteous chooses and recommends. David Lawton: "I think we can use whatever we want and provide a recommendation to them", with the caveat that Scribl will not pay subscription fees unless a case is made for a specific tool. How many physical devices and who requests them stays open as Q51 | 2026-08-20 |
| Q60 | Do we reuse the existing scribl.co backend and mirror the web product's features on mobile? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, decisions, 00:19:14 and 00:19:35 | No. Greenfield build. David Lawton: "this is a greenfield build. We should build it from scratch", and on the existing observability build the client said to provide the version Bounteous thinks is best. Scribl does not want the team constrained by what exists | 2026-08-20 |
| Q61 | Does the app support stylus or Apple Pencil input? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, decisions, 00:42:31 and 00:42:42 | Deferred out of this phase. David Lawton: "Long, long-term, yes, but not in this phase". Android is confirmed as wanted and also descoped for timeline reasons | 2026-08-20 |
| Q62 | Is there a client-supplied backlog and product owner to build against, or does Bounteous produce the backlog? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Asked and answered, 00:24:24 and 00:25:36 | Bounteous produces it. The inputs are the original story given to Rob Forshier for the POC, the client feedback on it, and Christina Strachoff's Figma designs. There is no backlog in a tracking system to inherit. Bounteous builds the backlog and validates it with Scribl. Who owns it on the Scribl side is still Q22 | 2026-08-20 |
| Q52 | Can the Bounteous-hosted Jira board be shared with Scribl? Backlog visibility was promised to them on the kickoff, and nobody knows whether the instance permits external access. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:52:03 and 00:52:22; Rob Forshier, 2026-08-21 | Yes, the board is shared with Scribl. Rob Forshier: "the client will have access to our backlog, so we do need to make sure that all the Jira titles and everything in Jira is client visible." Consequence: every Jira title, description, label, and comment is client-visible, so internal framing must be scrubbed from the source before filing | 2026-08-21 |
| Q2 | Is the canvas brush size selector four sizes or one? The Figma frames show a four-dot size row. The 2026-08-18 internal alignment call recorded "a couple of brush sizes, one brush". | 2026-08-20 | POC realignment plan, section 2, discrepancy note. Conflicting source `knowledge/meetings/2026-08-18-alignment.md`, TL;DR. Closed on `knowledge/meetings/2026-08-25-scribl-shape-kickoff.md` | **One brush, one width, no size picker.** Decided by Rob Forshier on 2026-08-26 from Eric Rice's pick at the 2026-08-25 kickoff, the second of the four sizes from the right, restated at 00:26:04. Matthew Kaplan's dissent for a narrower width is recorded and was not withdrawn. The exact numeric width is still unrecorded and carries forward as Q2b in `handbook/engineering/code-questions.md` | 2026-08-26 |
| Q44 | Which iOS versions, which iPhone models, and is iPad in scope? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:21:58 and 00:22:29. iPad half closed on `knowledge/meetings/2026-08-25-scribl-shape-kickoff.md` | **iPhone 11 and newer, phone only. iPad is deferred out of this phase**, wanted later. The deployment target is the higher of the Expo SDK's own minimum and what an iPhone 11 runs, recorded rather than guessed. Device floor decided 2026-08-24; iPad decided by Rob Forshier on 2026-08-26 from Eric Rice, 00:52:26 to 00:52:45, "Yes, just the closest start." This removes the responsive-layout pass across every screen and roughly halves the QA device matrix against the earlier assumption | 2026-08-26 |
| Q45 | How does a build reach Scribl's testers, and is it TestFlight? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:35:53, 00:36:21, 00:36:49 | **TestFlight, 100 testers or fewer**, which keeps it inside internal distribution and avoids beta review. Still rides on the Apple Developer account, Q5, which is open | 2026-08-24 |
| Q47 | Who provisions the build host and the release pipeline, and do builds ship from developer laptops or from CI? | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Open questions, 00:38:05 and 00:38:38. Closed by the platform decision at `handbook/engineering/decision-register.md` 9.6 and 9.3 | **From CI, on GitHub Actions, from the first build.** GitHub Actions ships hosted macOS runners, so the iOS build runs in the hosted pipeline rather than on anyone's laptop, and there is no self-hosted runner to provision. Signing material lives in repository secrets, not on a machine. This closes the laptop-build risk the question was really about | 2026-08-27 |
| Q34 | When does the code migrate from the Bounteous repo to Scribl's own repo? | 2026-08-18 | `knowledge/meetings/2026-08-18-alignment.md`, Open questions. Direction decided in `knowledge/meetings/2026-08-19-kickoff.md`, decisions. Reversed at `knowledge/meetings/2026-08-26-standup.md` and confirmed 2026-08-27 | **No migration. The production build starts in Scribl's own GitHub organisation.** Rob Forshier's reason, given at the 2026-08-26 standup before the client had confirmed access, is that building in Bitbucket first would mean rewriting the whole pipeline to move it later, "apples and oranges", 00:01:30 to 00:02:07. The client has confirmed the GitHub account is usable. `meta-scribl-app` and the POC repo are unaffected and stay where they are. The org and repository name, confirmed 2026-09-02: `ScriblOrg/scribl-mobile-app` | 2026-08-27, name confirmed 2026-09-02 |
| Q54 | Why can Pankaj Aggarwal not access the Bitbucket repo? Repeated invites did not arrive. | 2026-08-20 | `knowledge/meetings/2026-08-20-kickoff-walkthrough.md`, Blockers, 00:57:09 to 00:58:54 | Overtaken by Q34. The production build repository is not in the Bitbucket workspace at all, so the access that matters now is to Scribl's GitHub organisation. That access is being arranged and is tracked as its own blocker on the 2026-08-28 standup, where Eric Rice is chasing it with the former dev team | 2026-08-27 |

## 2026-08-20 kickoff material walkthrough

Ingested on 2026-08-20 from the Teams transcript, digest at
`knowledge/meetings/2026-08-20-kickoff-walkthrough.md`. Fourteen new questions, Q44 to
Q57, and six answers, Q58 to Q62 plus the closure of Q20. Every row cites a timestamp into
`knowledge/meetings/raw/2026-08-20-kickoff-walkthrough.vtt`.

The rows live in the groups matching what they block, per step 8 of the procedure below.
The iOS ones sit at the top of group A because they gate work starting now.

- iOS and shipping, top of group A. Q44 the device and OS target matrix, Q45 the tester
  distribution path, Q46 the tester counts, Q47 the build host and release pipeline, Q48
  the testing commitment, Q54 Pankaj Aggarwal's Bitbucket access.
- Backend, infrastructure, and tooling, group B. Q49 who pays for AWS hosting, Q50 the
  sizing numbers, Q51 physical test devices, Q53 test case management, Q56 whether an App
  Store submission is in this phase at all. Q52, sharing the Jira board with Scribl, was
  raised here and answered yes on 2026-08-21, see Answered and closed.
- People and scheduling, group D. Q55 the stand-up time against two standing conflicts.
- Later, group E. Q57 who built scribl.co's backend and what AWS infrastructure Scribl
  already holds.

Four existing rows gained this meeting as an additional source rather than a duplicate row,
per step 9. Q5 the Apple Developer account, now with the provisioning and signing
consequence attached. Q17 the AWS account provenance, now paired with Q49. Q22 the product
owner. Q30 monetization. Q19 keeps its own scope question and gained no new source.

Q20 is closed. Mission Cloud is out of the engagement entirely and Bounteous does 100
percent of the work, which answers the ownership half of that question. The size of the
keepsake work stays open as Q19.

## How to add questions from a meeting

This page gets appended to after every meeting. The procedure is short on purpose.

1. Ingest the transcript to `knowledge/meetings/` first, so the source exists before the
   question cites it.
2. Take one question per row. Write it so a Scribl-side reader understands it without any
   Bounteous context.
3. Give it the next free ID. IDs never get reused and never get renumbered when a row moves
   between groups.
4. Set "First raised" to the date the question was genuinely first asked, not the date you
   are writing the row. If an earlier meeting already raised it, keep the earlier date and
   add the newer meeting to the source cell.
5. Cite the source by document and section, not by page or by memory.
6. Name an owner. Eric Rice for backlog and scope, Christina Strachoff for design, David
   Lawton or Pramod Kumar for Bounteous-internal, Matthew Kaplan when it needs a founder.
7. Write the blast radius as what is blocked or at risk while the question stays open. Name
   the sequence item, the meeting, or the screen. "Important" is not a blast radius.
8. Put the row in the group matching what it blocks, not the group matching where it came
   from. Move rows between groups as urgency changes.
9. If a question already on the page comes up again, do not add a second row. Add the new
   source to the existing row and leave the original date.
10. If two sources disagree, record both and say they disagree. Never pick one silently.
11. When an answer arrives, move the row to "Answered and closed" with the answer written
    out and the date it arrived. Never delete a row.
12. Only record an answer someone actually gave. A guess written into the answer column is
    the worst failure this page can have.
13. Update the `updated` field in the front matter and re-render the site with
    `npm run docs:sync`.

## Client-facing extract

Everything below is a question Scribl needs to answer. It is copy-and-send as is. The rest
of the page carries Bounteous-internal items that do not belong in a client message.

The list positions renumber when an item is answered and drops out; the Q ids in brackets
never do, and they are what to quote. Two items came off this list on 2026-08-31, the brush
size selector and the iPad scope question, both answered on 2026-08-26 and now in Answered
and closed.

Answers we need first, because the work they block is running right now.

1. Should the drawing canvas be dark like the Figma frames, or paper-white like every
   mockup in your deck? We are building against paper-white in the meantime, held in a
   single theme token so your answer is a one-line change, and the indigo ink is nearly
   invisible on a dark surface. (Q1)
2. Does the splash screen animate, or ship as a still? (Q3)
3. What should the muted text color be? We have an estimate sampled from the deck and no
   exact value. (Q4)
4. Will Scribl set up an Apple Developer account, and when? Without it there is no
   TestFlight build and no path to the App Store. (Q5)
5. Can we confirm sprint 1 starts Wednesday 2026-09-02? Starting a week later pushes the
   final demo to 2026-10-21, past the end of the engagement and into the re:Invent freeze
   window. (Q7)

Answers we need before the next block of work starts.

6. The invite flow needs a small hosted landing page and backend token work, and neither is
   in the current backlog. Do we fund it, or simplify to invite codes typed in on first
   launch? (Q8)
7. Do you expect an invite link to survive an App Store install and drop someone straight
   into the wall that invited them? That is deep linking and it is unpriced today. (Q9)
8. The onboarding prompt screen offers a "Get Inspired" examples path and there is no frame
   for where it goes. Is it in scope, and what is in it? (Q10)
9. Is the guided onboarding and invited-user flow in the first block of work? It is the
    heart of your designs and it is not in the first group on the board. (Q11)
10. What numbers belong in the "Your Stats" card on the dashboard? (Q12)
11. Can we get the analytics and success-metrics list mentioned on the kickoff call? (Q13)
12. What is Christina's availability through the fall, and can we lock the weekly 20 to 30
    minute sync? (Q14)
13. Which screens is Christina fully designing, so we can theme the rest around them? (Q15)
14. Can we get access to the Figma file directly rather than image exports? (Q16)
15. Do the AWS environments come from Scribl, from your AWS representative, or do we keep
    running on Bounteous accounts? (Q17)

Answers we need before these can be planned at all.

16. Your frames show Record on the story step, and the kickoff board cut voice memos from
    the MLP. Which wins? (Q18)
17. Artifacts appear in the wall flow and were parked for Beta. Still parked? (Q19)
18. Answered on 2026-08-20, kept here so the numbering holds. Mission Cloud is out and
    Bounteous does all of the work, so the keepsake work is ours to own. What we still need
    is the artifacts question above, whether they are in scope at all. (Q20 closed, Q19 open)

Two more, whenever you get to them.

19. Who is the product owner on Scribl's side? Eric answers everything today and the board
    card still has a question mark on it. (Q22)
20. Is the mascot from the deck part of the brand, or was it deck art? It appears in no
    frame. (Q28)

Added on 2026-08-20 from the delivery team walkthrough. These are the iOS shipping
questions, and they gate work starting now.

21. How many people do you want on the beta, split into your own team and outside testers?
    TestFlight caps both numbers, and we need the count before we configure anything. (Q46)
22. Do you want an App Store submission at the end of this phase, or is a TestFlight build
    to your test group the goal? Review time has to fit inside the eight weeks if it is a
    submission. (Q56)
23. How many people should the backend be built and costed for, and in which regions? Any
    number gets us started. Without one we cannot size the infrastructure or tell you what
    it will cost to run. (Q50)
24. Who pays for the AWS hosting during this phase? We understand there is no separate
    infrastructure budget, so we would rather agree the answer now than discover it in
    week six. (Q49)
