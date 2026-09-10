#!/usr/bin/env node
// test-internal-gate.mjs -- proves the internal-content gate refuses loudly
// (names file and line) and never strips or rewrites the text it scans.
//
// No test framework: bounded checks, failure counter, non-zero exit on failure.

import assert from 'node:assert/strict'
import fs from 'node:fs'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import { makeIssue } from './lib/model.mjs'
import { loadInternalPatterns, scanForInternalContent } from './lib/internal-gate.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const PATTERNS_PATH = path.join(__dirname, 'internal-patterns.json')

let failures = 0

function ok(label) {
  process.stdout.write(`ok: ${label}\n`)
}

function fail(label, detail) {
  failures += 1
  process.stderr.write(`FAIL: ${label}${detail ? ` -- ${detail}` : ''}\n`)
}

function check(label, fn) {
  try {
    fn()
    ok(label)
  } catch (e) {
    fail(label, String((e && e.message) || e))
  }
}

const patterns = loadInternalPatterns(PATTERNS_PATH)

check('loadInternalPatterns compiles markers and facts to RegExp', () => {
  assert.ok(Array.isArray(patterns.markers))
  assert.ok(Array.isArray(patterns.facts))
  assert.ok(patterns.markers[0].pattern instanceof RegExp)
  assert.ok(typeof patterns.markers[0].why === 'string')
})

check('loadInternalPatterns rejects an invalid regex loudly', () => {
  const badPath = path.join(__dirname, '__bad-patterns-tmp.json')
  fs.writeFileSync(badPath, JSON.stringify({
    markers: [{ pattern: '(unclosed', why: 'broken' }],
    facts: [],
  }))
  let threw = false
  try {
    loadInternalPatterns(badPath)
  } catch {
    threw = true
  } finally {
    fs.unlinkSync(badPath)
  }
  assert.equal(threw, true)
})

// A marker hit refuses, naming file and line.
check('marker hit refuses with file and line', () => {
  const issue = makeIssue({
    kind: 'story',
    summary: 'E01-F1 Some feature',
    description: 'This paragraph says do not send this to the client.',
    source: { file: 'fixture.md', line: 10 },
  })
  const rawText = [
    '# heading',
    '',
    '#### E01-F1 Some feature [Cat]',
    '',
    'This paragraph says do not send this to the client.',
    '',
  ].join('\n')
  const problems = scanForInternalContent({
    issues: [issue],
    rawText,
    fileName: 'fixture.md',
    patterns,
  })
  assert.equal(problems.length, 1)
  assert.equal(problems[0].severity, 'error')
  assert.equal(problems[0].rule, 'internal-content')
  assert.ok(problems[0].file === 'fixture.md')
  assert.ok(Number.isInteger(problems[0].line) && problems[0].line >= 1)
  assert.ok(problems[0].message.includes('fixture.md'))
  assert.ok(problems[0].message.includes(String(problems[0].line)))
})

// A fact hit refuses.
check('fact hit refuses', () => {
  const issue = makeIssue({
    kind: 'story',
    summary: 'E02-F1 Staffing note',
    description: 'Fictional draft mentions no second ios engineer on this account.',
    source: { file: 'fixture.md', line: 20 },
  })
  const rawText = [
    '#### E02-F1 Staffing note [Cat]',
    '',
    'Fictional draft mentions no second ios engineer on this account.',
    '',
  ].join('\n')
  const problems = scanForInternalContent({
    issues: [issue],
    rawText,
    fileName: 'fixture.md',
    patterns,
  })
  assert.equal(problems.length, 1)
  assert.equal(problems[0].rule, 'internal-content')
})

// Clean text passes.
check('clean text passes with zero problems', () => {
  const issue = makeIssue({
    kind: 'story',
    summary: 'E03-F1 Ordinary feature',
    description: 'A completely unremarkable description with no sensitive phrases.',
    source: { file: 'fixture.md', line: 30 },
  })
  const rawText = [
    '#### E03-F1 Ordinary feature [Cat]',
    '',
    'A completely unremarkable description with no sensitive phrases.',
    '',
  ].join('\n')
  const problems = scanForInternalContent({
    issues: [issue],
    rawText,
    fileName: 'fixture.md',
    patterns,
  })
  assert.equal(problems.length, 0)
})

