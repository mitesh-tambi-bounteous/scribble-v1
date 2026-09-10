---
title: "Eric Rice's spoken feedback on the POC, 2026-08-25"
project: scribl
type: client-feedback
status: standalone companion by design, reconciled against the written record
updated: 2026-08-26
source: knowledge/meetings/raw/2026-08-25-scribl-shape-kickoff.vtt
---

# Eric Rice's spoken feedback on the POC, 2026-08-25

## Why this is a standalone file

Note, 2026-08-26: this section originally said the written record was not on
`origin/main`, that there was no `knowledge/client-feedback/` directory at
all, and that the two files should be merged once the written record landed.
All three are now false. The written record is on main, beside this file, at
`knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`. The premise
below was written before that landed; kept here for the history, superseded
by this note.

This file stays separate from the written record on purpose, per the
reconciliation rule for the 2026-08-25 feedback pass: reconcile, do not
merge. The written record says what Eric wants, screen by screen, in his own
numbering. This file says why, and the why is what survives a design argument
three weeks from now. Collapsing them into one file would bury the reasoning
inside the requests, which is the thing the reconciliation rule exists to
avoid.

What is deliberately not here: the change requests themselves. Every change Eric
asked for is enumerated once, in
`tracking/eric-poc-change-requests-2026-08-25.md`, keyed
C01 to C26. This file carries the reasoning behind them and nothing else, and it
cites those keys rather than restating them.

## The four Eric records, and what each is for

This file is one of four records from the 2026-08-25 feedback pass. Each does
a job the others do not.

- `knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`. The emailed
  written record. What Eric wants, screen by screen, in his own numbering.
- `knowledge/client-feedback/2026-08-25-eric-spoken-feedback.md` (this file).
  The call. Why he wants it. Reasoning only, cites C-keys rather than
  restating requests.
- `tracking/eric-poc-change-requests-2026-08-25.md`. The single enumerated
  change list, C01 to C26. The one place a request is counted.
- `tracking/jira-updates-2026-08-25-eric-feedback.md`. The Jira-shaped
  paste-ready excerpt, keyed to SCRIBL issue numbers.

Source: the Scribl Shape Kickoff, 2026-08-25, 12:00 to 13:00 CDT. Timestamps are
into the recording. Digest at [the kickoff digest](../meetings/2026-08-25-scribl-shape-kickoff.md).

## The reasoning behind each written point

### The canvas, and the eight colours

The written feedback fixes eight colours. Spoken, Eric put a target behind them
that the written version does not carry, and it is an acceptance bar rather than
a preference.

> "we are in love with that canvas and that drawing, the feeling behind it. It
> almost feels like you're pushing paint around. It's like it's got a very
> finger paint feeling to it. I'm not sure exactly what it is. It's the size of
> the brush or, you know, just a few options, but we get a lot of positive
> feedback on that. So we want to mimic that as close as possible."
> (Eric Rice, 00:21:10)

He then unpacked "as close as possible" into four named things: "that single
brush size, those eight colors, keeping the undo button, which goes back a single
step, and then possibly adding an erase button" (00:21:33). So the written
eight-colour decision and the single brush are not two decisions. They are one
decision about feel, and the feel of the B2B game is the specification.

The consequence for the build is that the canvas is done when it feels like the
B2B game on a phone, not when it has eight swatches. That is a harder acceptance
criterion and a better one. See C02, C04, C21.

**Brush width, decided 2026-08-26.** One brush, one width, no size picker.
The width is the second from the right of the four sizes on the client's own
canvas picture. That is Eric's pick, "second from the right" (00:25:15,
restated 00:26:04). Do not read a pixel number off this record:
`code-questions.md` Q2 records the four-size row as `[18, 12, 5, 2]`, largest
to smallest, but the client's picture's ordering is not verified in any
record held here, so the width is
"second from the right of the four on the client's canvas frame, to be read
off the frame rather than guessed."

