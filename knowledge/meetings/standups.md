---
type: meeting
meeting_kind: standup-log
title: Standups
---

# Standups

This page is a running record of the daily Scribl standup, newest first, with
one section per day. Per-day digests for larger meetings live beside it in
`knowledge/meetings/`.

## How to add tomorrow's entry

1. Run `/ingest-standup <path-to-transcript> --kind=standup --title="Scrib SU"`
   from the repo root. It writes the day's digest and prepends a section to
   this page.
2. If there is no transcript, add the day's section here by hand, copying the
   shape of the newest one, and set its ledger row to `awaiting transcript`.
3. Run `npm run docs:sync` so the rendered site matches.

The prepend only happens automatically when a transcript exists. A missing
transcript is a manual edit.

## Transcript ledger

| Date | Standup held | Transcript ingested | Digest |
| --- | --- | --- | --- |
| 2026-09-04 | yes | yes | [2026-09-04 digest](2026-09-04-standup.md) |
| 2026-09-03 | yes | yes | [2026-09-03 digest](2026-09-03-standup.md) |
| 2026-09-02 | yes | yes | [2026-09-02 digest](2026-09-02-standup.md) |
| 2026-09-01 | yes | yes | [2026-09-01 digest](2026-09-01-standup.md) |
| 2026-08-28 | yes | yes | [2026-08-28 digest](2026-08-28-standup.md) |
| 2026-08-27 | yes | yes | [2026-08-27 digest](2026-08-27-standup.md) |
| 2026-08-26 | yes | yes | [2026-08-26 digest](2026-08-26-standup.md) |
| 2026-08-25 | yes | yes | [2026-08-25 digest](2026-08-25-standup.md) |
| 2026-08-24 | yes | yes | [2026-08-24 digest](2026-08-24-standup.md) |

The ledger starts on 2026-08-24. Standup dates before that are not tracked here.

## 2026-09-04 (Friday)

Digest: [Scrib SU -- 2026-09-04](2026-09-04-standup.md).

### Highlights

- About 17 minutes, five speakers. Reduced group: a second India holiday and the runup to
  US Labor Day mean today and Monday both run late, with the full team back together Tuesday.
- Karuna finished analysis on SCRIBL-28 and posted questions, moved to SCRIBL-31 with more
  questions due the same day, and is deriving test cases for both stories.
- Rob disclosed that his own Jira gating had accidentally blocked the whole team from backlog
  changes; the fix is merged. Karuna caught it and is raising a permissions request, hoping
  for resolution by Monday.
- Shubhankar's tooling is fully working on both Android and iOS emulators, posted a device
  procurement proposal (start with one basic device), opened a PR proposing architecture on
  SCRIBL-8, and plans to move to SCRIBL-18 then SCRIBL-76 next.
- Shubhankar raised the one-app-vs-two question for Apple: a single "Scribl" app carefully
  separated between test and production pushes, or two separate apps. Rob suggested a
  "scribl-dev" vs "scribl" naming split. Decision deferred to next week once Pankaj is back.
- Eric gave Pramod IAM access into Scribl's AWS dev account, but the Bounteous-to-account
  connection is still open; the two will work it Sunday evening and Monday.
- Karuna asked whether Scribl has BrowserStack credentials for cross-device automated testing;
  Eric did not know. Karuna will write a proposal to run past Scribl for possible licenses.

### Action items

- **Eric Rice** -- attach Rob's Bounteous email to Scribl's Figma. Help write the BrowserStack
  tool proposal.
- **Karuna Arshakota** -- tell the rest of the team to connect Atlassian in their Claude
  desktop app. Post questions on SCRIBL-31 (2026-09-04). Write a proposal for a cross-device
  test tool to run past Scribl.
- **Rob Forshier II** -- add the Atlassian-connection note to the team access list. Review
  Shubhankar's architecture PR on SCRIBL-8.
- **Shubhankar Bhavsar** -- write up the dev-vs-production app split proposal with benefits
  and turnaround-time tradeoffs, bring it to the team the week of 2026-09-07. Continue
  SCRIBL-8, then SCRIBL-18, then SCRIBL-76.
- **Eric Rice and Pramod Kumar** -- connect Bounteous's team to Scribl's AWS dev account,
  picking it up 2026-09-07/08.

### Needs Rob or a decision

