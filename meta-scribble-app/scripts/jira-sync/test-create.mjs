#!/usr/bin/env node
// test-create.mjs -- idempotency, resume-after-partial-failure, and the
// live-duplicate / auth gates in runCreate. No real network I/O: every case
// injects a fake fetchImpl and asserts on the recorded call log.

import assert from 'node:assert/strict'
import { mkdtempSync, rmSync, existsSync, readFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { makeIssue } from './lib/model.mjs'
import { makeJiraClient } from './lib/jira.mjs'
import { loadState, statePathFor } from './lib/state.mjs'
import { runCreate } from './lib/create.mjs'

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
  const dir = mkdtempSync(join(tmpdir(), 'jira-sync-create-test-'))
  return (async () => {
    try {
      return await fn(dir)
    } finally {
      rmSync(dir, { recursive: true, force: true })
    }
  })()
}

const CONFIG = {
  baseUrl: 'https://example.atlassian.net',
  email: 'ops@example.com',
  token: 'placeholder-token',
  projectKey: 'APP',
  storyPointsField: null,
  epicIssueType: 'Epic',
  storyIssueType: 'Story',
}

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async json() {
      return body
    },
    async text() {
      return JSON.stringify(body)
    },
  }
}

// Builds a fake fetchImpl. `overrides` lets a test replace or extend the
// default happy-path handlers (myself, projectMeta, searchSummaries, create,
// link). `createSequence` lets a test script per-call create responses.
function makeFake({ existingSummaries = [], createSequence = null, myselfStatus = 200, linkShouldFail = false } = {}) {
  const calls = []
  let createCount = 0
  async function fetchImpl(url, opts) {
    calls.push({ url, method: opts.method, body: opts.body })
    const path = url.replace(CONFIG.baseUrl, '')
    if (path === '/rest/api/3/myself' && opts.method === 'GET') {
      return myselfStatus === 200
        ? jsonResponse(200, { accountId: 'fake-account' })
        : jsonResponse(myselfStatus, { message: 'unauthorized' })
    }
    if (path === '/rest/api/3/project/APP' && opts.method === 'GET') {
      return jsonResponse(200, { key: 'APP', issueTypes: [{ name: 'Epic' }, { name: 'Story' }] })
    }
    if (path === '/rest/api/3/search/jql' && opts.method === 'POST') {
      return jsonResponse(200, {
        issues: existingSummaries.map((s) => ({ fields: { summary: s } })),
        nextPageToken: null,
      })
    }
    if (path === '/rest/api/3/issue' && opts.method === 'POST') {
      const index = createCount
      createCount += 1
      if (createSequence && createSequence[index]) {
        const outcome = createSequence[index]
        if (outcome.fail) return jsonResponse(500, { errorMessages: ['boom'] })
      }
      return jsonResponse(201, { key: `APP-${100 + index}` })
    }
    if (path === '/rest/api/3/issueLink' && opts.method === 'POST') {
      return linkShouldFail ? jsonResponse(500, { errorMessages: ['link boom'] }) : jsonResponse(201, {})
    }
    throw new Error(`unhandled fake fetch call: ${opts.method} ${path}`)
  }
  return { fetchImpl, calls, postedIssueBodies: () => calls.filter((c) => c.url.endsWith('/issue')) }
}

function makeFakeLog() {
  const errors = []
  const logs = []
  return {
    error: (msg) => errors.push(msg),
    log: (msg) => logs.push(msg),
    errors,
    logs,
  }
}

function backlogIssues() {
  const epic = makeIssue({ id: 'E01', kind: 'epic', summary: 'E01 Foundation', source: { file: 'f.md', line: 1 } })
  const f1 = makeIssue({
    id: 'E01-F1', kind: 'story', summary: 'E01-F1 Accounts', parentId: 'E01',
    source: { file: 'f.md', line: 2 },
  })
  const f2 = makeIssue({
    id: 'E01-F2', kind: 'story', summary: 'E01-F2 Environments', parentId: 'E01',
    source: { file: 'f.md', line: 3 },
  })
  const f3 = makeIssue({
    id: 'E01-F3', kind: 'story', summary: 'E01-F3 Third feature', parentId: 'E01',
    source: { file: 'f.md', line: 4 },
  })
  return [epic, f1, f2, f3]
}

