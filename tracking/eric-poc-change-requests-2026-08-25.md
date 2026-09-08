---
title: "Eric Rice's POC change requests, 2026-08-25"
project: scribl
type: planning
status: extracted from transcript, awaiting Rob's build pass
updated: 2026-08-25
source: knowledge/meetings/2026-08-25-scribl-shape-kickoff.md
---

# Eric Rice's POC change requests, 2026-08-25

Every change Eric Rice asked for while Rob walked the updated POC in the Scribl
Shape Kickoff, 2026-08-25, 12:00 to 13:00 CDT. One row each, ordered so the
cheap and unambiguous work comes first. Rob works down this list.

Matthew Kaplan is on the call and disagrees with Eric on three of these rows.
Where he does, the row says so. Eric and Matthew are both the client, so neither
voice is a Bounteous opinion, and a row that carries a disagreement is not a
decision yet no matter how it was said.

Timestamps are into the recording, which starts at 12:00 CDT. Raw transcript:
`knowledge/meetings/raw/2026-08-25-scribl-shape-kickoff.vtt`. The digest is at
`knowledge/meetings/2026-08-25-scribl-shape-kickoff.md`.

Backlog codes are `Enn-Fn` from `tracking/backlog-epics.md`. `no backlog home`
means no feature on that page covers it today, and that is a gap to close, not a
reason to drop the row.

## How I satisfied myself this list is complete

Rob recalled two items before this extraction ran: remove the sign-out button
from the home screen, and remove the extra brush styles. Both are here, as C01
and C02, so the two known items are a check on the method rather than the output
of it. The passes, in the order they ran:

1. **Full sequential read.** All 497 utterances of the flattened transcript, read
   end to end in three blocks, 00:00:03 to 01:03:33. Nothing sampled.
2. **Speaker-scoped read.** Every Eric Rice utterance pulled out and read in
   isolation, 197 of them, so a request buried in a long turn about something
   else could not hide behind Rob's replies.
3. **Imperative and modal sweep.** Grep across Eric's lines for `want`, `need`,
   `get rid`, `remov`, `add `, `should`, `keep`, `keeping`, `definitely`,
   `let's`, `instead`, `only`, `prefer`, `chang`, `would be`, `could we`,
   `can we`, `make `. Every hit was reconciled against the rows below. The sweep
   surfaced no request that the sequential read had missed, which is the result
   I wanted from it.
4. **Screen-scoped pass.** For each screen Rob walked in order -- splash, sign
   up with the onboarding toggle, Scribl welcome, prompt of the day, canvas,
   story input with voice or text, personal wall, response detail, walls list,
   create wall and invite, invite acceptance, home screen, share card, artifact
   -- I went back to the transcript window for that screen and asked what Eric
   said about it. This is the pass that caught C03, C07 and C22, none of which
   read as change requests in a keyword sweep.
5. **Confirmation pass.** Everything Eric confirmed without asking for a change
   is listed separately under "Confirmed, no change" so that a silent
   confirmation is not mistaken for a missed request.
6. **Adversarial check by a second reader.** A separate pass re-read the whole
   transcript against a finished draft of this page, with one instruction: find a
   request in the POC walk that no row covers, and verify every quote, timestamp
   and speaker. It found one missed request, C26, and four timestamp errors, all
   now corrected. That is recorded here rather than quietly fixed, because the
   honest completeness claim is that five passes by one reader missed something
   and a sixth by another reader caught it.

Where the list is thin by construction: this covers the POC walk and the Figma
walk, 00:09:18 to 00:45:08. The Lucid board question set that follows,
00:45:18 to 01:03:16, produced answers rather than POC changes, and those live
in the digest's board-questions section. Two of those answers do change the POC
anyway, and they are here as C14 and C23 rather than left in the digest alone.

## The list

### Cheap and unambiguous