- One Apple app or two, for dev/test versus production. Shubhankar is writing up the tradeoffs;
  the team decides next week once Pankaj is back.
- Whether Scribl has BrowserStack credentials the team can use. Eric did not know; Karuna is
  writing a proposal.

## 2026-09-03 (Thursday)

Digest: [Scrib SU -- 2026-09-03](2026-09-03-standup.md).

The Sprint 1 grooming and planning session ran in the hour before this standup.
It is digested separately at [Sprint 1 grooming and planning -- 2026-09-03](2026-09-03-sprint1-grooming.md).

### Highlights

- About 18 minutes, eight speakers. First standup run off the Jira board, a change Rajeev
  announced at the top and drove from a shared screen.
- Pankaj finished the GitHub repo setup: PR checks, branch security, and a Git flow branch
  strategy. Eric's GitHub team upgrade unblocked it. He also got Apple developer account
  access and built the app end to end on his own machine with a provisioning profile.
- Nitish merged the API contract and schema PR into the meta repo after Pankaj's review,
  closed the Aurora-gate ticket, and started the data model on SCRIBL-20 and SCRIBL-12.
  He is out 2026-09-04 for a holiday.
- Rob finished pushing the remaining epics and user stories into the backlog, and Pankaj
  reviewed and merged his harness PR (SCRIBL-4) that morning.
- Pramod's read on the stalled AWS access: Eric created the IAM roles from the original
  management account view without switching into the new account. He also asked Eric whether
  Scribl has a BrowserStack account, and flagged a future Linux EC2 instance for the QA test
  repository.
- Shubhankar is cross-checking the meta repo against work done so far and will raise subtasks
  for the gaps. Karuna went through workflows 1 and 2 and SCRIBL-28 and is generating test
  cases alongside the automation execution plan.
- Schedule: discovery concludes 2026-09-04, the next sprint runs 2026-09-07 to 18 September
  and shows on the board as sprint 2. Half the team is out 2026-09-04, and Monday 2026-09-07
  is US Labor Day, so the India team connects internally Monday and everyone reconvenes
  Tuesday.

### Action items

- **Rob Forshier II** -- double check whether an app icon already exists and add it to the
  design list if not. Invite Eric to the Jira board around the middle of the week of
  2026-09-07, once the team has absorbed the pushed backlog.
- **Pankaj Aggarwal** -- pull the completed repo-setup and Apple build items into sprint 1 and
  mark them done, said he would do it after the call (2026-09-03).
- **Nitish Goyal** -- comment on SCRIBL-16 and close it. Continue the data model on SCRIBL-20
  and SCRIBL-12 and take it through review with Pankaj.
- **Eric Rice** -- switch into the new AWS account and recreate the IAM roles there, with a
  temporary user as the fallback, said it would be buttoned up today (2026-09-03). Send Pramod
  a screenshot of the five accounts under the Scribl root account so the team can find a usable
  BrowserStack account. Bring the designs up at the shape review and finalize deliverables.
- **Karuna Arshakota** -- generate test cases for workflows 1 and 2 and SCRIBL-28.
- **Shubhankar Bhavsar** -- identify gaps between the meta repo and the development done so
  far, and raise subtasks for them.
- **Pramod Kumar and Karuna Arshakota** -- clear the Linux EC2 instance for the QA test
  repository with Eric before creating it.

### Needs Rob or a decision

- When Christina Strachoff delivers the designs. Rob asked Eric for a timeline; the question
  and part of the answer fall inside a transcript gap, and what survives points at the shape
  review with no date.
- Whether Scribl has a BrowserStack account the QA team can use. Eric is sending the account
  list.
- Whether the app already has an icon. Pankaj raised it, Rob is checking.

## 2026-09-02 (Wednesday)

Digest: [Scrib SU -- 2026-09-02](2026-09-02-standup.md).

### Highlights

- About 23 minutes, eight speakers. Matthew Kaplan is on the invite but does not appear in
  the transcript.
- Rob built a prototype section in the wiki covering the flows and every screen, and is
  pushing it into Jira today as epics and features, with user stories to follow.
- Rob opened an always-open Teams channel he calls office hours in the Scribl Dev team, and
  offered to move the meta repo into the Scribl GitHub org by renaming the Bounteous-named
  repo there.
- Access is nearly closed out. GitHub and Apple developer invites landed; Eric says AWS
  finishes today and Apple approval came quickly.
