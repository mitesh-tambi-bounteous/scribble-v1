---
title: "Jira write policy, what changed on 2026-09-04"
project: scribl
type: review
updated: 2026-09-04
---

# Jira write policy, what changed on 2026-09-04

If you asked an agent to comment on or edit a SCRIBL story in the last two
weeks and got a refusal plus an in-repo markdown draft, this is why, and it no
longer happens. It hit live on SCRIBL-31 and earlier on SCRIBL-28.

## What was wrong

`CLAUDE.md` refused all of it to agents, creates and edits and transitions
alike, and routed the filing phase through one person's approval. That rule
was written when the risk was an agent filing 40 half-formed stories into a
live board. It was right about the risk and wrong about the remedy: it made
one person the gate on every Jira change, which is the opposite of what the
next few weeks need. The production backlog came out of a prototype and is
rough. Productionizing it means reworking epics and features, writing real
user stories, and keeping this repo in step, and the team cannot do that
through a queue with one approver in it.

## What is allowed now

All of it. Comment, edit, create, transition, by the team or by an agent
working on the team's behalf. No operation waits on anyone's approval. Work
the board.

Two practices survive, and neither is a permission gate:

- Bulk creation goes through the filing pipeline, preflight and dry run
  first. Whoever runs it reads the dry run and decides. David Lawton's
  original reason still holds, verbatim: "because when it was working
  directly in JIRA, it just created noise everywhere." That argues for a dry
  run, not for a gatekeeper.
- Editing a description replaces the whole body over the API. Prefer a
  comment. When you do edit, read the current body first and send it back
  whole with your change applied, because a retype from memory quietly
  mangles the acceptance criteria.

## Check your Jira connection first

Access comes from whatever you are using: the Atlassian MCP server, the Jira
connector in the Claude desktop app, or `JIRA_*` in the environment for the
filing scripts. An agent confirms it rather than assuming it, by calling
`getAccessibleAtlassianResources` and looking for a site carrying
`write:jira-work`, or by checking the four `JIRA_*` variables.

With no connection you get told up front, in the first reply, that only the
meta repo can change, and asked whether to make the repo-side changes alone.
Say no and nothing changes. What you should never see is a confident report of
a Jira write that never landed.

## The pairing rule, which is the actual one rule now

A Jira write is half the job. Whatever this repo also records about that issue
moves in the same session and the same commit: the story file under
`tracking/stories/`, the card in `tracking/board.md`, and a row in
[tracking/jira-mirror.md](../tracking/jira-mirror.md). If nothing in the repo
covers what you changed, the mirror row alone is enough. A Jira write that
leaves the repo saying something else is an incomplete operation. The wiki
drifting from the board is the one failure this hub exists to prevent.

`tracking/jira-mirror.md` holds the issue table, the command that regenerates
it and diffs it against Jira, and the append-only write log.

## Two limits, so nobody is surprised

The write log is not machine checked. Nothing diffs it against each issue's
comment list and changelog, so a write that never got a row leaves no trace.
The issue table is the half that regenerates and diffs on demand, and that is
the half to lean on.

The curl regenerate command was written from the current Jira Cloud API and
exercised through the Atlassian MCP read path, not from a shell, because the
session that wrote it held no `JIRA_*` credentials. First person to run it
with credentials should fix it in place if it misbehaves.

## What still needs a human, and it is not an approval

Nobody on the team can run the filing pipeline without `JIRA_BASE_URL`,
`JIRA_EMAIL`, `JIRA_API_TOKEN` and `JIRA_PROJECT_KEY`. Removing the approval
gate does not provision credentials. Anyone expected to file needs their own
API token and those four variables set, or they are blocked on access rather
than on policy, which looks the same from the inside and is not.

## Where the rule lives

`CLAUDE.md`, section "Work-item execution (story/AC kit)". One place. It used
to be stated in two, `CLAUDE.md` and the story-ac-kit index, which is why
tracking down the original refusal took three greps. The index now points at
`CLAUDE.md` rather than restating it. If you change the policy, change it
there and nowhere else.

## The friction worth remembering

A rule copied into a second file is a rule that will contradict itself. The
copy here was even labeled "stricter" than the original, so a reader could not
tell which one governed. When a convention needs restating in a second place,
point at the first place instead.

The other lesson is about the shape of the rule. The original gate was written
to prevent a specific accident and ended up shaped as "one person approves
everything," which survived long after the accident stopped being the main
risk. A safety practice that names an approver ages badly. A safety practice
that names a step, read the dry run, can be handed to anyone.
