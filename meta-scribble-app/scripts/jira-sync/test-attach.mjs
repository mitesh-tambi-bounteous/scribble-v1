#!/usr/bin/env node
// test-attach.mjs -- resume journal and per-item error isolation for
// runAttach. No real network I/O: every case injects a fake client object.

import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { statePathFor, loadState } from './lib/state.mjs'
import { runAttach } from './lib/attach.mjs'

let failures = 0

function check(label, fn) {
  return (async () => {
    try {
      await fn()
      process.stdout.write(`ok: ${label}\n`)
    } catch (err) {
      failures += 1
      process.stderr.write(`FAIL: ${label}: ${err.message}\n${err.stack}\n`)
    }
  })()
}

function withTmpDir(fn) {
  const dir = mkdtempSync(join(tmpdir(), 'jira-sync-attach-test-'))
  return (async () => {
    try {
      return await fn(dir)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })()
}

function makeFakeLog() {
  const errors = []
  const logs = []
  return { error: (msg) => errors.push(msg), log: (msg) => logs.push(msg), errors, logs }
}

// failAt: index (in call order) at which attach() throws. null = never fail.
function makeFakeClient({ failAt = null } = {}) {
  const calls = []
  return {
    calls,
    attach: async (key, path) => {
      const index = calls.length
      calls.push({ key, path })
      if (failAt !== null && index === failAt) throw new Error('boom')
      return true
    },
  }
}

function candidates() {
  return [
    { stableKey: 'E01-F1', jiraKey: 'APP-1', path: 'docs/a.png', summary: 'F1' },
    { stableKey: 'E01-F2', jiraKey: 'APP-2', path: 'docs/b.png', summary: 'F2' },
    { stableKey: 'E01-F3', jiraKey: 'APP-3', path: 'docs/c.png', summary: 'F3' },
  ]
}

async function run() {
  await check('mid-run failure stops at exitCode 3 and journals only what landed', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'backlog-mini.md')
      const statePath = statePathFor(inputFile)
      const cs = candidates()

      const fakeClient = makeFakeClient({ failAt: 1 }) // 2nd call throws
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runAttach({ candidates: cs, state, statePath, client: fakeClient, log })

      assert.equal(result.exitCode, 3)
      assert.equal(result.attached.length, 1)
      assert.ok(log.errors.some((m) => m.includes('resume with:')))

      const onDisk = JSON.parse(readFileSync(statePath, 'utf8'))
      assert.equal(Object.keys(onDisk.attached).length, 1)
    })
  )

  await check('rerun with a healed client attaches only the remainder, no duplicate attach calls', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'backlog-mini.md')
      const statePath = statePathFor(inputFile)
      const cs = candidates()

      const fakeClient1 = makeFakeClient({ failAt: 1 })
      const state1 = loadState(statePath)
      const log1 = makeFakeLog()
      const result1 = await runAttach({ candidates: cs, state: state1, statePath, client: fakeClient1, log: log1 })
      assert.equal(result1.exitCode, 3)

      const fakeHealed = makeFakeClient({})
      const state2 = loadState(statePath)
      const log2 = makeFakeLog()
      const result2 = await runAttach({ candidates: cs, state: state2, statePath, client: fakeHealed, log: log2 })

      assert.equal(result2.exitCode, 0)
      assert.equal(fakeHealed.calls.length, 2) // the 1 that failed + the 1 never attempted
      assert.equal(result2.attached.length, 2)
    })
  )

  await check('second full rerun attaches nothing: all SKIP, zero client.attach calls', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'backlog-mini.md')
      const statePath = statePathFor(inputFile)
      const cs = candidates()

      const fakeClient1 = makeFakeClient({})
      const state1 = loadState(statePath)
      const log1 = makeFakeLog()
      const result1 = await runAttach({ candidates: cs, state: state1, statePath, client: fakeClient1, log: log1 })
      assert.equal(result1.exitCode, 0)
      assert.equal(result1.attached.length, 3)

      const fakeClient2 = makeFakeClient({})
      const state2 = loadState(statePath)
      const log2 = makeFakeLog()
      const result2 = await runAttach({ candidates: cs, state: state2, statePath, client: fakeClient2, log: log2 })

      assert.equal(result2.exitCode, 0)
      assert.equal(result2.attached.length, 0)
      assert.equal(fakeClient2.calls.length, 0)
      assert.equal(log2.logs.filter((m) => m.startsWith('SKIP')).length, 3)
    })
  )

  if (failures > 0) {
    process.stderr.write(`\ntest-attach: ${failures} assertion(s) failed\n`)
    process.exit(1)
  }
  process.stdout.write('\ntest-attach: all assertions passed\n')
  process.exit(0)
}

run()
