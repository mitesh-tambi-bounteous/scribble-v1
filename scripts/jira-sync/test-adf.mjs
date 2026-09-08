#!/usr/bin/env node
// test-adf.mjs -- exercises mdToAdf's minimal markdown -> ADF mapping.

import assert from 'node:assert/strict'
import { mdToAdf } from './lib/adf.mjs'

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

check('rejects non-string input', () => {
  assert.throws(() => mdToAdf(42))
})

check('heading levels map from ##/###/####', () => {
  const doc = mdToAdf('## Two\n### Three\n#### Four\n')
  assert.equal(doc.type, 'doc')
  assert.equal(doc.content[0].type, 'heading')
  assert.equal(doc.content[0].attrs.level, 2)
  assert.equal(doc.content[1].attrs.level, 3)
  assert.equal(doc.content[2].attrs.level, 4)
})

check('blank-line-separated prose becomes paragraph nodes', () => {
  const doc = mdToAdf('First para line one.\nFirst para line two.\n\nSecond para.\n')
  const paras = doc.content.filter((n) => n.type === 'paragraph')
  assert.equal(paras.length, 2)
  assert.equal(paras[0].content[0].text, 'First para line one. First para line two.')
  assert.equal(paras[1].content[0].text, 'Second para.')
})

check('checkbox lines become a taskList with TODO/DONE state', () => {
  const doc = mdToAdf('- [ ] not done\n- [x] done\n')
  const taskList = doc.content.find((n) => n.type === 'taskList')
  assert.ok(taskList)
  assert.equal(taskList.content[0].attrs.state, 'TODO')
  assert.equal(taskList.content[1].attrs.state, 'DONE')
})

check('plain bullet lines become a bulletList', () => {
  const doc = mdToAdf('- one\n- two\n')
  const bulletList = doc.content.find((n) => n.type === 'bulletList')
  assert.ok(bulletList)
  assert.equal(bulletList.content.length, 2)
})

check('mixed content preserves order: heading, para, tasklist', () => {
  const doc = mdToAdf('## Title\n\nSome prose.\n\n- [ ] todo item\n')
  const types = doc.content.map((n) => n.type)
  assert.deepEqual(types, ['heading', 'paragraph', 'taskList'])
})

check('bounded at 2000 blocks on pathological input', () => {
  const lines = []
  for (let i = 0; i < 5000; i += 1) {
    lines.push(`## Heading ${i}`)
  }
  const doc = mdToAdf(lines.join('\n'))
  assert.ok(doc.content.length <= 2000)
})

if (failures > 0) {
  process.stderr.write(`\ntest-adf: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-adf: all assertions passed\n')
process.exit(0)
