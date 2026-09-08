---
title: Wiki IA execution review
date: 2026-08-24
status: final
type: review
---

# Wiki IA execution review

End-of-stage review for the wiki IA revamp (PR #38), which executed P1 of the
2026-08-24 wiki IA audit: the render cuts, the client-visibility scrub, the
generator fixes, and the sidebar restructure.

## What went well

- The audit's step ordering held. Doing the cuts before any sync kept the
  audit itself from ever rendering, exactly the hazard its step 0 predicted.
- Every step ended with sync, build, and the test suites, so no red state ever
  reached a commit. The dead-link gate (`ignoreDeadLinks: false`) caught one
  inbound link the audit's link graph missed
  (`decisions/0001-react-native-primary.md` linking the cut team-model page).
- A fresh-context compliance walk over the finished diff found a real gap the
  implementers could not see: `open-questions.md` Q23 publishes two client
  addresses. Reviewing the diff as a stranger's work earned its cost.

## What took too long or went sideways

- The audit's step 2 exclude enumeration omits the three internal meeting
  digests, while its own link-fix sentence and section 1 assume they are cut.
  Executing required reading three sections against each other. Audits should
  carry one canonical cut list.
- The audit named links on `docs/onboarding.md` (board-selection, SOW extract)
  that do not exist at the commit it audited. Harmless, but every phantom item
  costs a verification pass.

## Playbook changes worth carrying

- De-navving is not cutting. VitePress serves every file under `docs/`, so a
  client boundary needs the generator exclude list plus `git rm`, verified
  against the on-disk tree, never against the sidebar config.
- Era matters as much as visibility. The audit hoisted the ADRs into a live
  architecture group; Rob overruled it in review because all eleven ADRs are
  POC-era and read as current MVP decisions the moment the sidebar promotes
  them. The live register is `open-questions.md`. When a wiki spans project
  eras, sidebar placement is an era claim, not just navigation.
- Generated trees need the sync script asserted loudly (one landing page per
  tree root) rather than conventions remembered. The both-index-and-README
  case now fails at sync time instead of orphaning a page silently.

## Still open after this stage

- Audit P2: the merges (status, jira-board, media stubs, team-process,
  kit-readme, workshop review), the remaining era banners, the
  future-architecture-aws slim-down, and rehoming onboarding and
  open-questions.
- Audit step 7 (Rob's call): splitting a client-facing extract out of
  open-questions. Sharpened by the Q23 find: the page the nav promotes to the
  client still carries client staff emails and staffing-gap prose.