- Pankaj created a new Scribl mobile app repo without Bounteous in the name, ported the
  earlier generated code in, confirmed the monorepo decision, and set up branches. Branch
  protection rules are blocked on a GitHub org plan upgrade.
- Nitish updated the schema and is on the API contracts, to be committed and reviewed by Rob
  and Pankaj. Karuna settled on a single test-automation repository and is generating test
  cases from the Lucid screens and the wiki workflows. Shubhankar finished his tool setup and
  a code review of Pankaj's work, and is waiting on requirement clarifications from Rajeev.
- Rob walked yesterday's leftover list and closed all four items. Monorepo confirmed.
  Cognito for auth now, built to stay portable to WorkOS if enterprise SSO is ever wanted.
  Story text is mandatory with no minimum length. No draft-and-resume for in-progress
  drawings.

### Action items

- **Rob Forshier II** -- push the prototype-derived backlog into Jira as epics and features,
  no due date stated. Rename the Bounteous-named repo in the Scribl GitHub org and push the
  meta repo there, stated as today's task (2026-09-02). Get together with Karuna to fold her
  test-case process into the Jira workflow, agreed in principle with no time set.
- **Pankaj Aggarwal** -- email Eric the instructions for the GitHub org change needed for
  branch protection rules, said he would do it after the call (2026-09-02).
- **Eric Rice** -- make the GitHub org change once Pankaj's instructions arrive, no due date
  stated. Finish AWS access setup, said it should finish today (2026-09-02). Confirm with the
  Scribl team whether the MVP caps wall creation, promised by end of day (2026-09-02). Enable
  TestFlight from the instructions Pankaj already shared, no due date stated.
- **Nitish Goyal** -- finish the API contracts, commit, and send to Rob and Pankaj for
  review, no due date stated.
- **Karuna Arshakota** -- review the generated test cases against the Lucid mock screens, then
  generate test cases per workflow from the wiki page, no due date stated.
- **Unassigned, addressed to Rajeev Kumar** -- answer Shubhankar's questions on immediate
  requirement scope versus MVP scope. Rajeev does not speak to the topic in the transcript,
  so nobody is on record taking it.
- **Shubhankar Bhavsar and Pankaj Aggarwal** -- set up the iOS certificates and provisioning
  profiles internally, no due date stated. Pramod names a third person the transcript renders
  as "Mohamed", who is not on the invite, so only the two names the transcript is unambiguous
  about are listed. Creating the app itself in the Apple developer account, which Shubhankar
  also asked about, was never assigned on the call.

### Needs Rob or a decision

- Whether the MVP caps how many walls a user can create. Eric's working answer is a personal
  wall plus one group wall, unlimited behind a premium subscription, and he is confirming with
  the Scribl team by end of day because pricing is still being worked out.
- What the GitHub org actually needs for branch protection rules. Pankaj hit an upgrade-to-Team
  error while Eric says payment is already set up. Pankaj is checking and sending instructions;
  Eric can unblock.
- Immediate requirement scope versus MVP scope for the mobile build. Shubhankar is blocked on
  development until someone answers; he posted the questions to Rajeev, who did not respond on
  the call.

## 2026-08-28 (Friday)

Digest: [Scrib SU -- 2026-08-28](2026-08-28-standup.md).

### Highlights

- Thin attendance, as expected: most of the India-based team was out for Raksha Bandhan. Rob
  names the holiday directly at the start rather than treating the gap as a fetch problem.
- Five distinct speakers: Rob Forshier II, Matthew Kaplan, Eric Rice, Pramod Kumar, Shubhankar
  Bhavsar. Karuna Arshakota, Nitish Goyal, Pankaj Aggarwal and Neelesh Aggarwal do not speak.
- Rob demoed an unplanned image-composite feature (pick images from the personal wall, arrange
  and rotate on canvas, save or share), built because Eric's wall interaction looked fun to
  build. It ships in the Vercel POC; Christina still owns the corner-rotation design for mobile.
- Rob considers himself hands-off on the prototype now except for bugs or new asks, and starts
  laying down the harness today.
- Pramod is preparing detailed GitHub, AWS, and Apple setup steps to send Eric on 2026-08-31.
  Shubhankar researched the Apple Developer organization-verification path and posted notes to
  the team channel.