// The match is against issue text only -- a marker in surrounding prose of
// rawText that is NOT part of any issue's filed text must not refuse.
check('marker outside filed issue text does not refuse', () => {
  const issue = makeIssue({
    kind: 'story',
    summary: 'E04-F1 Filed feature',
    description: 'This description is entirely clean.',
    source: { file: 'fixture.md', line: 45 },
  })
  const rawText = [
    '<!-- internal only: this whole planning note is not part of any issue -->',
    '',
    '#### E04-F1 Filed feature [Cat]',
    '',
    'This description is entirely clean.',
    '',
  ].join('\n')
  const problems = scanForInternalContent({
    issues: [issue],
    rawText,
    fileName: 'fixture.md',
    patterns,
  })
  assert.equal(problems.length, 0)
})

// Text is never modified: deep-equal issues before/after scanning.
check('scanning never mutates issue text', () => {
  const issue = makeIssue({
    kind: 'story',
    summary: 'E05-F1 Internal only feature',
    description: 'Marked internal only for now, do not file verbatim in real use.',
    source: { file: 'fixture.md', line: 60 },
  })
  const before = JSON.parse(JSON.stringify(issue))
  const rawText = [
    '#### E05-F1 Internal only feature [Cat]',
    '',
    'Marked internal only for now, do not file verbatim in real use.',
    '',
  ].join('\n')
  scanForInternalContent({ issues: [issue], rawText, fileName: 'fixture.md', patterns })
  assert.deepEqual(issue, before)
})

// ---------------------------------------------------------------------------
// Shape coverage: one positive and one near-miss negative per leak class.
// The negatives are ordinary technical prose that must stay filable.
// ---------------------------------------------------------------------------

// Scans a single synthetic issue and asserts the scanned text is untouched.
function scanText(text, line) {
  const summary = 'E99-F1 Synthetic feature'
  const issue = makeIssue({
    kind: 'story',
    summary,
    description: text,
    source: { file: 'shapes.md', line },
  })
  const rawText = ['#### E99-F1 Synthetic feature [Cat]', '', text, ''].join('\n')
  const rawBefore = rawText
  const issueBefore = JSON.parse(JSON.stringify(issue))
  const problems = scanForInternalContent({
    issues: [issue],
    rawText,
    fileName: 'shapes.md',
    patterns,
  })
  // Refusal, never redaction: nothing the gate scans may come back rewritten.
  assert.equal(rawText, rawBefore, 'rawText was modified by the scan')
  assert.deepEqual(issue, issueBefore, 'issue text was modified by the scan')
  assert.equal(issue.description, text, 'description was rewritten')
  return problems
}

