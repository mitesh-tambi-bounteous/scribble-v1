#!/usr/bin/env node
// test-plan.mjs -- buildPlan: skip-on-state, epicKey mode, order enforcement.

import assert from 'node:assert/strict'
import { makeIssue } from './lib/model.mjs'
import { buildPlan } from './lib/plan.mjs'

let failures = 0

function check(label, fn) {
  try {
    fn()
    process.stdout.write(`ok: ${label}\n`)
  } catch (err) {
    failures += 1
    process.stderr.write(`FAIL: ${label}: ${err.message}\n`)
  }
}

function src(line) {
  return { file: 'fixture.md', line }
}

function emptyState() {
  return { created: {}, inputFile: null }
}

check('skip action for a stableKey already in state', () => {
  const epic = makeIssue({ id: 'E01', kind: 'epic', summary: 'E01 Foundation', source: src(1) })
  const feature = makeIssue({
    id: 'E01-F1', kind: 'story', summary: 'E01-F1 Accounts', parentId: 'E01', source: src(2),
  })
  const state = { created: { 'E01-F1': { jiraKey: 'APP-9', at: 'x' } }, inputFile: null }
  const plan = buildPlan([epic, feature], { state })
  assert.equal(plan[0].op, 'create-epic')
  assert.equal(plan[1].op, 'skip')
  assert.equal(plan[1].jiraKey, 'APP-9')
})

check('epicKey mode: no create-epic action, story parents to the given key', () => {
  const story = makeIssue({
    kind: 'story', summary: 'Do the thing', parentId: '__EPIC__', source: src(1),
  })
  const plan = buildPlan([story], { epicKey: 'APP-1', state: emptyState() })
  assert.equal(plan.length, 1)
  assert.equal(plan[0].op, 'create-story')
  assert.deepEqual(plan[0].parentRef, { jiraKey: 'APP-1' })
})

check('no epicKey, no epic issue present for a __EPIC__ story: throws', () => {
  const story = makeIssue({
    kind: 'story', summary: 'Orphan story', parentId: '__EPIC__', source: src(1),
  })
  assert.throws(() => buildPlan([story], { state: emptyState() }), /no epic issue/)
})

check('unknown dependsOn target throws, naming the item', () => {
  const story = makeIssue({
    kind: 'story', summary: 'Blocked story', parentId: '__EPIC__',
    dependsOn: ['NOPE'], source: src(1),
  })
  assert.throws(() => buildPlan([story], { epicKey: 'APP-1', state: emptyState() }), /Blocked story/)
})

check('dependsOn resolves to a literal Jira key without a file/state match', () => {
  const story = makeIssue({
    kind: 'story', summary: 'Depends on external', parentId: '__EPIC__',
    dependsOn: ['APP-42'], source: src(1),
  })
  const plan = buildPlan([story], { epicKey: 'APP-1', state: emptyState() })
  const link = plan.find((a) => a.op === 'link-blocks')
  assert.ok(link)
  assert.equal(link.links.to, 'APP-42')
})

check('document order preserved: parent placed after child throws', () => {
  const child = makeIssue({
    id: 'E01-F1', kind: 'story', summary: 'E01-F1 Child', parentId: 'E01', source: src(1),
  })
  const parent = makeIssue({ id: 'E01', kind: 'epic', summary: 'E01 Parent', source: src(2) })
  assert.throws(() => buildPlan([child, parent], { state: emptyState() }), /must precede it/)
})

check('backlog-style parent resolves and children keep document order', () => {
  const epic = makeIssue({ id: 'E01', kind: 'epic', summary: 'E01 Foundation', source: src(1) })
  const f1 = makeIssue({ id: 'E01-F1', kind: 'story', summary: 'E01-F1 A', parentId: 'E01', source: src(2) })
  const f2 = makeIssue({ id: 'E01-F2', kind: 'story', summary: 'E01-F2 B', parentId: 'E01', source: src(3) })
  const plan = buildPlan([epic, f1, f2], { state: emptyState() })
  const ops = plan.map((a) => a.op)
  assert.deepEqual(ops, ['create-epic', 'create-story', 'create-story'])
})

if (failures > 0) {
  process.stderr.write(`\ntest-plan: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-plan: all assertions passed\n')
process.exit(0)
