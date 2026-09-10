#!/usr/bin/env node
// test-points.mjs -- covers lib/points.mjs: every bucket boundary of the
// lane-days -> Fibonacci difficulty mapping, the null case, and the
// rough-points label reaching issues from the backlog parser. The V3 parser
// deliberately does not use this module: its Points value is hand-written.

import { snapToFibonacciPoints, roughPointsFromSize, ROUGH_POINTS_LABEL } from './lib/points.mjs'
import { parseBacklog } from './lib/parse-backlog.mjs'

let failures = 0

function ok(label, cond) {
  if (cond) {
    process.stdout.write(`ok: ${label}\n`)
  } else {
    failures += 1
    process.stderr.write(`FAIL: ${label}\n`)
  }
}

// -- bucket boundaries: 1 -> 1, 2 -> 2, 3 -> 3, 4-5 -> 5, 6-8 -> 8, 9+ -> 13 --
const BUCKETS = [[1, 1], [2, 2], [3, 3], [4, 5], [5, 5], [6, 8], [8, 8], [9, 13], [40, 13]]
for (const [days, expected] of BUCKETS) {
  ok(`snap: ${days} lane-day(s) -> ${expected}`, snapToFibonacciPoints(days) === expected)
  ok(`size: "${days} backend-days" -> ${expected}`, roughPointsFromSize(`${days} backend-days`) === expected)
}

// -- never a silent 0 or NaN --
ok('snap: rejects 0', (() => { try { snapToFibonacciPoints(0); return false } catch { return true } })())
ok('snap: rejects non-integer', (() => { try { snapToFibonacciPoints(2.5); return false } catch { return true } })())
ok('snap: rejects absurd lane-days', (() => { try { snapToFibonacciPoints(100000); return false } catch { return true } })())

// -- null cases: no leading integer means no estimate, exactly as before --
ok('size: "not sized" -> null', roughPointsFromSize('not sized') === null)
ok('size: "TBD backend-days" -> null', roughPointsFromSize('TBD backend-days') === null)
ok('size: null -> null', roughPointsFromSize(null) === null)
ok('size: undefined -> null', roughPointsFromSize(undefined) === null)
ok('size: "0 backend-days" -> null', roughPointsFromSize('0 backend-days') === null)
ok('size: non-string throws', (() => { try { roughPointsFromSize(4); return false } catch { return true } })())

// -- MAX_LANE_DAYS boundary, through the string path --
ok('size: "365 backend-days" -> 13 (at the bound)', roughPointsFromSize('365 backend-days') === 13)
ok('size: "366 backend-days" -> null (past the bound)', roughPointsFromSize('366 backend-days') === null)

// -- range form: the leading integer wins, the rest of the string is ignored --
ok('size: "4 to 5 days across two lanes" -> 5', roughPointsFromSize('4 to 5 days across two lanes') === 5)

// -- zero size: a number that yields no points, not the same as "not sized" --
ok('size: "0, already built" -> null', roughPointsFromSize('0, already built') === null)

// -- a numeric size that yields no points is surfaced, not silently dropped --
{
  const text = [
    '## E02 Beta',
    '`id: E02 | band: GREEN`',
    '',
    '**E02-F1 Absurd size**',
    '`parent: E02 | size: 400 backend-days`',
    '',
    'Body text.',
    '',
    '**E02-F2 Zero size**',
    '`parent: E02 | size: 0, already built`',
    '',
    'Body text.',
    '',
    '**E02-F3 Genuinely unsized**',
    '`parent: E02 | size: not sized`',
    '',
    'Body text.',
    '',
  ].join('\n')
  const result = parseBacklog(text, { fileName: 'unusable-size.md' })
  const warnings = result.problems.filter((p) => p.rule === 'unusable-size')
  ok('unusable-size: exactly two warnings (over-bound and zero)', warnings.length === 2)
  ok('unusable-size: severity is warning, never error', warnings.every((p) => p.severity === 'warning'))
  ok('unusable-size: reports the real file', warnings.every((p) => p.file === 'unusable-size.md'))
  ok('unusable-size: reports a real 1-based line', warnings.every((p) => Number.isInteger(p.line) && p.line >= 1))
  ok('unusable-size: over-bound warning names the size value',
    warnings.some((p) => p.message.includes('400 backend-days') && p.message.includes('E02-F1')))
  ok('unusable-size: zero warning names the size value',
    warnings.some((p) => p.message.includes('0, already built') && p.message.includes('E02-F2')))
  ok('unusable-size: "not sized" produces no warning',
    !warnings.some((p) => p.message.includes('E02-F3')))
  const f1 = result.issues.find((i) => i.id === 'E02-F1')
  const f2 = result.issues.find((i) => i.id === 'E02-F2')
  ok('unusable-size: over-bound feature still has null points', f1 && f1.points === null)
  ok('unusable-size: zero-size feature still has null points', f2 && f2.points === null)
  ok('unusable-size: neither carries the rough-points label',
    f1 && f2 && !f1.labels.includes(ROUGH_POINTS_LABEL) && !f2.labels.includes(ROUGH_POINTS_LABEL))
}

// -- label reaches the parsed issue, and only when there are points --
{
  const text = [
    '## E01 Alpha',
    '`id: E01 | band: GREEN`',
    '',
    '**E01-F1 Big widget**',
    '`parent: E01 | size: 4 backend-days`',
    '',
    'Body text.',
    '',
    '**E01-F2 Unsized widget**',
    '`parent: E01 | size: not sized`',
    '',
    'Body text.',
    '',
  ].join('\n')
  const result = parseBacklog(text, { fileName: 'points-fixture.md' })
  const f1 = result.issues.find((i) => i.id === 'E01-F1')
  const f2 = result.issues.find((i) => i.id === 'E01-F2')
  const e01 = result.issues.find((i) => i.id === 'E01')
  ok('backlog: 4 lane-days becomes 5 points', f1 && f1.points === 5)
  ok('backlog: pointed feature carries rough-points label', f1 && f1.labels.includes(ROUGH_POINTS_LABEL))
  ok('backlog: unsized feature has null points', f2 && f2.points === null)
  ok('backlog: unsized feature has no rough-points label', f2 && !f2.labels.includes(ROUGH_POINTS_LABEL))
  ok('backlog: epic has no rough-points label', e01 && !e01.labels.includes(ROUGH_POINTS_LABEL))
  ok('backlog: size string stays off the description', f1 && !f1.description.includes('backend-days'))
}

if (failures > 0) {
  process.stderr.write(`\n${failures} failure(s)\n`)
  process.exit(1)
} else {
  process.stdout.write('\nall points tests passed\n')
  process.exit(0)
}