- Eric is still tracking down the team's access to Scribl's existing GitHub, set up by a
  since-departed contractor at a prior employer.

### Action items

| Item | Owner | Due |
| --- | --- | --- |
| Send detailed GitHub, AWS, and Apple setup steps to Eric | Pramod Kumar | 2026-08-31 (stated as "Monday") |
| Complete the Apple organization verification filing once steps arrive | Eric Rice, Matthew Kaplan | No due date stated |
| Start laying down the harness | Rob Forshier II | 2026-08-28 |
| Design the corner-rotation interaction for the new image-composite feature | Christina (owner inferred from context, no date stated) | No due date stated |
| Resolve access to Scribl's existing GitHub | Eric Rice | No due date stated |

### Needs Rob or a decision

- What Apple's "SN process" refers to is unclear from the transcript; Shubhankar names it without
  expanding the term, and this record does not resolve it into a confident claim.
- Whether the Apple filing is time-consuming for Scribl's side was raised by Matthew Kaplan and
  answered only impressionistically by Rob, not from direct experience -- worth a firmer answer
  once the steps document lands.

## 2026-08-27 (Thursday)

Digest: [Scrib SU -- 2026-08-27](2026-08-27-standup.md).

### Highlights

- Rob handed off screens from the design sync with Christina and Eric, plus a script that
  regenerates an all-screens board PNG and a flow diagram from the prototype.
- Christina and Eric picked a subset of harder screens for Christina to design; Rob will use
  Claude to fill in the rest once he has that set.
- Both the GitHub and Apple email chains from 2026-08-26 are in motion. AWS access lands as a
  partition inside Scribl's existing AWS account rather than a new one -- Eric Rice.
- Karuna is building an Appium-plus-XCUITest automation sample, confirmed no existing test cases
  in the B2B repo, and expects test-case-management-tool details by Monday.
- Nitish drafted the DB schema and API contracts and will post the draft to the meta repo.
  Shubhankar, a new hire, introduced himself and is still onboarding.
- Six distinct speakers: Rob Forshier II, Eric Rice, Pramod Kumar, Karuna Arshakota, Nitish
  Goyal, Shubhankar Bhavsar. Matthew Kaplan had a conflict per Eric; Pankaj Aggarwal and Neelesh
  Aggarwal were invited but do not speak in the transcript.

### Action items

| Item | Owner | Due |
| --- | --- | --- |
| Send the all-screens board PNG and flow diagram to Karuna and the team | Rob Forshier II | No due date stated |
| Finish the subset of screens Christina is designing, then hand the rest to Rob for Claude fill-in | Christina, Rob Forshier II | No due date stated |
| Continue the GitHub and AWS email threads with Scribl toward repo spin-up and AWS access partition | Pramod Kumar, Eric Rice | No due date stated |
| Prepare a demo of the Appium/XCUITest automation sample | Karuna Arshakota | No due date stated |
| Deliver test-case-management-tool evaluation details | Karuna Arshakota | 2026-08-31 ("Monday" as stated) |
| Put the DB schema and API contracts draft in the meta repo for team review | Nitish Goyal | No due date stated |
| Finish onboarding (laptop, full system setup) | Shubhankar Bhavsar | No due date stated |

### Needs Rob or a decision

- None. No decision or escalation to Rob is raised on this call; every open item is either a
  handoff already in motion or routine team progress.

## 2026-08-26 (Wednesday)

Digest: [Scrib SU -- 2026-08-26](2026-08-26-standup.md).

### Highlights

- First standup with the client present, Eric Rice and Matthew Kaplan.
- Rob reverses the 2026-08-25 kickoff call on code hosting. Build in the
  client's GitHub, not Bitbucket. The B2B repo Eric shared has a GitHub
  folder in it, and a Bitbucket-to-GitHub pipeline migration later would mean
  a full rewrite. Rob Forshier II: "If we build it in Bitbucket, Bitbucket's
  pipeline versus GitHub pipeline, apples and oranges. So we would have to do
  like when we go to move that over, we'd have to do like a migration to
  basically rewrite the entire pipeline."
- Three email chains start today: GitHub, AWS, Apple. Rob wants the team to
  edit his runbook draft first. Rob Forshier II: "I want to have the team
  first go through and edit the specific parts, because I just kind of threw
  this together."
