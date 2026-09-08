---
title: "backlog mini fixture"
---

# GREEN band

## E01 Cloud foundation and app shell

`id: E01 | band: GREEN | board item: "Cloud foundation" | discipline: Backend and AWS | jira: APP Epic`

Foundation epic for the sync test fixture, kept intentionally small.

**E01-F1 AWS accounts and three environments**
`parent: E01 | band: GREEN | discipline: AWS | depends on: none | blocked by: Q17, Q49 | status: Blocked | size: 2 backend-days | carries forward: RE-13`

Stand up the three AWS accounts and wire CI/CD across them.

**E01-F2 CDK stack skeleton**
`parent: E01 | band: GREEN | discipline: AWS | depends on: E01-F1 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-13`

The reusable CDK constructs the rest of the stack builds on.

## E02 Auth and onboarding

`id: E02 | band: ORANGE (addition, not on the board) | discipline: iOS, Backend and Product | jira: APP Epic, label future`

Auth epic for the sync test fixture.

**E02-F1 Email and password accounts**
`parent: E02 | band: ORANGE | discipline: Backend | depends on: E01-F2 | blocked by: none | status: Next | size: 3 backend-days | carries forward: RE-02`

Standard email and password signup with verification.

**E02-F2 Session refresh**
`parent: E02 | band: ORANGE | discipline: Backend | depends on: none | blocked by: none | status: Next | size: not sized | carries forward: none`

Refresh token rotation for long-lived sessions.
