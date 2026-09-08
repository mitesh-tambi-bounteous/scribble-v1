# Phase-1 Canvas hardening

#### Wall load performance [Canvas]

**Priority:** P0 -- Blocker | **Points:** 3 | **Sprint:** 1

**As a** wall member, **I want** the wall to load quickly, **so that** I can start drawing without waiting.

**Acceptance Criteria:**
- [ ] When the wall screen opens, the system shall render the first tile grid within 500ms.
  Verification: automated perf test wall-load-500ms

#### Prompt draft review queue [Prompts]

**Priority:** P1 -- High | **Points:** 5 | **Sprint:** 1

**As a** prompt editor, **I want** to review Claude-drafted prompts, **so that** only curated prompts reach the daily loop.

**Acceptance Criteria:**
- [ ] While a draft is pending review, the system shall block that draft from publishing.
  Verification: integration test prompt-review-block