- The drawing data model changes. Strokes now save as a serialized vector
  array via Skia, not a flattened image, so a drawing can later replay
  alongside a recorded story, an idea Eric raised on 2026-08-25.
- Matthew Kaplan says the AWS re:Invent submission deadline is roughly two
  weeks out: "I know that we only have two weeks to put our submission in.
  That submission, the deadline I think is 2 weeks from this Thursday, two
  weeks from tomorrow." Rob ties AWS region and scale sizing to that launch.

### Action items

| Item | Owner | Due |
| --- | --- | --- |
| Message the former dev team for GitHub org access | Eric Rice | 2026-08-26 |
| Start the AWS email chain on the client side | Eric Rice | 2026-08-26 |
| Start Apple Developer account sign-up using Rob's playbook | Eric Rice | No due date stated |
| Edit the runbook draft (GitHub, AWS, Apple sections) before the three emails go out | Rob Forshier II and team | 2026-08-26 |
| Add everyone to the B2B GitHub repo now that Pramod is admin | Pramod Kumar | No due date stated |
| Review the B2B app for existing test management tooling | Karuna Arshakota | No due date stated |
| Send AWS re:Invent submission script and details once available | Matthew Kaplan | 2026-09-10 (derived, low confidence) |
| Run the design session to lay down POC screens and pick MVP features | Rob Forshier II, Eric Rice, Christina | 2026-08-26 |

### Needs Rob or a decision

- Apple, AWS and GitHub access are the three biggest blockers, named as a set
  by Rob Forshier II. The unblocking path is three email chains started
  today, one per item.
- The transcript carries no commitment from Pramod Kumar to review the AWS
  and Apple runbook sections with Pankaj Aggarwal. The only ask on record is
  Rob's, that the team review the draft.
- C20 (eraser), C21 (brush width), C22 (missed-day reveal) and the
  artifact-in-MVP question did not come up in this call at all.

## 2026-08-25 (Tuesday)

Digest: [Scrib SU -- 2026-08-25](2026-08-25-standup.md).

### Highlights

- Internal standup, 10:00 to 10:30 CDT, running about 24 minutes. The last
  internal-only one; the client joins from 2026-08-26, which Rob raised on the
  call.
- Attendees speaking: Rob Forshier II, Pankaj Aggarwal, Nitish Goyal and Karuna
  Arshakota.
- MVP prompts are one predefined daily prompt per day, pulled from the database.
  Region variation, personalization and per-person uniqueness are all future. Rob
  Forshier II: "there'll just be some predefined single prompts per day, and
  that's it." Karuna Arshakota asked whether region-validation testing is in MVP
  scope and the answer was no.
- Expo is confirmed as the framework, in Pankaj Aggarwal's ADR. His words: "before
  2023 Expo was very slow and all, but now it's all good. In fact, Expo is the
  best choice now." iOS first, Android second. A web build is possible and has not
  been asked for.
- Code starts in Bounteous repositories and shifts to the client's toward the end
  of the engagement. Pankaj Aggarwal flagged that CI/CD depends on when that
  happens, and that day-one automated pipelines will not hold across the move.
- Pankaj Aggarwal raised a question that was not on the client board: can a
  web-app user join the same wall as mobile users, and what compatibility layer
  would share images and strokes between the two products. Rob took it to the
  client the same afternoon, who confirmed the two products stay separate. The
  compatibility question itself stays open.
- Rob Forshier II handed the Jira board to the delivery team to own: "please start
  making the Jira board your Jira board." The team writes the user stories under
  his epics and features, discards or repurposes tickets that do not fit, and adds
  what is missing, with the backlog fleshed out by end of week.
- Monetization levers the client is weighing, relayed rather than decided: a
  wall-count limit, a paid extra brush at around 1.99 US dollars, or a colour
  unlocked by play time. These feed epic E17.
- Wall ordering and any wall-count limit are both undecided and need the client.
  Notifications are email plus in-app.
- Walls are the product's channels: personal, family, and external to family.
- The member avatars shown above a family wall have no feature or backlog entry.
  Rob flagged that one needs adding, likely in the orange band.
- Shape runs this week and next, then planning, then heads-down delivery. Further
  funding is expected to extend the work past the eight weeks.

### Action items

