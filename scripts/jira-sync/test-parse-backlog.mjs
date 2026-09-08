#!/usr/bin/env node
// test-parse-backlog.mjs -- red-first test for lib/parse-backlog.mjs, plus the
// integration check against the real tracking/backlog-epics.md.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { parseBacklog } from './lib/parse-backlog.mjs'
import { parseFile } from './lib/parse.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const fixturesDir = path.join(__dirname, 'fixtures')

let failures = 0

function ok(label, cond) {
  if (cond) {
    process.stdout.write(`ok: ${label}\n`)
  } else {
    failures += 1
    process.stderr.write(`FAIL: ${label}\n`)
  }
}

// -- mini fixture --
{
  const text = fs.readFileSync(path.join(fixturesDir, 'backlog-mini.md'), 'utf8')
  const result = parseBacklog(text, { fileName: 'backlog-mini.md' })
  ok('mini: format backlog', result.format === 'backlog')
  ok('mini: 2 epics + 4 features', result.issues.length === 6)
  ok('mini: zero error problems', result.problems.every((p) => p.severity !== 'error'))

  const epics = result.issues.filter((i) => i.kind === 'epic')
  const features = result.issues.filter((i) => i.kind === 'story')
  ok('mini: 2 epics', epics.length === 2)
  ok('mini: 4 features', features.length === 4)

  const e01 = epics.find((i) => i.id === 'E01')
  ok('mini: epic id E01', !!e01)
  ok('mini: epic parentId null', e01 && e01.parentId === null)
  ok('mini: epic priority null', e01 && e01.priority === null)
  ok('mini: epic band label GREEN', e01 && e01.labels.includes('GREEN'))

  const f1 = features.find((i) => i.id === 'E01-F1')
  ok('mini: feature parent E01', !!f1 && f1.parentId === 'E01')
  ok('mini: feature points from size mapped to fibonacci', f1 && f1.points === 2)
  ok('mini: pointed feature carries rough-points label', f1 && f1.labels.includes('rough-points'))
  ok('mini: feature size verbatim', f1 && f1.size === '2 backend-days')
  ok('mini: feature blocked-by labels', f1 && f1.labels.includes('Q17') && f1.labels.includes('Q49'))
  ok('mini: feature blockedByQuestions', f1 && f1.blockedByQuestions.includes('Q17') && f1.blockedByQuestions.includes('Q49'))

  const f2 = features.find((i) => i.id === 'E01-F2')
  ok('mini: feature dependsOn E01-F1', f2 && f2.dependsOn.includes('E01-F1'))

  const notSized = features.find((i) => i.id === 'E02-F2')
  ok('mini: not sized -> points null', notSized && notSized.points === null)
  ok('mini: not sized -> size verbatim', notSized && notSized.size === 'not sized')
  ok('mini: not sized -> no rough-points label', notSized && !notSized.labels.includes('rough-points'))

  const e02 = epics.find((i) => i.id === 'E02')
  ok('mini: epic e02 future label from jira field', e02 && e02.labels.includes('future'))
  ok('mini: epic e02 band ORANGE parsed from parenthetical band', e02 && e02.labels.includes('ORANGE'))
}

// -- via facade --
{
  const text = fs.readFileSync(path.join(fixturesDir, 'backlog-mini.md'), 'utf8')
  const result = parseFile(text, { fileName: 'backlog-mini.md' })
  ok('facade: detects backlog format', result.format === 'backlog')
}

// -- malformed: orphan-feature (parent id names a non-existent epic) --
{
  const text = [
    '## E01 Alpha',
    '`id: E01 | band: GREEN`',
    '',
    '**E01-F1 Widget**',
    '`parent: E99 | size: 1 backend-day`',
    '',
    'Body text.',
    '',
  ].join('\n')
  const result = parseBacklog(text, { fileName: 'malformed-orphan.md' })
  const orphan = result.problems.find((p) => p.rule === 'orphan-feature')
  ok('malformed: orphan-feature problem present', !!orphan)
  ok('malformed: orphan-feature is error severity', orphan && orphan.severity === 'error')
}

// -- malformed: missing-metadata (bold feature line with no backticked meta within 3 lines) --
{
  const text = [
    '## E01 Alpha',
    '`id: E01 | band: GREEN`',
    '',
    '**E01-F1 Widget**',
    'No metadata line follows.',
    'Still no metadata line.',
    'Still nothing here either.',
    '',
  ].join('\n')
  const result = parseBacklog(text, { fileName: 'malformed-missing-metadata.md' })
  const missing = result.problems.find((p) => p.rule === 'missing-metadata')
  ok('malformed: missing-metadata problem present', !!missing)
  ok('malformed: missing-metadata is error severity', missing && missing.severity === 'error')
}

// -- malformed: duplicate-id (two items sharing the same id) --
{
  const text = [
    '## E01 Alpha',
    '`id: E01 | band: GREEN`',
    '',
    '## E01 Alpha Again',
    '`id: E01 | band: GREEN`',
    '',
  ].join('\n')
  const result = parseBacklog(text, { fileName: 'malformed-duplicate-id.md' })
  const dup = result.problems.find((p) => p.rule === 'duplicate-id')
  ok('malformed: duplicate-id problem present', !!dup)
  ok('malformed: duplicate-id is error severity', dup && dup.severity === 'error')
}

// -- real backlog integration check --
{
  const realPath = path.join(__dirname, '..', '..', 'tracking', 'backlog-epics.md')
  if (!fs.existsSync(realPath)) {
    process.stdout.write('skip: tracking/backlog-epics.md not present, skipping integration check\n')
  } else {
    const text = fs.readFileSync(realPath, 'utf8')
    const result = parseBacklog(text, { fileName: 'backlog-epics.md' })
    const epics = result.issues.filter((i) => i.kind === 'epic')
    const features = result.issues.filter((i) => i.kind === 'story')
    const errors = result.problems.filter((p) => p.severity === 'error')
    ok('real backlog: 18 epics', epics.length === 18)
    // 112 since 2026-09-02, when 25 features were promoted from the POC screen cross-reference.
    ok('real backlog: 112 features', features.length === 112)
    ok('real backlog: zero error problems', errors.length === 0)
    if (errors.length > 0) {
      for (const e of errors.slice(0, 10)) {
        process.stderr.write(`  error: ${e.rule} ${e.file}:${e.line} ${e.message}\n`)
      }
    }
  }
}

if (failures > 0) {
  process.stderr.write(`\n${failures} failure(s)\n`)
  process.exit(1)
} else {
  process.stdout.write('\nall parse-backlog tests passed\n')
  process.exit(0)
}