Matthew Kaplan's dissent stays on the record, in full and unsoftened. He was
holding a phone. He said the largest was "massive" and that "The smallest
line on Rob's app on my phone is closest to the scribble game today"
(00:25:23), then "I think that is either one, either that third one or 4th
one to the right is probably close... I would say that third one is probably
mimics mostly what we have today. So I would go with that one for the MVP."
(00:25:52). Eric's reply was conditional and not a handover: "if you're on
the phone and you think it needs to be smaller, then yeah, go for it."
(00:25:49). The dissent was never withdrawn.

The shipped scribl-app code currently carries the client's own B2B width
instead of Eric's pick, so a code change is outstanding. That is a code-repo
change, not something this run makes.

**Where the spoken record amends the written one.** White. The written feedback
fixes eight colours. On the call Eric asked for white as a ninth, explicitly
provisionally, because white and an eraser do the same job:

> "I think you know white and race would be interchangeable. Let us, we'd
> probably just have you add a white option. Let us talk about it a little bit
> more. There seems to be some differences of opinion."
> (Eric Rice, 00:27:17)

Nine swatches is not what the written record says. Do not silently reconcile
this; it is a live disagreement inside Scribl and Eric said so. See C11, C20.

### The eraser and the trash button

Both are written-record additions. The spoken reasoning is where the user
evidence lives, and it is the reason to keep the trash button and hold the
eraser.

Eraser, and why it is not just undo:

> "possibly adding an erase button, which we had a lot of requests for where
> people don't want to undo something, but they want to get rid of a small part
> of something. And that would also double up as essentially white paint, which
> people could do over."
> (Eric Rice, 00:21:33)

Trash, and the specific incident behind the confirmation dialog:

> "instead of hitting the undo button 50 times, they can clear the screen or
> clear, you know, shake the etch sketch. But we would definitely want some sort
> of pop-up confirmation so that people didn't do it by accident. Because Abby
> actually mentioned that a few times using the POC, she cleared her entire
> drawing out by just clicking the wrong button."
> (Eric Rice, 00:22:14 to 00:22:35)

That last sentence is the most useful thing in the call for the canvas. It is a
named person losing a finished drawing in this POC, which makes the confirmation
dialog a defect fix rather than a feature request.

Matthew Kaplan pushed back on both, on the grounds that there is no user input
justifying them and that more buttons make people chase perfection (00:23:05 to
00:23:28). Eric did not concede and did not win: "Yeah, we can talk, what we
talk about internally, now's not really the time." (00:23:38). So the written
record's eraser is not a decision. Its trash button is Eric's decision over
Matthew's objection.

### The bounding box

Written as a layout note. Spoken, it is a user-confusion report:

> "the other question I kept getting is about the bounding box in the canvas
> itself. So we have a very defined one in the B2B game. I think it might just
> be a function of the background. And so having a very clear bounding box so
> people know exactly where they want to draw."
> (Eric Rice, 00:23:45 to 00:23:57)

"the other question I kept getting" is the point. People asked him where they
were allowed to draw. See C06.

### The sign-out button

The written record says move it. Spoken, Eric gave both the convention and the
failure mode:

> "Most of the time these days, I'm seeing logout buried kind of in your
> personal options. And is there ever really a reason for a person to log out?
> So having it up here by the avatar, we think might confuse or just have people,
> you know, log out accidentally."
> (Eric Rice, 00:28:21 to 00:28:36)

He also said he went and checked: "I could bounce around some of the apps that I
use and I noticed that it was, it's pretty much regulated to the, you know, the
profile options section now." (00:28:51). Note the second half of that turn is a
separate request, avatar prominence, which the written record may not carry at
all. See C01, C12.

### Onboarding, and the returning user

The written record covers the login screen. The spoken reasoning is a general
principle Eric stated twice and it should be treated as a standing constraint on
every onboarding screen, not a note about one:

> "We have to be like super implicit with this onboarding because we've learned
> a lot. It's that people just don't get stuff."
> (Eric Rice, 00:13:47)

He said it about the split voice-or-text screen, defending why it exists: "it was
to very blatantly show people you could do one or the other and you needed to
choose one." Rob had already removed that screen from the POC. Eric explained the
requirement and never ruled on the screen, which is why C24 is open rather than
closed. The requirement is that the choice is explicit. The screen is negotiable.