| Item | Owner | Due |
| --- | --- | --- |
| Own the Jira board: write user stories under the existing epics and features, discard or repurpose tickets that do not fit, add what is missing | Pankaj Aggarwal, Nitish Goyal, Karuna Arshakota | Backlog fleshed out by end of week |
| Collect the client's B2B app source code | Rob Forshier II | 2026-08-25 |
| Ask the client whether they want web-app support, and whether a web user joins the same wall as mobile users | Rob Forshier II | Client call the same day |
| Ask the client what they use for CI/CD today and where their repositories live | Rob Forshier II | No due date stated |
| Add a feature and backlog entry for the member avatars above a wall | Rob Forshier II | No due date stated |
| Put open questions on the Lucid board so they reach the client | Whole team | Before the client call |
| Schedule a longer working session to walk the epics and features with the team | Rob Forshier II | No due date stated |
| Decide whether the standup slot extends to an hour with the client joining the second half | Whole team | After running the current shape a day or two |

### Needs Rob or a decision

- Whether a web-app user can ever join the same wall as mobile users, and what
  compatibility layer that needs. The client has confirmed the two products stay
  separate, which does not answer this.
- Any limit on how many walls a person can create, and how walls are ordered.
  Both need the client.
- Whether the member avatars above a wall become a feature, and in which band.
- Whether the standup slot extends to an hour with the client joining the second
  half. Left undecided on the call, with the current shape to run a day or two
  first before anyone commits.
- Whether a person can draw more than once a day. Two mechanisms already exist in
  the POC, a challenge that creates extra prompts and prompt packs on a personal
  wall, and the design still needs a conversation.

## 2026-08-24 (Monday)

Digest: [Scrib SU -- 2026-08-24](2026-08-24-standup.md).

### Highlights

- First standup of the eight-week build. It ran about 46 minutes from 10:01 CDT, past
  the 30-minute slot on the calendar.
- Attendees: Rob Forshier II, Pramod Kumar, Nitish Goyal, Karuna Arshakota, and
  Pankaj Aggarwal, who joined late from a conflicting call.
- The team has started on the backlog HTML. Karuna picked up the testing-framework
  spike, and Pankaj came back with a revised questionnaire that fills in assumptions
  instead of leaving open questions. Rob loads Jira from the backlog after the call.
- The eight-week build is now called the MVP. "POC" refers only to the earlier
  prototype.
- A second iOS engineer onboards 2026-08-25 or 2026-08-26 full time.
- Apple developer account ownership is unresolved and gates how QA gets a build onto a
  device. Expo Go is the interim path, since the prototype was built on it.
- Test case documentation starts in Excel. Jira's native handling is too heavy for the
  team's flow, and the team will look for a licensed alternative.
- The client joins standup from 2026-08-26. Open questions for the client go on the
  Lucid board.

### Action items

| Item | Owner | Due |
| --- | --- | --- |
| Confirm Pramod has admin, edit, and share on the Lucid board, and that Nitish's re-sent invitation landed. Pramod's share controls were greyed out at the start of the call | Rob Forshier II | No due date stated |
| Load the backlog and spikes into Jira | Rob Forshier II | 2026-08-24, stated as after the call |
| Ask the client whether they have an Apple developer account, and whether Bounteous can stand one up and transfer it later | Rob Forshier II | 2026-08-25 workshop |
| Ask the client what test management software their existing system uses | Rob Forshier II | 2026-08-25 workshop |
| Bake the PTO tracker into the plan so the day counts are accurate | Rob Forshier II | No due date stated |
| Run the spike that builds out the Claude Code harness, then hold a one-hour team training session on it | Rob Forshier II | No due date stated |
| Onboard the second iOS engineer | Pramod Kumar | 2026-08-25 or 2026-08-26 |
| Check with Bounteous IT on test devices for QA | Pramod Kumar | No due date stated |
| Check whether Bounteous has a licensed test management tool this team can use | Pramod Kumar, Karuna Arshakota | No due date stated |
| Post the spike questions and the revised questionnaire to the Teams channel | Pankaj Aggarwal | No due date stated |
| Turn the architecture and assumptions document into a wiki page in this repo | Pankaj Aggarwal | No due date stated |
| Set the QA test case documentation standard, starting in Excel | Karuna Arshakota | No due date stated |
| Complete the testing framework spike, with alternatives considered and the reason for the pick | Karuna Arshakota | No due date stated |
| Get open questions onto the Lucid board so they can go to the client at the workshop | Whole team | 2026-08-25 standup |
