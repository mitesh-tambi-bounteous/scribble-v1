# Phase-1 Canvas hardening

#### Wall load performance [Canvas]

**Priority:** P0 -- Blocker | **Points:** 3 | **Sprint:** 1

**As a** wall member, **I want** the wall to load quickly, **so that** I can start drawing without waiting.

**Acceptance Criteria:**
- [ ] When the wall screen opens, the system shall render the first tile grid within 500ms.
  Verification: automated perf test wall-load-500ms
- [ ] If the tile cache is cold, the system shall show a skeleton grid within 100ms.
  Verification: manual QA on cold-start device

---

#### Prompt draft review queue [Prompts]

**Priority:** P1 -- High | **Points:** 5 | **Sprint:** 1

**Dependencies:** APP-1 (drafting flow must exist first)

**As a** prompt editor, **I want** to review Claude-drafted prompts, **so that** only curated prompts reach the daily loop.

**Acceptance Criteria:**
- [ ] While a draft is pending review, the system shall block that draft from publishing.
  Verification: integration test prompt-review-block
- [ ] The editor queue shall list drafts oldest first.
  Verification: manual QA on queue ordering

---

#### Canvas brush restriction seam [Canvas]

**Priority:** P2 -- Medium | **Points:** 2 | **Sprint:** 2

**As a** wall owner, **I want** each wall to configure its own allowed brushes, **so that** future wall types can restrict tools without code changes.

**Acceptance Criteria:**
- [ ] Where a wall defines allowedBrushStyles, the system shall hide brushes not in that list.
  Verification: unit test brush-restriction-seam
- [ ] Where allowedColors is empty, the system shall fall back to the default palette.
  Verification: unit test brush-restriction-default