// [class label, leaking text that must be caught, near-miss text that must not be]
const SHAPE_CASES = [
  [
    'class 1 named individual',
    'Kaplan owns this workstream and Pankaj reviews the output.',
    'The reviewer owns this workstream and the tech lead reviews the output.',
  ],
  [
    'class 2 name plus allocation',
    'Aggarwal is on this at 0.6 allocation and starts on day one.',
    'The iOS lane starts on day one once the design frames land.',
  ],
  [
    'class 2 capacity accounting unit',
    'This is roughly one person-week of work across two sprints.',
    'This is roughly one week of work across two sprints.',
  ],
  [
    'class 3 overruling the client',
    'Scribl asked for a custom picker, but we know a native sheet is best here.',
    'Scribl asked for a custom picker, so the design frames include one.',
  ],
  [
    'class 3 refusal posture',
    'If the estimate grows we will push back before committing.',
    'If the estimate grows the plan gets revisited before committing.',
  ],
  [
    'class 4 internal decision-process language',
    'Worth flagging that the decision belongs with the delivery lead.',
    'The open question is recorded as Q17 and closes in discovery.',
  ],
  [
    'class 4 opinion language',
    'We think Scribl should put the queue server-side rather than in the app.',
    'The queue is server-side rather than in the app, per ADR-0002.',
  ],
  [
    'class 5 client-budget framing',
    'Scribl has no infrastructure budget for this phase, so it is uncosted.',
    'Hosting for this phase is not yet allocated (Q49), which discovery closes.',
  ],
  [
    'class 5 margin and rate framing',
    'A 1.4x multiplier against the rate card wipes out the engagement margin.',
    'The card sits inside a 16pt margin with a 1.4x line height.',
  ],
  [
    'class 5 literal dollar amount',
    'The AWS line pushes hosting cost to $12,400 a month at full scale.',
    'The AWS line is roughly 60 percent of total cost of ownership at full scale.',
  ],
  [
    'class 6 staffing gap as risk',
    'There is no PM on this account and the QA lane is unfunded.',
    'The QA lane needs a documented owner before test cases are written.',
  ],
  [
    'class 6 bench depth',
    'The team is one of each discipline and already over capacity.',
    'Capacity planning for the event wall is the first job in this epic.',
  ],
  [
    'class 7 client-capability dig',
    'Scribl has never shipped a mobile app before.',
    'Scribl has not yet confirmed whether iPad is in scope (Q58).',
  ],
  [
    'class 8 internal-audience address',
    'Pulled from the internal-only file; cut before sharing with the client.',
    'Pulled from the walkthrough notes captured on 2026-08-20.',
  ],
  [
    'class 8 internal-document reference',
    'See the board exclusions list for what was dropped.',
    'See the roadmap for what was deferred to a later band.',
  ],
]

// The false-positive risk is not the near-misses above, which dodge each
// pattern's trigger substring. It is ordinary scribl prose that uses the
// trigger word in its everyday technical sense. Every one of these must file.
const ADVERSARIAL_NEGATIVES = [
  'Add a redaction step to the crash-log uploader so PII never leaves the device.',
  'The paywall shows the $4.99 monthly tier.',
  'There is no PM notification channel configured for the push service.',
  'We think the tab bar should animate.',
  'The recommendation is rendered from the recommendations API response.',
  'Worth flagging to the user with a toast when sync fails.',
  'Users can have a view on the feed they follow.',
  'Requests are shed when the queue is already over capacity.',
  'Apply a 2x multiplier to the retry backoff.',
  'Seed the fixture with a profile for Kumar and one for Yap.',
]

let adversarialLine = 900
for (const text of ADVERSARIAL_NEGATIVES) {
  const line = adversarialLine
  adversarialLine += 10
  check(`adversarial legitimate prose files: ${text}`, () => {
    const problems = scanText(text, line)
    assert.equal(
      problems.length,
      0,
      `false positive: ${problems.map((p) => p.message).join(' | ')}`
    )
  })
}

let shapeLine = 100
for (const [label, leaking, nearMiss] of SHAPE_CASES) {
  const line = shapeLine
  shapeLine += 10
  check(`${label}: leaking text refuses with file and line`, () => {
    const problems = scanText(leaking, line)
    assert.ok(problems.length >= 1, 'expected at least one refusal')
    for (const problem of problems) {
      assert.equal(problem.severity, 'error')
      assert.equal(problem.rule, 'internal-content')
      assert.equal(problem.file, 'shapes.md')
      assert.ok(Number.isInteger(problem.line) && problem.line >= 1)
      assert.ok(problem.message.includes('shapes.md'))
      assert.ok(problem.message.includes(String(problem.line)))
      assert.ok(problem.message.includes('refusing to file internal content'))
    }
  })
  check(`${label}: near-miss technical prose still files`, () => {
    const problems = scanText(nearMiss, line + 1)
    assert.equal(
      problems.length,
      0,
      `false positive: ${problems.map((p) => p.message).join(' | ')}`
    )
  })
}

if (failures > 0) {
  process.stderr.write(`\ntest-internal-gate: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-internal-gate: all assertions passed\n')
process.exit(0)