Separately, and cleanly closed: the returning-user onboarding screen goes on
mobile, because "you log in once until you log out" (00:20:08). Eric called the
current behaviour "a point of confusion". See C03.

### Sharing

The written record treats sharing as a screen. Spoken, Eric reframed the whole
product around it, and this is the single largest piece of reasoning in the call
that the written feedback cannot carry:

> "The more we talk about this with people, the more they realize, hey, this is
> actually a content creation platform and the ability for people to share this
> outwardly on their socials or via text or however is super, super important."
> (Eric Rice, 00:35:55)

That sentence changes how E12 should be read. Sharing is banded orange on the
backlog. The client's own framing puts it at the centre of the product. Somebody
should decide which of those two is right before sprint 1 planning, because the
answer changes the sprint 1 queue. My read is that the band is wrong and the
client is right, and the reason the band survived is that sharing had no epic at
all until the 2026-08-25 prioritization session.

The MVP floor is modest, so this is not an argument for building all of it: "At
the very minimum, a static image, maybe there's room for text" (00:37:37). What
is not negotiable in it is context, verbatim: "The prompt being featured is key
so that people have context." (00:36:17). See C13.

### The stroke data

This is the piece of reasoning most worth preserving, because the backlog
currently lists dropping it as a candidate cut.

> "Currently, the drawings are shared as individual lines, or they're stored as
> individual lines. So when people have taken a look at it, there's a lot we
> could do with this when it comes to animation or even like GIFs."
> (Eric Rice, 00:36:52)

> "when I go into Metabase and I pull up a particular file or a particular
> drawing, I can pull that code, those keystrokes, and if I throw that into like
> ChatGPT or whatever, it'll draw the image for me based on that. So I can
> reproduce the images. There was reasons they did that."
> (Eric Rice, 00:56:05)

> "there's so much you can do with this if you have that information from every,
> for every image."
> (Eric Rice, 00:56:34)

Eric's own worry was storage cost, and he was open about not knowing: "so we get
into a place where storing that becomes prohibitive? I'm not sure. I don't know
that the number is behind it" (00:56:34). Rob answered it on the call: a stroke
is a colour, a start and an end, so it is a vector store and small (00:56:57).
That exchange closes the only objection to the capability. See C14.

The POC does not currently do this. Rob found that out live: "I'm just recording
the final image at the end. I wasn't actually recording all the keystrokes."
(00:54:59). It cannot be added retroactively to art already submitted, which is
what makes it urgent rather than merely wanted.

### Challenges

The written record and the backlog both had challenges out. Rob had removed them
from the POC on that basis. Eric wants them back, trimmed:

> "I love the challenges. I've been trying to push stuff like that for like 5
> years since this was a card game."
> (Eric Rice, 00:32:59)

> "I think for the MVP, we want to stick to just injecting a new prompt."
> (Eric Rice, 00:33:20)

The trigger he described is a person, not a schedule: "maybe the mom who started
the wall goes to the family game pack and picks a couple to do" (00:33:42). That
is a wall-creator action on the wall, which is a different feature from the
curated daily prompt, and E03 does not cover it. See C15.

### The artifact

Eric's framing is that the manual version is worth shipping on its own, and he
was careful to say it is not a stepping stone:

> "Is it possible to, you know, long press a few of the pieces of art, have them
> pop up similar to stickers, and then you can resize, rotate, and arrange them
> manually to create something? And is that a precursor to actually having Claude
> do that?"
> (Eric Rice, 00:40:03)

Rob's answer was no, they are two separate things (00:40:30). Eric accepted it
and downgraded his own question to an idea (00:41:00). He then put the whole
thing outside the eight weeks himself: "we realized that this could be a ways
out, phase two, three, 4, whatever, but we just wanted to put it out there."
(00:45:00).

The cost reasoning behind it is the part to keep, because it is a monetization
requirement disguised as a technical one: "if someone's making 100 of them a
week, we'll be in trouble. So is there a token system or something that we can,
you know, start putting forward." (00:41:20). See C16, C19.

### The missed-day reveal

The written record may treat submit-to-unlock as settled. Spoken, the rule for a
missed day is wide open, and Eric raised it as a real family case rather than an
edge case:

> "one of the things we talked about was, you know, doing that day's prompt
> unlocks that section of the wall, lets you see things. And she goes, well,
> what if your mom missed a day and your nieces didn't?"
> (Eric Rice, 00:29:35)

> "Do we unlock everything the next day? Is that a premium feature? Do we let
> people go back and do previous day's prompts if they have a paid account? I
> think it's something we'd have to think about once we get into monetization."
> (Eric Rice, 00:30:11)

Matthew argued the opposite position on habit-formation grounds, with the Wordle
comparison (00:31:42). Eric closed it as open: "I think the functionality,
whatever we might want it to be, is there. We just need to figure out the exact,
you know, rule set for it." (00:32:44). See C22.

### Design ownership

The written record and the open-questions page both ask which screens Christina
Strachoff designs. Eric named them out loud, twice, and this closes Q15:

> "I identified those three or four screens there that we would probably have
> her work out, being the intro screen, the home screen, and then whatever the
> shareable is for the single story, which might also carry over the artifact.
> I think if we were able to get those three or four screens from her, they're
> probably the key ones for me. And then anything else can kind of trickle down
> from there using your methods."
> (Eric Rice, 00:07:13 to 00:07:32)

He confirmed the home screen as her second (00:28:51) and the share card as her
third (00:36:17). Everything else is Rob replicating her theme. Eric or Alex
cover the rest. On animation he leaned static and took the question away:
"I might just be static to start. I'll talk to her about that today." (00:20:50).
See C25.

## What the written record gained, reconciliation status as of 2026-08-26

This list was originally written as a pending ask for when the written record
landed. The written record is on main now, at
`knowledge/client-feedback/2026-08-25-eric-screen-feedback.md`, so this is a
record of what actually landed there, not a to-do.

1. The B2B canvas feel as the acceptance bar for the whole canvas, not a
   comment on the palette. Not verified against the written record's current
   text from this run; not carried by the edits made in this pass.
2. White as a provisional ninth swatch, marked as contested inside Scribl,
   which amends the eight-colour line. Landed 2026-08-25 in this run: the
   written record's "05 Canvas / Decided" section now carries the ninth
   swatch, marked provisional, superseding the eight-colour line without
   deleting it, and ties the eraser (C20) to it as still not decided.
3. The trash confirmation as a defect fix, with the incident behind it.
   Landed 2026-08-26 in this run: the written record's "05 Canvas / Decided"
   section now carries the trash button as settled and wanted, with the Abby
   incident and Matthew Kaplan's unsoftened objection next to the decision.
4. The eraser demoted from a request to a Scribl-internal open question. Not
   verified against the written record's current text from this run; the
   written record never listed the eraser as an open item to demote, but the
   swatch note added in this pass (item 2 above) states the eraser is still
   not decided.
5. "We have to be like super implicit with this onboarding" as a standing
   constraint on every onboarding screen. Not carried by the edits made in
   this pass; out of scope for this run.
6. Sharing reframed as content creation, which puts its orange band in
   question. Not carried by the edits made in this pass; out of scope for
   this run.
7. The stroke-storage reasoning, and the fact that the POC does not do it
   yet. Not carried by the edits made in this pass; out of scope for this
   run.
8. Challenges back in, trimmed to prompt injection, triggered by a wall
   member. Not carried by the edits made in this pass; out of scope for this
   run.
9. The missed-day rule as open, with both client positions recorded. Not
   carried by the edits made in this pass; out of scope for this run.
10. Christina's three screens named, which closes Q15 on the open-questions
    page. Not carried by the edits made in this pass; out of scope for this
    run.

Items 2 and 3 above map onto this run's D2 and D4 work in the written record.
The bounding box and sign-out settlements (also D4, this run) landed in the
written record's "05 Canvas / Decided" and "13 Home / Decided" sections
respectively, and the brush-width decision (D3, this run) landed above in
this file rather than in the written record, per that decision's own scope.
Items 1, 4 to 10 remain open asks against the written record; nothing in this
run's brief covered them, so their status here is "not done", not "done" and
not "verified absent".
