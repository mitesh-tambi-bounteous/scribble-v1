---
title: Roadmap
project: scribl
type: mobile-app-poc
target: POC
current_phase: B2
updated: 2026-08-31
---

# Roadmap -- scribl

The route from front-end intake through a demo-able POC of the Scribl
daily-creative-practice app. The POC is a thin slice of the production target
(single Expo / React Native codebase, thin AWS API Gateway + Lambda + DynamoDB
via CDK, web via expo export to S3/CloudFront). It seeds production; it is not a
throwaway. Milestone status is tracked in the table below and on the board.

> **This board tracks the POC, not the production rebuild.** The S-numbered
> cards below are the clickable prototype in the `scribl-app` repository. The
> production build's work lives on the SCRIBL Jira board and is planned in
> [Backlog: epics and features](/backlog-epics); the E-numbered epics and
> features there are the eight-week delivery. The two are separate layers, not
> two versions of the same list. See [Status](/status) for where each stands.

## Where we stand

The POC route below is complete through the screen buildout, the web deploy and
the client walkthrough, and the POC is in maintenance as of 2026-08-28. Per-
milestone detail, with sources, is on [Status](/status).

Two things on this page are superseded for the production build and are left
here because they are an accurate record of the POC's own architecture. The thin
API Gateway plus Lambda plus DynamoDB backend described below is the POC's, not
the production target: the production API is a long-running containerized
service on ECS Fargate over Aurora Serverless v2, per
[the decision register](/handbook/engineering/decision-register) entries 2.1 to
2.3. And the POC does not seed production code; the production build is
greenfield, per register entry 1.1.

## Phase A: front-end intake (Gate 2)

Presales through ratified architecture. Closes when the architecture and
machine-checkable AC are approved and locked.

- [x] M1 -- Intake complete. Presales -> sales -> intake -> deep research. Scope,
  MVP/MLP, and the research dossier captured.
- [x] M2 -- Architecture locked (Gate 2). Ratified ADRs, architecture spec, and
  machine-checkable AC for both the POC thin slice and the production target it
  seeds; provider-abstraction layer and model tiering recorded.

## Phase B: POC factory (Gate 3)

Stand up the harness, build the daily loop, verify, optionally deploy, and demo.
The POC build is run from the board.

- [x] M3 -- Harness ready. POC harness generated: CLAUDE.md guardrails, agents,
  Expo OSS knowledge skills (no EAS), and the locked stack pinned; Plan Mode and
  the OSS-only / no-Expo-cloud rules enforced.
- [x] M4 -- Loop built. Prompt-of-the-day -> draw/text -> submit-to-unlock ->
  channel wall + reactions -> streak, on a single codebase with web + device
  parity and a Claude provider adapter. The daily loop shipped and merged to
  MobileApp main.
- [x] M4.5 -- Screens built. Full screen + navigation buildout per the design flow:
  every screen exists as a route, nav connects the flow end to end on web, hero
  screens (splash, family grid, response detail) design faithful. Reconciled
  2026-09-02 against `tracking/status.md`, which had this marked Done; this
  checklist was left unchecked after the fact.
- [ ] M5 -- POC verified. Runs on web AND at least one device/simulator; drawing
  smooth on-device; submit-to-unlock actually gates the feed. Not recorded: no
  verification report exists; the 2026-08-25 client walkthrough under M7 stood
  in for it.
- [x] M6 -- POC deployed (optional). Done for web: deployed to a hosted Vercel
  preview under the Bounteous organisation (`docs/deploying.md` in the POC
  repository), not S3/CloudFront as originally planned here. Local iOS
  Simulator build verified and an Android debug APK produced; neither is
  automated.
- [x] M7 -- POC demo (Gate 3). Done. Walked with the client at the 2026-08-25
  prioritization workshop, which produced the change-request set and the
  screen feedback. Closes the route to POC.

## Phase H: handoff

Carry POC learnings into the production backlog and dev harness. Out of the POC
critical path; listed for continuity.

- [x] M8 -- POC to backlog. Done: [Backlog: epics and features](/backlog-epics)
  is the plan of record, produced as a 4-sprint plan
  (`tracking/production-sprint-backlog.md` plus the `expo-rebuild-epics.md`
  dataset); SCRIBL Jira import pending does not block this milestone.
- [ ] M9 -- Dev-harness handoff. Dev-harness generated and handed to the delivery
  team. In progress: Rob Forshier II started laying down the production harness
  2026-08-28.

## Milestones

| Milestone | Phase | Status |
|-----------|-------|--------|
| M1 Intake complete | A | Done |
| M2 Architecture locked | A (Gate 2) | Done |
| M3 Harness ready | B | Done |
| M4 Loop built | B | Done |
| M4.5 Screens built | B | Done |
| M5 POC verified | B | Not recorded. No verification report exists; the 2026-08-25 client walkthrough under M7 stood in for it |
| M6 POC deployed (optional) | B | Done for web (hosted Vercel preview, `docs/deploying.md` in the POC repository). Local iOS Simulator build verified and an Android debug APK produced; neither is automated |
| M7 POC demo | B (Gate 3) | Done. Walked with the client at the 2026-08-25 prioritization workshop |
| M8 POC to production backlog | H | Done. Backlog: epics and features is the plan of record (production backlog produced as a 4-sprint plan: tracking/production-sprint-backlog.md plus the expo-rebuild-epics dataset); SCRIBL Jira import pending does not block this milestone |
| M9 Dev-harness handoff | H | In progress. Rob Forshier II started laying down the production harness 2026-08-28 |
