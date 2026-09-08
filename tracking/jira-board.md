---
title: "Jira board (SCRIBL)"
project: scribl
type: reference
updated: 2026-07-27
---

# Jira board (SCRIBL)

scribl production stories live on the SCRIBL Jira board (project key SCRIBL,
board 13809):
https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog

This hub repo is the planning source and the backlog import source: the
epic/feature dataset in `tracking/expo-rebuild-epics.md` and the sprint-planned
view in `tracking/production-sprint-backlog.md` are what gets imported.

## Mapping conventions

- Each RE-xx MVP epic -> one SCRIBL Epic named `RE-xx <epic name>`. Future
  epics (RE-F1..F9) -> SCRIBL Epics labeled `future`, created at triage time,
  not before.
- Each story `P<s>-<nn>` -> one SCRIBL Story under its epic; summary = story
  title; description = intent + acceptance sketch.
- Labels: `sprint-1`..`sprint-4` for the MVP sprints, plus `mvp`, and a role
  label `role-ios` / `role-backend` / `role-qa` / `role-pm`; future work gets
  `future`.
- Every story carries an owning role (assignee = the owning role's person), so
  per-sprint capacity by role is visible on the board.
- Story points = the Fibonacci placeholders from the sprint backlog (team
  sizing inputs, not commitments).

## Sync-back rule

Once SCRIBL keys exist, record SCRIBL-nnn back into
`tracking/expo-rebuild-epics.md` and the sprint backlog so hub docs and Jira
never drift.

## Mirror

The repo's mirror of SCRIBL issue state is [Jira mirror](/jira-mirror):
the regenerated issue table, the command that regenerates it, and the
append-only log of every Jira write an agent has made. Jira is the system of
record; that file is the copy. Agents may comment on, edit, create, and
transition issues, and every such write is mirrored there and committed in
the same session (`CLAUDE.md`, section "Work-item execution (story/AC kit)").

## The queued filing draft

`tracking/jira-filing-draft-2026-09-02.md` holds 146 queued operations, 72
updates to issues that already exist and 74 creates. All 146 are fair game
for the team under the current write policy; nobody has run either half yet.

- The 72 updates can run against existing SCRIBL issues, mirroring each into
  [Jira mirror](/jira-mirror) and committing in the same session.
- The 74 creates go through the filing pipeline's preflight and dry run
  (`handbook/story-ac-kit/jira-filing-pipeline.md`) rather than one-by-one API
  calls, then get filed the same way: mirrored and committed in the same
  session as each create.

## Scope notes

- POC stories S-001..S-023 are POC-only and are NOT imported to SCRIBL; they
  stay on the hub board.
- The scribl-app code repo is being wired to SCRIBL separately.
