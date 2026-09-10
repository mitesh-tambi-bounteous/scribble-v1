#!/usr/bin/env node
// test-state.mjs -- the resume journal: atomic writes, corrupt-file handling.

import assert from 'node:assert/strict'
import { mkdtempSync, writeFileSync, readFileSync, rmSync, readdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { statePathFor, loadState, saveCreated } from './lib/state.mjs'

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

function withTmpDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'jira-sync-state-test-'))
  try {
    fn(dir)
  } finally {
    rmSync(dir, { recursive: true, force: true })
  }
}

check('statePathFor appends the fixed suffix', () => {
  assert.equal(statePathFor('/x/y/input.md'), '/x/y/input.md.sync-state.json')
})

check('loadState returns empty shape when file absent', () => {
  withTmpDir((dir) => {
    const path = join(dir, 'missing.sync-state.json')
    const state = loadState(path)
    assert.deepEqual(state.created, {})
    assert.equal(state.inputFile, null)
  })
})

check('loadState throws loudly on corrupt JSON, never returns empty', () => {
  withTmpDir((dir) => {
    const path = join(dir, 'corrupt.sync-state.json')
    writeFileSync(path, '{not json')
    assert.throws(() => loadState(path), /corrupt state file/)
  })
})

check('saveCreated writes atomically and is readable after every call', () => {
  withTmpDir((dir) => {
    const path = join(dir, 'input.md.sync-state.json')
    let state = { created: {}, inputFile: 'input.md' }
    state = saveCreated(path, state, 'E01', 'APP-1')
    let onDisk = JSON.parse(readFileSync(path, 'utf8'))
    assert.equal(onDisk.created.E01.jiraKey, 'APP-1')

    state = saveCreated(path, state, 'E01-F1', 'APP-2')
    onDisk = JSON.parse(readFileSync(path, 'utf8'))
    assert.equal(onDisk.created.E01.jiraKey, 'APP-1')
    assert.equal(onDisk.created['E01-F1'].jiraKey, 'APP-2')

    const reloaded = loadState(path)
    assert.equal(reloaded.created.E01.jiraKey, 'APP-1')
    assert.equal(reloaded.created['E01-F1'].jiraKey, 'APP-2')

    const tmpLeftovers = readdirSync(dir).filter((name) => name.includes('.tmp-'))
    assert.equal(tmpLeftovers.length, 0)
  })
})

check('loadState defaults attached to {} when a state file predates the attached map', () => {
  withTmpDir((dir) => {
    const path = join(dir, 'legacy.sync-state.json')
    writeFileSync(path, JSON.stringify({ created: { E01: { jiraKey: 'APP-1', at: '2026-01-01T00:00:00.000Z' } } }))
    const state = loadState(path)
    assert.deepEqual(state.attached, {})
    assert.equal(state.created.E01.jiraKey, 'APP-1')
  })
})

if (failures > 0) {
  process.stderr.write(`\ntest-state: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-state: all assertions passed\n')
process.exit(0)
