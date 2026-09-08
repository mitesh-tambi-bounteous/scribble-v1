#!/usr/bin/env node
// test-cli.mjs -- spawns the real CLI (jira-sync.mjs) as a child process and
// asserts on its stdout/stderr/exit code. Never imports CLI internals: this
// is the one place we exercise the actual argv/exit-code contract.
//
// Power-of-10: bounded fixture list, every spawn wrapped, non-zero exit on
// any failure, no framework.

import { execFileSync } from 'node:child_process'
import { existsSync, readdirSync, mkdtempSync, rmSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import os from 'node:os'

const HERE = dirname(fileURLToPath(import.meta.url))
const REPO_ROOT = join(HERE, '..', '..')
const CLI = join(HERE, 'jira-sync.mjs')
const FIXTURES = join(HERE, 'fixtures')

let failures = 0

function check(label, cond) {
  if (cond) {
    process.stdout.write(`ok: ${label}\n`)
  } else {
    failures += 1
    process.stderr.write(`FAIL: ${label}\n`)
  }
}

function run(args, env) {
  const opts = {
    cwd: REPO_ROOT,
    env: { ...process.env, ...env },
    encoding: 'utf8',
  }
  try {
    const stdout = execFileSync('node', [CLI, ...args], opts)
    return { code: 0, stdout, stderr: '' }
  } catch (err) {
    return {
      code: typeof err.status === 'number' ? err.status : 1,
      stdout: err.stdout ? err.stdout.toString() : '',
      stderr: err.stderr ? err.stderr.toString() : '',
    }
  }
}

function noSyncStateFiles(dir) {
  const cap = 1000
  let count = 0
  const entries = readdirSync(dir)
  for (const e of entries) {
    if (count > cap) throw new Error('noSyncStateFiles: too many entries')
    count += 1
    if (e.endsWith('.sync-state.json')) return false
  }
  return true
}

const v3Valid = join(FIXTURES, 'v3-valid.md')
const v3MissingAsA = join(FIXTURES, 'v3-malformed-missing-as-a.md')

if (!existsSync(v3Valid)) {
  process.stderr.write(`FAIL: fixture missing: ${v3Valid} (Builder A not landed yet)\n`)
  failures += 1
}
if (!existsSync(v3MissingAsA)) {
  process.stderr.write(`FAIL: fixture missing: ${v3MissingAsA} (Builder A not landed yet)\n`)
  failures += 1
}

// --- dry-run on the valid fixture: no network, no state file written ---
{
  const poisonEnv = { JIRA_BASE_URL: 'http://127.0.0.1:1' }
  delete poisonEnv.JIRA_API_TOKEN
  const r = run(['dry-run', v3Valid], poisonEnv)
  check('dry-run exits 0', r.code === 0)
  check('dry-run mentions DRY RUN sentinel', r.stdout.includes('DRY RUN. Nothing was sent to Jira.'))
  check('dry-run shows CREATE', r.stdout.includes('CREATE'))
  check('dry-run shows story 1 title', r.stdout.includes('Wall load performance'))
  check('dry-run shows story 2 title', r.stdout.includes('Prompt draft review queue'))
  check('dry-run shows story 3 title', r.stdout.includes('Canvas brush restriction seam'))
  check('no state file created beside fixture', !existsSync(`${v3Valid}.sync-state.json`))
  check('no stray state files in fixtures/', noSyncStateFiles(FIXTURES))
}

// --- dry-run points-dropped warning: present when no field configured ---
{
  const poisonEnv = { JIRA_BASE_URL: 'http://127.0.0.1:1', JIRA_STORY_POINTS_FIELD: '' }
  delete poisonEnv.JIRA_API_TOKEN
  const r = run(['dry-run', v3Valid], poisonEnv)
  check('dry-run with no points field warns points would be dropped', r.stdout.includes('points would be dropped'))
}

// --- dry-run points-dropped warning: absent when field is configured ---
{
  const poisonEnv = { JIRA_BASE_URL: 'http://127.0.0.1:1', JIRA_STORY_POINTS_FIELD: 'customfield_10016' }
  delete poisonEnv.JIRA_API_TOKEN
  const r = run(['dry-run', v3Valid], poisonEnv)
  check('dry-run with points field configured has no drop warning', !r.stdout.includes('points would be dropped'))
}

// --- dry-run on the backlog fixture: link direction and label hygiene ---
{
  const backlogMini = join(FIXTURES, 'backlog-mini.md')
  const r = run(['dry-run', backlogMini], {})
  check('backlog dry-run exits 0', r.code === 0)
  // E01-F2 declares 'depends on: E01-F1', so the dependent (F2) is the
  // blocked one. The reversed sentence was a real rendering bug.
  check('link direction: dependent is the blocked one', r.stdout.includes('E01-F2 is blocked by E01-F1'))
  check('link direction: never reversed', !r.stdout.includes('E01-F1 is blocked by E01-F2'))
  check('comma stripped from discipline label', r.stdout.includes('iOS-Backend-and-Product'))
  check('no comma-bearing label emitted', !r.stdout.includes('iOS,-Backend'))
  check('backlog dry-run no state file', !existsSync(`${backlogMini}.sync-state.json`))
}

// --- create without --execute: dry run, exit 2, no state file ---
{
  const r = run(['create', v3Valid], {})
  check('create-without-execute exits 2', r.code === 2)
  check('create-without-execute says NOT CREATED', r.stdout.includes('NOT CREATED'))
  check('create-without-execute no state file', !existsSync(`${v3Valid}.sync-state.json`))
}

// --- create --execute with no config: exit 1, names missing vars ---
{
  const env = {
    JIRA_BASE_URL: '',
    JIRA_EMAIL: '',
    JIRA_API_TOKEN: '',
    JIRA_PROJECT_KEY: '',
  }
  const r = run(['create', v3Valid, '--execute'], env)
  check('create-execute-no-config exits 1', r.code === 1)
  const out = r.stdout + r.stderr
  check('create-execute-no-config names missing vars', /JIRA_BASE_URL|JIRA_EMAIL|JIRA_API_TOKEN|JIRA_PROJECT_KEY/.test(out))
  check('create-execute-no-config no state file', !existsSync(`${v3Valid}.sync-state.json`))
}

// --- preflight on a malformed fixture: exit 1, rule name present ---
{
  const r = run(['preflight', v3MissingAsA], {})
  check('preflight malformed exits 1', r.code === 1)
  const out = r.stdout + r.stderr
  check('preflight malformed names missing-as-a rule', out.includes('missing-as-a'))
}

// --- usage: no command -> usage text, exit 2 ---
{
  const r = run([], {})
  check('no-command exits 2', r.code === 2)
  check('no-command prints usage', /usage/i.test(r.stdout + r.stderr))
}

if (failures > 0) {
  process.stderr.write(`\ntest-cli: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-cli: all assertions passed\n')
process.exit(0)