| # | Screen | What Eric asked for | Decision or question | Backlog |
|---|---|---|---|---|
| C01 | Home | Take the sign-out button off the home screen and put it in the profile options section. Verbatim: "I think the only question I had was about the logout button. Most of the time these days, I'm seeing logout buried kind of in your personal options. And is there ever really a reason for a person to log out? So having it up here by the avatar, we think might confuse or just have people, you know, log out accidentally." (00:28:13 to 00:28:36) and "it's pretty much regulated to the, you know, the profile options section now" (00:28:51) | Decision. Confirmed by Rob 2026-08-26: off the home screen, and it lives only on the profile page | E05-F5 |
| C02 | Canvas | One brush, no brush-style or brush-size selector. Verbatim: "Yes, we're just going to do one brush." (00:25:09), answering Rob's "Do you want to get rid of brushes? Because basically you just said you just want one brush, right?" | Decision | E04-F1 |
| C03 | Sign in | Drop the returning-user onboarding screen on mobile. It exists only because the POC is a web app. Eric: "The device I'm assuming is going to recognize the user post their first login... Is someone going to have to go through that every time?" (00:19:30) then "you log in once until you log out" (00:20:08). Rob: "on a mobile app, we don't need to do this... we can get rid of that screen for the mobile app users." (00:19:57). Eric called it "a point of confusion" | Decision | E02-F4 |
| C04 | Canvas | Keep the undo button, and keep it as a single step back. Verbatim: "keeping the undo button, which goes back a single step" (00:21:33) | Decision | E04-F1 |
| C05 | Canvas | Move every canvas control to the bottom and feature the prompt at the top. Verbatim: "the prompt should be featured more at the top... keep pushing, you know, because people will question, you know, what was I drawing again? Similar to the current setup, and then anything, colors, undo, and if we go within a race or a trash, we do that as well over to the right hand side." (00:26:22 to 00:26:29) | Decision | E04-F1 |
| C06 | Canvas | Give the canvas a clearly defined bounding box. Verbatim: "the other question I kept getting is about the bounding box in the canvas itself. So we have a very defined one in the B2B game... And so having a very clear bounding box so people know exactly where they want to draw. Pretty simple." (00:23:45 to 00:23:57) | Decision. Confirmed by Rob 2026-08-26: the bounding box comes from the B2B theme's background treatment rather than separate chrome, per Eric's "I think it might just be a function of the background" (00:23:45 to 00:23:57) | E04-F1 |
| C07 | Avatar creation | Avatar creation is the same canvas, with the bounding box drawn as a circle. Eric: "I also had a little note, if we're going to do the avatar creation screen, it could just be exactly the same." (00:24:20) and "the bounding box would be would be in a circle" (00:24:36). Rob had already built it that way | Decision | no backlog home. Avatar creation has no feature on the backlog page. Closest parent is E02-F4 |
| C08 | Canvas | The eight colours must not be laid out in rainbow order. Verbatim: "color layout, you know, whatever we decide on, just definitely not Roy G. Biv." (00:24:04) | Decision | E04-F1 |
| C09 | Share card | Render the shareable with its border. Rob: "Right now it's just spitting out just the image without the border. So I'm trying to get it to actually spit it without the or with the border." (00:38:24). **This is Rob's own item, not an Eric ask**, and it is on the list because it blocks C13. Rob made the same note about the invite card image earlier, also unprompted: "I think we kind of need to add a little more border" (00:16:50). Eric did not raise a border at any point | Rob's own fix, not a client decision | E12-F1 |

### Needs a small build decision, but the client has said yes

