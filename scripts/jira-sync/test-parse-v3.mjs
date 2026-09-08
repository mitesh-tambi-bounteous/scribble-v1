#!/usr/bin/env node
// test-parse-v3.mjs -- red-first test for lib/parse-v3.mjs and the v1-refusal
// path in lib/parse.mjs.
//
// No framework. Bounded checks, failure counter, non-zero exit on failure.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseV3 } from './lib/parse-v3.mjs'
import { parseFile } from './lib/parse.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(__dirname, 'fixtures')

let failures = 0

function readFixture(name) {
  return fs.readFileSync(path.join(fixturesDir, name), 'utf8')
}

function ok(label, cond) {
  if (cond) {
    process.stdout.write(`ok: ${label}\n`)
  } else {
    failures += 1
    process.stderr.write(`FAIL: ${label}\n`)
  }
}

function findProblem(problems, rule) {
  return problems.find((p) => p.rule === rule)
}

// -- valid fixture --
{
  const text = readFixture('v3-valid.md')
  const result = parseV3(text, { fileName: 'v3-valid.md' })
  ok('valid: format is v3', result.format === 'v3')
  ok('valid: 3 stories', result.issues.length === 3)
  ok('valid: zero error problems', result.problems.every((p) => p.severity !== 'error'))
  const [s1, s2, s3] = result.issues
  ok('valid: story1 priority P0', s1.priority === 'P0')
  ok('valid: story1 points 3', s1.points === 3)
  ok('valid: story1 sprint label', s1.labels.includes('Sprint-1'))
  ok('valid: story1 category label', s1.labels.includes('Canvas'))
  ok('valid: story1 kind story, parentId __EPIC__, id null',
    s1.kind === 'story' && s1.parentId === '__EPIC__' && s1.id === null)
  ok('valid: story2 dependsOn APP-1', s2.dependsOn.includes('APP-1'))
  ok('valid: story3 priority P2', s3.priority === 'P2')
  ok('valid: epicName from H1', result.epicName === 'Phase-1 Canvas hardening')
}

// -- phase label from file name --
{
  const text = readFixture('v3-valid.md')
  const result = parseV3(text, { fileName: 'Phase-1-canvas.md' })
  ok('phase: label from file name prefix', result.issues[0].labels.includes('Phase-1'))
}

// -- em-dash variant parses identically --
{
  const text = readFixture('v3-valid.md')
  const dashText = text.replace(/ -- /g, ` ${String.fromCodePoint(0x2014)} `)
  const plain = parseV3(text, { fileName: 'v3-valid.md' })
  const dashed = parseV3(dashText, { fileName: 'v3-valid.md' })
  const samePriorities = plain.issues.every((iss, i) => iss.priority === dashed.issues[i].priority)
  const sameSummaries = plain.issues.every((iss, i) => iss.summary === dashed.issues[i].summary)
  ok('em-dash variant: same priorities', samePriorities)
  ok('em-dash variant: same summaries', sameSummaries)
  const warn = findProblem(dashed.problems, 'dash-normalized')
  ok('em-dash variant: dash-normalized warning present', !!warn && warn.severity === 'warning')
  // The outbound contract: no em dash survives into anything that would be
  // filed. This is the assertion that fails if normalizeDashes is neutered.
  const em = String.fromCodePoint(0x2014)
  const noEmDashOutbound = dashed.issues.every(
    (iss) => !iss.summary.includes(em) && !iss.description.includes(em)
  )
  ok('em-dash variant: no em dash survives in outbound text', noEmDashOutbound)
  const normalizedForm = dashed.issues.some((iss) => iss.description.includes(' -- '))
  ok('em-dash variant: descriptions carry the -- form instead', normalizedForm)
}

// -- malformed fixtures --
const malformed = [
  ['v3-malformed-three-hash-heading.md', 'three-hash-heading'],
  ['v3-malformed-missing-category.md', 'missing-category'],
  ['v3-malformed-missing-separator.md', 'missing-separator'],
  ['v3-malformed-missing-as-a.md', 'missing-as-a'],
  ['v3-malformed-plain-bullet-ac.md', 'plain-bullet-ac'],
  ['v3-malformed-standalone-priority-item.md', 'standalone-priority-item'],
]
for (const [file, rule] of malformed) {
  const text = readFixture(file)
  const result = parseV3(text, { fileName: file })
  const problem = findProblem(result.problems, rule)
  ok(`malformed ${file}: emits ${rule} error`, !!problem && problem.severity === 'error' && problem.line > 0)
}

// -- v1 refusal via parse.mjs facade --
{
  const text = readFixture('v1-legacy.md')
  const result = parseFile(text, { fileName: 'v1-legacy.md' })
  ok('v1: format detected', result.format === 'v1')
  ok('v1: zero issues', result.issues.length === 0)
  const problem = findProblem(result.problems, 'legacy-v1')
  ok('v1: legacy-v1 error problem', !!problem && problem.severity === 'error')
}

if (failures > 0) {
  process.stderr.write(`\n${failures} failure(s)\n`)
  process.exit(1)
} else {
  process.stdout.write('\nall parse-v3 tests passed\n')
  process.exit(0)
}