async function run() {
  await check('idempotency: second run over the same state posts zero creates', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'backlog-mini.md')
      const statePath = statePathFor(inputFile)
      const issues = backlogIssues()
      const parseResult = { issues }

      const fake1 = makeFake({})
      const client1 = makeJiraClient({ config: CONFIG, fetchImpl: fake1.fetchImpl })
      const state1 = loadState(statePath)
      const log1 = makeFakeLog()
      const result1 = await runCreate({
        parseResult, config: CONFIG, state: state1, statePath, epicKey: null, client: client1, log: log1,
      })
      assert.equal(result1.exitCode, 0)
      assert.equal(result1.created.length, 4)

      const fake2 = makeFake({})
      const client2 = makeJiraClient({ config: CONFIG, fetchImpl: fake2.fetchImpl })
      const state2 = loadState(statePath)
      const log2 = makeFakeLog()
      const result2 = await runCreate({
        parseResult, config: CONFIG, state: state2, statePath, epicKey: null, client: client2, log: log2,
      })
      assert.equal(result2.exitCode, 0)
      assert.equal(result2.created.length, 0)
      assert.equal(result2.skipped, 4)
      assert.equal(fake2.postedIssueBodies().length, 0)
    })
  )

  await check('resume: a mid-run failure stops at exitCode 3 and journals only what landed', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'backlog-mini.md')
      const statePath = statePathFor(inputFile)
      const issues = backlogIssues()
      const parseResult = { issues }

      const fake = makeFake({ createSequence: [{}, {}, { fail: true }, {}] })
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })
      assert.equal(result.exitCode, 3)
      assert.equal(result.created.length, 2)
      assert.ok(log.errors.some((m) => m.includes('resume with:')))

      const onDisk = JSON.parse(readFileSync(statePath, 'utf8'))
      assert.equal(Object.keys(onDisk.created).length, 2)

      const fakeHealed = makeFake({})
      const clientHealed = makeJiraClient({ config: CONFIG, fetchImpl: fakeHealed.fetchImpl })
      const stateResume = loadState(statePath)
      const logResume = makeFakeLog()
      const resumeResult = await runCreate({
        parseResult, config: CONFIG, state: stateResume, statePath, epicKey: null,
        client: clientHealed, log: logResume,
      })
      assert.equal(resumeResult.exitCode, 0)
      assert.equal(resumeResult.created.length, 2)
      assert.equal(resumeResult.skipped, 2)

      const totalDistinctPosted = 2 + 2 // first run's 2 landed creates + resume's 2
      assert.equal(totalDistinctPosted, issues.length)
    })
  )

  await check('live duplicate check refuses with zero creates when Jira already has the summary', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'dup.md')
      const statePath = statePathFor(inputFile)
      const issues = backlogIssues()
      const parseResult = { issues }
      const fake = makeFake({ existingSummaries: ['e01-f1 accounts'] })
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })
      assert.equal(result.exitCode, 1)
      assert.equal(fake.postedIssueBodies().length, 0)
      assert.ok(log.errors.some((m) => m.includes('duplicate')))
    })
  )

  await check('myself() 401 stops before any other call', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'auth.md')
      const statePath = statePathFor(inputFile)
      const issues = backlogIssues()
      const parseResult = { issues }
      const fake = makeFake({ myselfStatus: 401 })
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })
      assert.equal(result.exitCode, 1)
      assert.equal(fake.calls.length, 1)
      assert.ok(log.errors.some((m) => m.includes('credentials failed')))
    })
  )

  await check('points with no configured field warns but still creates', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'points.md')
      const statePath = statePathFor(inputFile)
      const story = makeIssue({
        kind: 'story', summary: 'Pointed story', parentId: '__EPIC__', points: 5,
        source: { file: 'f.md', line: 1 },
      })
      const parseResult = { issues: [story] }
      const fake = makeFake({})
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: 'APP-1', client, log,
      })
      assert.equal(result.exitCode, 0)
      assert.equal(result.created.length, 1)
      assert.ok(log.errors.some((m) => m.includes('no JIRA_STORY_POINTS_FIELD')))
    })
  )

  await check('v3-shaped input with no --epic-key synthesizes an epic and parents stories under it', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'v3.md')
      const statePath = statePathFor(inputFile)
      const issues = [
        makeIssue({ kind: 'story', summary: 'V3 story one', parentId: '__EPIC__', id: null, source: { file: 'f.md', line: 1 } }),
        makeIssue({ kind: 'story', summary: 'V3 story two', parentId: '__EPIC__', id: null, source: { file: 'f.md', line: 2 } }),
      ]
      const parseResult = { issues, epicName: 'Some V3 Epic' }

      const fake = makeFake({})
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })
      assert.equal(result.exitCode, 0)

      const issuePosts = fake.postedIssueBodies()
      assert.equal(issuePosts.length, 3) // 1 epic + 2 stories
      const bodies = issuePosts.map((c) => JSON.parse(c.body))
      const epicPost = bodies.find((b) => b.fields.summary === 'Some V3 Epic')
      assert.ok(epicPost, 'expected an epic-create POST for the synthesized epic')
      const epicKey = result.created.find((c) => c.stableKey === 'some v3 epic').jiraKey
      const storyPosts = bodies.filter((b) => b.fields.summary !== 'Some V3 Epic')
      assert.equal(storyPosts.length, 2)
      for (const sp of storyPosts) {
        assert.equal(sp.fields.parent.key, epicKey)
      }
    })
  )

  await check('v3-shaped input with --epic-key skips epic creation and parents stories under the given key', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'v3-existing-epic.md')
      const statePath = statePathFor(inputFile)
      const issues = [
        makeIssue({ kind: 'story', summary: 'V3 story three', parentId: '__EPIC__', id: null, source: { file: 'f.md', line: 1 } }),
        makeIssue({ kind: 'story', summary: 'V3 story four', parentId: '__EPIC__', id: null, source: { file: 'f.md', line: 2 } }),
      ]
      const parseResult = { issues, epicName: 'Some V3 Epic' }

      const fake = makeFake({})
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: 'APP-999', client, log,
      })
      assert.equal(result.exitCode, 0)

      const issuePosts = fake.postedIssueBodies()
      assert.equal(issuePosts.length, 2) // stories only, zero epic-create POSTs
      const bodies = issuePosts.map((c) => JSON.parse(c.body))
      for (const b of bodies) {
        assert.notEqual(b.fields.summary, 'Some V3 Epic')
        assert.equal(b.fields.parent.key, 'APP-999')
      }
    })
  )

  await check('a failing issueLink POST still creates every issue but exits 3 and logs the link failure', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'link-fail.md')
      const statePath = statePathFor(inputFile)
      const epic = makeIssue({ id: 'E01', kind: 'epic', summary: 'E01 Link Foundation', source: { file: 'f.md', line: 1 } })
      const f1 = makeIssue({
        id: 'E01-F1', kind: 'story', summary: 'E01-F1 Base feature', parentId: 'E01',
        source: { file: 'f.md', line: 2 },
      })
      const f2 = makeIssue({
        id: 'E01-F2', kind: 'story', summary: 'E01-F2 Dependent feature', parentId: 'E01',
        dependsOn: ['E01-F1'], source: { file: 'f.md', line: 3 },
      })
      const issues = [epic, f1, f2]
      const parseResult = { issues }

      const fake = makeFake({ linkShouldFail: true })
      const client = makeJiraClient({ config: CONFIG, fetchImpl: fake.fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })
      assert.equal(result.exitCode, 3)
      assert.equal(result.created.length, issues.length)
      assert.ok(log.errors.some((m) => /link failed/i.test(m)))
    })
  )

  await check('searchSummaries follows nextPageToken across pages; second-page collision is caught', () =>
    withTmpDir(async (dir) => {
      const inputFile = join(dir, 'paged-dup.md')
      const statePath = statePathFor(inputFile)
      const issues = backlogIssues()
      const parseResult = { issues }

      const searchCalls = []
      async function fetchImpl(url, opts) {
        const path = url.replace(CONFIG.baseUrl, '')
        if (path === '/rest/api/3/myself' && opts.method === 'GET') {
          return jsonResponse(200, { accountId: 'fake-account' })
        }
        if (path === '/rest/api/3/project/APP' && opts.method === 'GET') {
          return jsonResponse(200, { key: 'APP', issueTypes: [{ name: 'Epic' }, { name: 'Story' }] })
        }
        if (path === '/rest/api/3/search/jql' && opts.method === 'POST') {
          const body = JSON.parse(opts.body)
          searchCalls.push(body)
          if (searchCalls.length === 1) {
            return jsonResponse(200, { issues: [{ fields: { summary: 'page one item' } }], nextPageToken: 'tok-2' })
          }
          return jsonResponse(200, { issues: [{ fields: { summary: issues[1].summary.toLowerCase() } }], nextPageToken: null })
        }
        if (path === '/rest/api/3/issue' && opts.method === 'POST') {
          throw new Error('should never POST /issue: collision must be caught first')
        }
        throw new Error(`unhandled fake fetch call: ${opts.method} ${path}`)
      }

      const client = makeJiraClient({ config: CONFIG, fetchImpl })
      const state = loadState(statePath)
      const log = makeFakeLog()
      const result = await runCreate({
        parseResult, config: CONFIG, state, statePath, epicKey: null, client, log,
      })

      assert.equal(searchCalls.length, 2)
      assert.equal(searchCalls[1].nextPageToken, 'tok-2')
      assert.equal(result.exitCode, 1)
      assert.equal(result.created.length, 0)
      assert.ok(log.errors.some((m) => m.includes('duplicate')))
    })
  )

  if (failures > 0) {
    process.stderr.write(`\ntest-create: ${failures} assertion(s) failed\n`)
    process.exit(1)
  }
  process.stdout.write('\ntest-create: all assertions passed\n')
  process.exit(0)
}

run()
