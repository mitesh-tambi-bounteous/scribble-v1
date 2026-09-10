#!/usr/bin/env node
// test-preflight.mjs -- proves runPreflight's checks: dup-in-file,
// dup-against-existing, the loud existing-not-checked warning, the EARS
// accept/reject table, and missing-verification.
//
// No test framework: bounded checks, failure counter, non-zero exit on failure.

import assert from 'node:assert/strict'
import { makeIssue } from './lib/model.mjs'
import { runPreflight } from './lib/preflight.mjs'

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

function baseIssue(overrides) {
  return makeIssue({
    kind: 'story',
    summary: 'E01-F1 A feature',
    description: 'Plain description.',
    source: { file: 'f.md', line: 5 },
    ...overrides,
  })
}

function parseResultOf(issues, problems = []) {
  return { format: 'backlog', epicName: 'E01', issues, problems }
}

check('no-issues fires an error on an empty issue list', () => {
  const result = runPreflight(parseResultOf([]), { existingSummaries: [] })
  const p = result.problems.find((x) => x.rule === 'no-issues')
  assert.ok(p, 'expected no-issues problem')
  assert.equal(p.severity, 'error')
})

check('duplicate-summary-in-file names both lines', () => {
  const a = baseIssue({ summary: 'Same Summary', source: { file: 'f.md', line: 5 } })
  const b = baseIssue({ summary: 'same summary', source: { file: 'f.md', line: 9 } })
  const result = runPreflight(parseResultOf([a, b]), { existingSummaries: [] })
  const p = result.problems.find((x) => x.rule === 'duplicate-summary-in-file')
  assert.ok(p, 'expected duplicate-summary-in-file problem')
  assert.equal(p.severity, 'error')
  assert.ok(p.message.includes('5'))
  assert.ok(p.message.includes('9'))
})

check('duplicate-summary-existing fires against existingSummaries', () => {
  const a = baseIssue({ summary: 'Collides With Jira', source: { file: 'f.md', line: 5 } })
  const result = runPreflight(parseResultOf([a]), {
    existingSummaries: ['collides with jira'],
  })
  const p = result.problems.find((x) => x.rule === 'duplicate-summary-existing')
  assert.ok(p, 'expected duplicate-summary-existing problem')
  assert.equal(p.severity, 'error')
})

check('existing-not-checked warning fires when existingSummaries is undefined', () => {
  const a = baseIssue({})
  const result = runPreflight(parseResultOf([a]), {})
  const p = result.problems.find((x) => x.rule === 'existing-not-checked')
  assert.ok(p, 'expected existing-not-checked warning')
  assert.equal(p.severity, 'warning')
})

check('existing-not-checked warning does not fire when existingSummaries is an array', () => {
  const a = baseIssue({})
  const result = runPreflight(parseResultOf([a]), { existingSummaries: [] })
  const p = result.problems.find((x) => x.rule === 'existing-not-checked')
  assert.equal(p, undefined)
})

// EARS accept/reject table: at least 6 accepts across the five forms, 4 rejects.
const earsAccepts = [
  'When the user taps submit, the app shall save the draft',
  'If the network is unavailable, the client shall queue the request',
  'While the upload is in progress, the button shall stay disabled',
  'Where offline mode is enabled, the sync shall be deferred',
  'The system shall log the event',
  'WHEN the timer expires, the widget SHALL reset',
]
const earsRejects = [
  'works correctly',
  'When clicked it works',
  'The button does the thing',
  'It should probably handle errors somehow',
]

check('EARS accept table: all forms pass with a verification', () => {
  const issue = baseIssue({
    ac: earsAccepts.map((text, i) => ({ text, verification: 'manual check', line: 10 + i })),
  })
  const result = runPreflight(parseResultOf([issue]), { existingSummaries: [] })
  const earsProblems = result.problems.filter((x) => x.rule === 'ears-form')
  assert.equal(earsProblems.length, 0, `unexpected ears-form problems: ${JSON.stringify(earsProblems)}`)
})

check('EARS reject table: all four non-conforming criteria flagged', () => {
  const issue = baseIssue({
    ac: earsRejects.map((text, i) => ({ text, verification: 'manual check', line: 20 + i })),
  })
  const result = runPreflight(parseResultOf([issue]), { existingSummaries: [] })
  const earsProblems = result.problems.filter((x) => x.rule === 'ears-form')
  assert.equal(earsProblems.length, earsRejects.length)
  for (const p of earsProblems) {
    assert.equal(p.severity, 'error')
  }
})

check('missing-verification fires for an ac entry with verification null', () => {
  const issue = baseIssue({
    ac: [{ text: 'The system shall do the thing', verification: null, line: 30 }],
  })
  const result = runPreflight(parseResultOf([issue]), { existingSummaries: [] })
  const p = result.problems.find((x) => x.rule === 'missing-verification')
  assert.ok(p, 'expected missing-verification problem')
  assert.equal(p.severity, 'error')
})

check('backlog items with no ac entries pass EARS and verification vacuously', () => {
  const issue = baseIssue({ ac: [] })
  const result = runPreflight(parseResultOf([issue]), { existingSummaries: [] })
  const earsProblems = result.problems.filter((x) => x.rule === 'ears-form' || x.rule === 'missing-verification')
  assert.equal(earsProblems.length, 0)
})

check('jira-not-checked warning fires with no config present', () => {
  const issue = baseIssue({})
  const result = runPreflight(parseResultOf([issue]), { existingSummaries: [] })
  const p = result.problems.find((x) => x.rule === 'jira-not-checked')
  assert.ok(p, 'expected jira-not-checked warning')
  assert.equal(p.severity, 'warning')
})

check('preflight passes iff no error-severity problems, and sorts by file/line', () => {
  const a = baseIssue({ source: { file: 'f.md', line: 20 } })
  const b = baseIssue({ summary: 'Different summary', source: { file: 'f.md', line: 5 } })
  const parsed = { format: 'v3', epicName: 'E', issues: [a, b], problems: [] }
  const result = runPreflight(parsed, { existingSummaries: [] })
  const errorCount = result.problems.filter((p) => p.severity === 'error').length
  assert.equal(errorCount, 0)
  for (let i = 1; i < result.problems.length; i += 1) {
    const prev = result.problems[i - 1]
    const cur = result.problems[i]
    const orderOk = prev.file < cur.file || (prev.file === cur.file && prev.line <= cur.line)
    assert.ok(orderOk, `problems not sorted by file/line at index ${i}`)
  }
})

check('parser-emitted problems flow through unchanged', () => {
  const a = baseIssue({})
  const priorProblem = { severity: 'warning', rule: 'dash-normalized', message: 'x', file: 'f.md', line: 1 }
  const parsed = { format: 'v3', epicName: 'E', issues: [a], problems: [priorProblem] }
  const result = runPreflight(parsed, { existingSummaries: [] })
  const found = result.problems.find((p) => p.rule === 'dash-normalized')
  assert.ok(found, 'expected the prior parser problem to flow through')
})

check('runPreflight does not mutate the input parseResult.problems array', () => {
  const a = baseIssue({})
  const originalProblems = []
  const parsed = { format: 'v3', epicName: 'E', issues: [a], problems: originalProblems }
  runPreflight(parsed, { existingSummaries: [] })
  assert.equal(originalProblems.length, 0)
})

if (failures > 0) {
  process.stderr.write(`\ntest-preflight: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-preflight: all assertions passed\n')
process.exit(0)