| # | Screen | What Eric asked for | Decision or question | Backlog |
|---|---|---|---|---|
| C10 | Canvas | Add a trash button that clears the canvas, behind a pop-up confirmation. Verbatim: "We would want a trash button for people to start over, start fresh... So instead of hitting the undo button 50 times, they can clear the screen... But we would definitely want some sort of pop-up confirmation so that people didn't do it by accident. Because Abby actually mentioned that a few times using the POC, she cleared her entire drawing out by just clicking the wrong button." (00:22:14 to 00:22:35). Placement is the right-hand side of the bottom bar per C05. **Matthew Kaplan objects**: "I would just keep it simple. I mean, I feel like adding an erase button, adding a trash button, I mean, it's just a lot more buttons that people will start to strive for perfection." (00:23:05 to 00:23:15). Eric closed it with "we can talk about it internally by reasoning behind it" (00:23:19) | Decision by Eric, contested by Matthew, so build it and expect it to be revisited. Confirmed by Rob 2026-08-26: build it, Matthew's objection stands unresolved | E04-F1 |
| C11 | Canvas | Add white as a ninth colour, interchangeable with an eraser. Verbatim: "I think you know white and race would be interchangeable. Let us, we'd probably just have you add a white option. Let us talk about it a little bit more. There seems to be some differences of opinion." (00:27:17 to 00:27:27). Rob: "I'll put white on there for right now if that's okay." Eric: "We will play around with it and see if we like it." (00:27:35) | Decision, explicitly provisional. Eric named the disagreement himself. Nine swatches total, decided 2026-08-25 by Rob Forshier II: the eight named colours (see C08's list) plus white. Rob decided to ship it 2026-08-25; it landed on scribl-app PR 35. The eraser question (C20) is a separate, NOT decided question | E04-F1. Note this makes it nine swatches against the eight-fixed-colour decision in the written feedback, so the written record needs the amendment |
| C12 | Home | Make the avatar more prominent, or more special. Verbatim: "we can do, make the avatar maybe even a bit more prominent or have it be a bit more special." (00:28:51). Eric named the home screen as the second screen Christina designs, so her pass may absorb this | Decision, design-led | E05-F5, and it depends on the design working session |
| C13 | Share card | Feature the prompt on the shareable so the drawing has context, and carry the story, voice or text, onto it. Verbatim: "The prompt being featured is key so that people have context. And then, you know, just say, hey, this person's talking about an adventure they were on. And then they kind of summarize what the drawing means. What's cool about this is now we can add the stories, whether it's voice or text." (00:36:17 to 00:36:42). Floor for the MVP, verbatim: "At the very minimum, a static image, maybe there's room for text" (00:37:37) | Decision | E12-F1 |
| C14 | Canvas and storage | Store the individual strokes, not only the final flattened image. Rob found the gap on the call: "some of this I think I might have to go play a little more because I'm just recording the final image at the end. I wasn't actually recording all the keystrokes" (00:54:59), then "I need to go revisit that one" (00:55:24). Eric's reason, verbatim: "when I go into Metabase and I pull up a particular file or a particular drawing, I can pull that code, those keystrokes, and if I throw that into like ChatGPT or whatever, it'll draw the image for me based on that. So I can reproduce the images." (00:56:05) and "There's so much you can do with this if you have that information from every, for every image." (00:56:34). Rob's read on cost: "it's really just a vector store... it's literally just a color and then a start and an end" (00:56:57) | Decision | E04-F2. Named in the backlog as the cut Rob likes least, and this call is the client saying do not cut it |
| C15 | Challenges | Put challenges back, trimmed for the MVP to injecting a new prompt. Verbatim: "I think for the MVP, we want to stick to just injecting a new prompt." (00:33:20) and "for the time being, we'll just trim it down to prompt injection." (00:34:51). Who triggers it, verbatim: "maybe the mom who started the wall goes to the family game pack and picks a couple to do" (00:33:42). Rob had removed challenges from the POC believing they were out; his answer was "I'll put challenges back in place then." (00:34:45) | Decision | E18-F2. Challenges are recorded on the backlog as a parked capability, built and switched off. This row moves prompt injection out of the park and into the MVP, so E18-F2 needs splitting |

### Real work, and the client agrees it is not MVP

**Artifact in MVP is STILL OPEN as of 2026-08-26.** Eric put the whole
Artifact idea outside the eight weeks himself, "we realized that this could
be a ways out, phase two, three, 4, whatever" (00:45:00), but whether and to
what extent the Artifact is in the MVP has no answer on the call or since.
C16, C17, C18, C19 and C26 below are all Artifact-adjacent and none of them
close this question. Other records in this run have disagreed on whether this
is open or closed; this file says open, per the kickoff transcript.

| # | Screen | What Eric asked for | Decision or question | Backlog |
|---|---|---|---|---|
| C16 | Artifact | Long-press to pull individual drawings off a wall, then resize, rotate and arrange them by hand to compose one image, the way phone stickers work. Verbatim: "Is it possible to, you know, long press a few of the pieces of art, have them pop up similar to stickers, and then you can resize, rotate, and arrange them manually to create something?" (00:40:03). Resize behaviour, verbatim: "we probably want the resize to be, I don't know the name, proportional, like when you hold shift or control" (00:42:48), which Matthew read back as "You're maintaining the integrity of the original stroke". Reference for the interaction, verbatim: "it might be Instagram Stories that does it really well." (00:43:30). Band, in Eric's own words: "we realized that this could be a ways out, phase two, three, 4, whatever, but we just wanted to put it out there." (00:45:00). Rob: "this will be like in the orange section or, you know, gray possibly later, but yeah, I can at least try and get in the POC." (00:44:15) | Decision on the shape, explicitly out of the MVP. Rob volunteered to attempt it in the POC only | E18-F4, with E12-F2 for the multi-picture selection half |
| C17 | Artifact | Let a composed artifact be saved to the personal wall, not only shared out. Rob raised it, Matthew agreed: "For sure. That's really cool." (00:42:40). Eric did not respond to this one directly, so treat it as Matthew's yes rather than Eric's | Decision by Matthew Kaplan, not Eric. Attribution matters here | E18-F4 |
| C18 | Share | Animate the drawing as the voice story plays, by replaying the stored strokes against the recording's timeline. Verbatim: "Let's say I record a 15-second voice story that goes with this image of me wrestling an alligator. As that's being told, maybe this is being drawn in real time using those strokes, and it's just, you know, elastic banded to the time frame. It's a thought, could be farther off." (00:37:11) | Decision on direction, self-flagged as later. Depends entirely on C14 | no backlog home. E04-F2 stores the strokes and E12-F1 renders a static document; nothing renders a stroke replay |
| C26 | Artifact, AI composition | Have Christina hand-produce a large corpus of scribbles for the AI composition to learn from, so the output reads as drawn rather than photographic. Verbatim: "we were still kind of like half and half on that. That's why we were talking about like Christina creating a huge trough of scribbles to help flavor that they would pull and learn from as opposed to being something that's like hyper realistic." (00:44:42) | Decision on direction, later phase. It is also a design-capacity ask on Christina, on top of her three screens | E18-F5 covers the AI enhancement pipeline. The training corpus itself has no feature |
| C19 | Artifact | Cap the cost of AI-composed artifacts with a token or allowance system, and monetize the allowance. Verbatim: "if someone's making 100 of them a week, we'll be in trouble. So is there a token system or something that we can, you know, start putting forward. And of course, stakeholders love the idea of, hey, you can further monetize this beyond just a small subscription fee." (00:41:20 to 00:41:39). Eric put the per-composition cost from the earlier vendor work at roughly 17 to 63 cents | Decision on direction, later phase | E17-F1 and E17-F3. E08-F4 already covers the cost telemetry that would measure it |

### Open questions, no decision on the call

| # | Screen | What Eric asked | Decision or question | Backlog |
|---|---|---|---|---|
| C20 | Canvas | Add an eraser. Verbatim: "possibly adding an erase button, which we had a lot of requests for where people don't want to undo something, but they want to get rid of a small part of something. And that would also double up as essentially white paint, which people could do over." (00:21:33 to 00:21:50). Matthew pushed back hard, asking whether there is user input to justify it at all (00:22:43 to 00:23:28). Eric: "Yeah, we can talk, what we talk about internally, now's not really the time." (00:23:38) | **Question, STILL OPEN as of 2026-08-26.** Scribl decides internally. Do not build it | E04-F1 if it lands |

### Decided 2026-08-26

C21 moved here from "Open questions" once Rob decided it on 2026-08-26. It was
an open question through the 2026-08-25 extraction pass; the decision below is
newer than that pass, per the kickoff transcript digest.

| # | Screen | What Eric asked for | Decision or question | Backlog |
|---|---|---|---|---|
| C21 | Canvas | What exact brush width. This is the one place the two client voices gave different answers and neither yielded on the call. Eric picked from the screen share: "the sizing that you just showed us, I think it was maybe second to the right was probably best" (00:25:15) and restated it at 00:26:04, "second from the right". **Matthew Kaplan's dissent, in full, never withdrawn:** he was holding a phone. He said the largest was "massive": "that's massive... The smallest line on Rob's app on my phone is closest to the scribble game today" (00:25:23), then "I think that is either one, either that third one or 4th one to the right is probably close... I would say that third one is probably mimics mostly what we have today. So I would go with that one for the MVP." (00:25:52). Eric's reply was conditional and not a handover: "if you're on the phone and you think it needs to be smaller, then yeah, go for it." (00:25:49) | **Decided 2026-08-26 by Rob Forshier II.** One brush, one width, no size picker. The width is the second from the right of the four sizes on the client's own canvas picture, to be read off the frame rather than guessed. No pixel number is asserted here; `code-questions.md` Q2 records the four-size row as `[18, 12, 5, 2]`, largest to smallest, but the picture's ordering is not verified in any record this run holds. Matthew's dissent above stands, unsoftened, and was never withdrawn. Outstanding: the shipped scribl-app code currently carries the client's own B2B width instead of Eric's pick, so a code change is outstanding. That change is in the code repo, not this run | E04-F1 |
| C22 | Wall and prompt | The missed-day reveal rule. Eric raised it as Abby's question, verbatim: "well, what if your mom missed a day and your nieces didn't... So do we unlock everything the next day? Like you can see what people did yesterday... Is that a premium feature? Do we let people go back and do previous day's prompts if they have a paid account?" (00:29:35 to 00:30:11). Rob demonstrated the POC's answer, a written reason that unlocks the day. Matthew's objection, verbatim: "if we give people the ability to break it and still get to the reveal, I don't know. I don't love it. You know, if you miss your daily Wordle, can you go back and do it?" (00:31:42). Eric closed it: "I think the functionality, whatever we might want it to be, is there. We just need to figure out the exact, you know, rule set for it." (00:32:44) | **Question.** Scribl decides internally. The mechanism exists in the POC; the rule does not exist anywhere | E04-F5 submit-to-unlock owns the mechanism. The rule set has no backlog home |
| C23 | Response detail | Whether a person may edit a drawing they already submitted. Rob asked directly at 00:55:24. Eric, verbatim: "I don't know. I don't know what we might do in the future. I know we've talked about people being able to draw on top of others or add to. Do we allow people to edit ones that were already done? I'm leaning towards no, but you never know." (00:55:37 to 00:55:50). Rob recorded it as "for now, I just put open, no for now." (00:57:18) | **Question**, parked at no. Answered enough to build against, not enough to close | no backlog home. Nothing on the backlog page covers editing a submitted response |
| C24 | Onboarding, story step | Whether the split voice-or-text screen stays. Rob removed the split screen from the POC at 00:13:04. Eric explained why it existed, verbatim: "the thought with that screen in particular, while it might not carry through to the rest of the game, it was to very blatantly show people you could do one or the other and you needed to choose one. We have to be like super implicit with this onboarding because we've learned a lot. It's that people just don't get stuff." (00:13:47). He neither asked for it back nor endorsed the removal | **Question.** Eric gave the requirement, which is that the choice must be explicit in onboarding, and did not rule on the screen that delivers it. Ask him | E02-F4 |
| C25 | Intro and home | Static art or animation for the screens Christina designs. Eric asked: "is there a plan for an opportunity for any animation here, or should she just create static images?" (00:20:27). Rob offered animation. Eric: "Sorry, I might just be static to start. I'll talk to her about that today." (00:20:50) | **Question**, leaning static. Eric owns it with Christina | E01-F9 carries the splash, and Q3 on the open-questions page is the same question |

## Confirmed, no change asked for

Listed so a silent confirmation is not read as a missed request.

- **The eight colours.** "Moving over the canvas, you got the new colors. We're going with those eight." (00:20:56). Rob had applied them the morning of the call.
- **The B2B canvas feel is the target.** "we are in love with that canvas and that drawing, the feeling behind it. It almost feels like you're pushing paint around. It's like it's got a very finger paint feeling to it... So we want to mimic that as close as possible." (00:21:10 to 00:21:33). This is the acceptance bar behind C02 and C21.
- **The home screen layout.** "home screen. We really like this layout." (00:28:13). Only the sign-out button and the avatar prominence change, per C01 and C12.
- **The wall.** Rob modelled it on Eric's designs and showed the member avatars above the wall. Eric walked his own updated wall at 00:29:12, "just showing you showing some of the differences in the wall since the update, where it kind of multiplies a bit", and closed it with "Awesome." at 00:29:27. No change asked.
- **Christina's screens.** The intro screen, the home screen, and the shareable for a single story. "I identified those three or four screens there that we would probably have her work out, being the intro screen, the home screen, and then whatever the shareable is for the single story, which might also carry over the artifact." (00:07:13), and the share card named again as "the third place we'd have Christina interject some background art" (00:36:17). Everything else is Rob replicating her theme, which answers Q15 on the open-questions page. Eric or Alex cover the rest.

## What this list changes about the backlog

Five gaps, worth raising at sprint 1 planning rather than absorbing quietly.

1. **Avatar creation has no feature** (C07). It has a canvas, a bounding box and a save path, and it is on the client's design list.
2. **The stroke replay has no feature** (C18). E04-F2 stores strokes and E12-F1 renders a static document. Nothing turns strokes back into motion, and it is the thing Eric got most animated about.
3. **Editing a submitted response has no feature** (C23), even to record that the answer is no. A parked no with a reason is cheaper than rediscovering the question in sprint 3.
4. **Challenges are recorded as parked and are now partly in the MVP** (C15). E18-F2 needs splitting so prompt injection can be planned without unparking the rest.
5. **The AI training corpus has no feature** (C26), and it is a design deliverable from Christina rather than engineering work, so it will not surface at sprint planning unless somebody puts it on the design track.

The member avatars above the family wall were flagged in the same day's standup
as having no feature or backlog entry. Eric confirmed the wall layout on this
call without discussing them, so that gap is real and this call did not close it.

## Appendix, draft Jira updates

**Draft text, not yet applied to Jira as of 2026-08-26.** Anyone on the team
can file these; the write policy is in `CLAUDE.md`, section "Work-item
execution (story/AC kit)", and whatever lands in Jira gets its repo
counterpart updated in the same session. Board: SCRIBL, per
`tracking/jira-board.md`.

**Canonical for Jira draft text is `tracking/jira-updates-2026-08-25-eric-feedback.md`,
decided 2026-08-26.** This appendix keeps only the C-key to `Enn-Fn`
mapping, which is the thing it uniquely knows. For `E04-F1` (SCRIBL-41), `E02-F4`
(SCRIBL-31) and `E05-F5` (SCRIBL-52), read the current draft text in that file,
not here.

The three rows below carried their own draft wording before 2026-08-26. That
wording is now superseded, marked so rather than deleted, in
"Superseded appendix wording, as of 2026-08-26" further down.

| Jira target | Draft change | From |
|---|---|---|
| `E04-F1` Skia canvas with the reduced tool set | See `tracking/jira-updates-2026-08-25-eric-feedback.md`, SCRIBL-41, for the current draft | C02, C04, C05, C06, C08, C10, C11, C20, C21 |
| `E04-F2` Stroke serialization and artwork capture | Raise its priority and strike the "raster capture only" cut option. The client asked for stroke storage by name and gave the reason | C14 |
| `E02-F4` Guided onboarding, screens 1 to 8 | See `tracking/jira-updates-2026-08-25-eric-feedback.md`, SCRIBL-31, for the current draft | C03, C24 |
| `E05-F5` Dashboard with Your Walls and the stats card | See `tracking/jira-updates-2026-08-25-eric-feedback.md`, SCRIBL-52, for the current draft | C01, C12 |
| `E12-F1` Share one response as a document | Add: the prompt is featured on the document, the story text or voice is carried, and the rendered image keeps its border | C09, C13 |
| `E18-F2` Challenges | Split. Prompt injection by a wall member moves into MVP scope. The rest of the challenge set stays parked | C15 |
| `E18-F4` Artifacts and keepsake composition | Add the manual long-press compose interaction, proportional resize, rotate, arrange, and save-to-personal-wall alongside share. Keep it out of the eight weeks | C16, C17 |
| `E17-F1` Define the paid tier | Add the artifact allowance or token idea, with the per-composition cost range Eric quoted | C19 |
| New issue, `E02` | Avatar creation screen. Same canvas, circular bounding box | C07 |
| New issue, `E12` or `E18` | Stroke replay rendering, drawing animated against a voice story's timeline. Band it gray | C18 |
| New issue, `E04` | Record the decision that a submitted response cannot be edited, with the reason and the date | C23 |

### Superseded appendix wording, as of 2026-08-26

Kept for the record, not deleted. This is the wording this appendix carried
for `E04-F1`, `E02-F4` and `E05-F5` before the 2026-08-26 canonicalization
moved that text to `tracking/jira-updates-2026-08-25-eric-feedback.md`.

- **`E04-F1`, superseded 2026-08-26:** "Rewrite the tool set as: one brush at
  a single width, eight colours plus white, undo at one step back, trash
  behind a pop-up confirmation, all controls in a bottom bar, prompt featured
  at the top, an explicit bounding box, and no rainbow colour ordering. Add a
  note that the eraser is a client-internal decision and out until it comes
  back."
- **`E02-F4`, superseded 2026-08-26:** "Remove the returning-user onboarding
  screen from the mobile scope. Add the requirement that the voice-or-text
  choice is presented explicitly, and flag the screen that delivers it as
  open."
- **`E05-F5`, superseded 2026-08-26:** "Move sign-out into profile options.
  Add avatar prominence as a design-led item."

## Cross-references, the four Eric records

Reconcile, do not merge; each of these does something the other three do not.

- `knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`. The emailed
  written record. What Eric wants, screen by screen, in his own numbering.
- `knowledge/client-feedback/2026-08-25-eric-spoken-feedback.md`. The call.
  Why he wants it. Reasoning only, cites C-keys rather than restating
  requests.
- `tracking/eric-poc-change-requests-2026-08-25.md` (this file). The single
  enumerated change list, C01 to C26. The one place a request is counted.
- `tracking/jira-updates-2026-08-25-eric-feedback.md`. The Jira-shaped
  paste-ready excerpt, keyed to SCRIBL issue numbers, and, as of 2026-08-26,
  the canonical home for Jira draft text.
