#!/usr/bin/env node
// jira-sync.mjs -- CLI entry point for the story-ac-kit Jira filing pipeline.
//
// Dry-run and preflight paths are statically incapable of network I/O: this
// file never imports lib/jira.mjs or lib/create.mjs at top level. Those are
// pulled in with a dynamic import ONLY inside the --execute branch of
// runCreateCommand / runAttachCommand, so `node --check` and a static import
// graph both prove the dry-run path cannot reach fetch.
//
// runCreate/runPreflight never call process.exit; this file owns exiting.

import { existsSync, statSync, readFileSync } from 'node:fs'
import { extname } from 'node:path'

import { parseFile } from './lib/parse.mjs'
import { runPreflight } from './lib/preflight.mjs'
import { buildPlan, issuesForPlan } from './lib/plan.mjs'
import { statePathFor, loadState } from './lib/state.mjs'
import { renderDryRun } from './lib/render.mjs'

const USAGE = `usage: node scripts/jira-sync/jira-sync.mjs <command> <file> [options]

commands:
  preflight <file>   validate a story file, report problems, exit 0 iff no errors
  dry-run <file>      preflight then print the plan a human approves; never writes
  create <file>       file epics/stories in Jira (requires --execute; else dry-run + exit 2)
  attach <file>       attach local files referenced in descriptions (requires --execute)

options:
  --epic-key KEY      file stories under an existing epic instead of creating one
  --existing FILE     JSON array of existing Jira summaries, for the offline dup check
  --config FILE       JSON config file (env vars still override)
  --state FILE        state journal path (default: <file>.sync-state.json)
  --patterns FILE     internal-content patterns file (default: internal-patterns.json)
  --execute           actually write to Jira (create/attach only)
`

const KNOWN_COMMANDS = ['preflight', 'dry-run', 'create', 'attach']
const KNOWN_FLAGS_WITH_VALUE = ['--epic-key', '--existing', '--config', '--state', '--patterns']
const KNOWN_FLAGS_BOOL = ['--execute']

function usageExit(message) {
  if (message) process.stderr.write(`error: ${message}\n\n`)
  process.stdout.write(USAGE)
  process.exit(2)
}

function parseArgs(argv) {
  const opts = { command: null, file: null, execute: false }
  const cap = 100
  if (argv.length > cap) usageExit('too many arguments')
  let i = 0
  let steps = 0
  while (i < argv.length) {
    steps += 1
    if (steps > cap) usageExit('too many arguments')
    const tok = argv[i]
    if (opts.command === null) {
      opts.command = tok
      i += 1
      continue
    }
    if (opts.file === null && !tok.startsWith('--')) {
      opts.file = tok
      i += 1
      continue
    }
    if (KNOWN_FLAGS_BOOL.includes(tok)) {
      opts[tok.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())] = true
      i += 1
      continue
    }
    if (KNOWN_FLAGS_WITH_VALUE.includes(tok)) {
      const value = argv[i + 1]
      if (value === undefined) usageExit(`${tok} requires a value`)
      const key = tok.slice(2).replace(/-([a-z])/g, (_, c) => c.toUpperCase())
      opts[key] = value
      i += 2
      continue
    }
    usageExit(`unknown option: ${tok}`)
  }
  return opts
}

function assertInputFile(file) {
  if (!file) usageExit('a file argument is required')
  if (!existsSync(file)) usageExit(`file not found: ${file}`)
  const st = statSync(file)
  if (!st.isFile()) usageExit(`not a regular file: ${file}`)
  if (extname(file) !== '.md') usageExit(`input file must be .md: ${file}`)
}

function readExistingSummaries(existingPath) {
  if (!existingPath) return undefined
  const raw = readFileSync(existingPath, 'utf8')
  const parsed = JSON.parse(raw)
  if (!Array.isArray(parsed)) throw new Error(`--existing file must be a JSON array: ${existingPath}`)
  return parsed
}

function loadInternalPatternsSafe(patternsPath) {
  // Dynamic import kept local to this helper: preflight/dry-run never need
  // network capability, but internal-gate.mjs is filesystem-only, so a
  // static import here is fine (it does not touch fetch or jira.mjs).
  return import('./lib/internal-gate.mjs').then((mod) => mod.loadInternalPatterns(patternsPath))
}

function printPreflightReport({ file, parseResult, preflightResult }) {
  const lines = []
  lines.push(`file: ${file}`)
  lines.push(`detected format: ${parseResult.format}`)
  lines.push(`epic name: ${parseResult.epicName ?? '(none)'}`)
  const epics = parseResult.issues.filter((i) => i.kind === 'epic').length
  const stories = parseResult.issues.filter((i) => i.kind === 'story').length
  lines.push(`issues: ${epics} epic(s), ${stories} story/feature(s)`)
  lines.push('summaries:')
  for (const issue of parseResult.issues) lines.push(`  - ${issue.summary}`)
  const problems = preflightResult.problems
  const errors = problems.filter((p) => p.severity === 'error')
  const warnings = problems.filter((p) => p.severity === 'warning')
  // Some problems (the internal gate's) already embed file:line in the
  // message so it survives callers that print message alone; avoid doubling.
  const problemLine = (p) => {
    const prefix = `${p.file}:${p.line}: `
    const body = p.message.startsWith(prefix) ? p.message.slice(prefix.length) : p.message
    return `  ${p.file}:${p.line}: [${p.rule}] ${body}`
  }
  lines.push(`errors: ${errors.length}`)
  for (const p of errors) lines.push(problemLine(p))
  lines.push(`warnings: ${warnings.length}`)
  for (const p of warnings) lines.push(problemLine(p))
  process.stdout.write(`${lines.join('\n')}\n`)
  return errors.length === 0
}

async function runPreflightPipeline(opts) {
  const text = readFileSync(opts.file, 'utf8')
  const parseResult = parseFile(text, { fileName: opts.file })
  const existingSummaries = readExistingSummaries(opts.existing)
  const internalPatterns = await loadInternalPatternsSafe(opts.patterns)
  // rawText lets the internal gate name the exact offending line, not just
  // the item heading.
  const preflightResult = runPreflight(parseResult, {
    existingSummaries,
    internalPatterns,
    rawText: text,
    fileName: opts.file,
  })
  return { parseResult, preflightResult }
}

async function cmdPreflight(opts) {
  const { parseResult, preflightResult } = await runPreflightPipeline(opts)
  const passed = printPreflightReport({ file: opts.file, parseResult, preflightResult })
  process.exit(passed ? 0 : 1)
}

// Resolves the story-points field purely for the dry-run warning: env wins,
// falling back to a --config file's storyPointsField. Deliberately does not
// go through lib/config.mjs's full loadConfig, since that returns null
// whenever any *other* required field (base URL, email, token, project key)
// is missing -- which would make this warning fire even when the points
// field itself is configured. Reads the config file directly (fs-only, no
// network) and treats any read/parse error as "unconfigured".
function resolveStoryPointsFieldForWarning(configPath) {
  const envVal = process.env.JIRA_STORY_POINTS_FIELD
  if (typeof envVal === 'string') return envVal.length > 0 ? envVal : null
  if (!configPath) return null
  try {
    const raw = readFileSync(configPath, 'utf8')
    const parsed = JSON.parse(raw)
    return typeof parsed.storyPointsField === 'string' && parsed.storyPointsField.length > 0
      ? parsed.storyPointsField
      : null
  } catch {
    return null
  }
}

async function buildDryRunOutput(opts) {
  const { parseResult, preflightResult } = await runPreflightPipeline(opts)
  const errors = preflightResult.problems.filter((p) => p.severity === 'error')
  if (errors.length > 0) {
    printPreflightReport({ file: opts.file, parseResult, preflightResult })
    return { ok: false, output: null }
  }
  const statePath = opts.state ?? statePathFor(opts.file)
  const state = loadState(statePath)
  state.path = statePath
  const epicKey = opts.epicKey ?? null
  const plan = buildPlan(issuesForPlan(parseResult, epicKey), { epicKey, state })
  const rendered = renderDryRun({ parseResult, plan, state, fileName: opts.file })
  const hasToken = typeof process.env.JIRA_API_TOKEN === 'string' && process.env.JIRA_API_TOKEN.length > 0
  const hasBase = typeof process.env.JIRA_BASE_URL === 'string' && process.env.JIRA_BASE_URL.length > 0
  const capLine = hasToken && hasBase
    ? 'write capability: configured (unused in dry run)'
    : 'write capability: none configured'

  const pointedCount = plan.filter(
    (a) => (a.op === 'create-epic' || a.op === 'create-story') && a.issue.points !== null
  ).length
  const storyPointsField = resolveStoryPointsFieldForWarning(opts.config ?? null)
  const pointsWarningLine =
    pointedCount > 0 && !storyPointsField
      ? `warning: ${pointedCount} issue(s) carry points but no story-points field is configured (JIRA_STORY_POINTS_FIELD); points would be dropped on create\n`
      : ''
  return { ok: true, output: `${rendered}${capLine}\n${pointsWarningLine}` }
}

async function cmdDryRun(opts) {
  const result = await buildDryRunOutput(opts)
  if (!result.ok) process.exit(1)
  process.stdout.write(result.output)
  process.exit(0)
}

async function cmdCreate(opts) {
  const { parseResult, preflightResult } = await runPreflightPipeline(opts)
  const errors = preflightResult.problems.filter((p) => p.severity === 'error')
  if (errors.length > 0) {
    printPreflightReport({ file: opts.file, parseResult, preflightResult })
    process.exit(1)
  }
  if (!opts.execute) {
    const result = await buildDryRunOutput(opts)
    if (!result.ok) process.exit(1)
    process.stdout.write(result.output)
    process.stdout.write('NOT CREATED. This was a dry run. Add --execute to file these issues.\n')
    process.exit(2)
  }
  // --execute branch only: this is the sole place lib/config.mjs, lib/jira.mjs,
  // and lib/create.mjs are reachable, so the dry-run path above never loads them.
  const { loadConfig } = await import('./lib/config.mjs')
  const { makeJiraClient } = await import('./lib/jira.mjs')
  const { runCreate } = await import('./lib/create.mjs')

  const config = loadConfig({ configPath: opts.config ?? null })
  if (config === null) {
    const missing = ['JIRA_BASE_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN', 'JIRA_PROJECT_KEY']
      .filter((name) => !process.env[name] || process.env[name] === '')
    process.stderr.write(`error: missing Jira config: ${missing.join(', ')}\n`)
    process.exit(1)
  }

  const statePath = opts.state ?? statePathFor(opts.file)
  const state = loadState(statePath)
  const client = makeJiraClient({ config })
  const result = await runCreate({
    parseResult,
    config,
    state,
    statePath,
    epicKey: opts.epicKey ?? null,
    client,
    log: console,
  })
  for (const c of result.created) process.stdout.write(`created: ${c.stableKey} -> ${c.jiraKey}\n`)
  process.stdout.write(`skipped: ${result.skipped}\n`)
  if (result.failed) {
    process.stderr.write(`failed: ${result.failed.stableKey}: ${result.failed.error}\n`)
    process.stderr.write(`resume: re-run the same command; the state journal skips what already landed.\n`)
  }
  process.exit(result.exitCode)
}

const ATTACH_REF_RE = /!?\[[^\]]*\]\(([^)\s]+)\)/g

function findAttachRefs(text) {
  const refs = []
  const cap = 5000
  let match
  let count = 0
  ATTACH_REF_RE.lastIndex = 0
  while ((match = ATTACH_REF_RE.exec(text)) !== null) {
    count += 1
    if (count > cap) throw new Error('findAttachRefs: too many references')
    const path = match[1]
    if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(path) && /\.[a-zA-Z0-9]+$/.test(path)) {
      refs.push(path)
    }
  }
  return refs
}

async function cmdAttach(opts) {
  const { parseResult, preflightResult } = await runPreflightPipeline(opts)
  const errors = preflightResult.problems.filter((p) => p.severity === 'error')
  if (errors.length > 0) {
    printPreflightReport({ file: opts.file, parseResult, preflightResult })
    process.exit(1)
  }
  const statePath = opts.state ?? statePathFor(opts.file)
  const state = loadState(statePath)

  const { stableKey } = await import('./lib/model.mjs')
  const plan = []
  for (const issue of parseResult.issues) {
    const refs = findAttachRefs(issue.description)
    if (refs.length === 0) continue
    const key = stableKey(issue)
    const rec = state.created[key]
    if (!rec) {
      process.stderr.write(`error: no Jira key recorded for "${issue.summary}" (run create first)\n`)
      process.exit(1)
    }
    for (const ref of refs) plan.push({ summary: issue.summary, jiraKey: rec.jiraKey, path: ref, stableKey: key })
  }

  if (!opts.execute) {
    process.stdout.write('would attach:\n')
    for (const p of plan) process.stdout.write(`  ${p.jiraKey} (${p.summary}): ${p.path}\n`)
    process.stdout.write('NOT ATTACHED. This was a dry run. Add --execute to attach these files.\n')
    process.exit(2)
  }

  // --execute branch only: this is the sole place lib/config.mjs, lib/jira.mjs,
  // and lib/attach.mjs are reachable for the attach command.
  const { loadConfig } = await import('./lib/config.mjs')
  const { makeJiraClient } = await import('./lib/jira.mjs')
  const { runAttach } = await import('./lib/attach.mjs')
  const config = loadConfig({ configPath: opts.config ?? null })
  if (config === null) {
    process.stderr.write('error: missing Jira config, cannot attach\n')
    process.exit(1)
  }
  const client = makeJiraClient({ config })
  const result = await runAttach({ candidates: plan, state, statePath, client, log: console })
  process.exit(result.exitCode)
}

async function main() {
  const argv = process.argv.slice(2)
  if (argv.length === 0) usageExit(null)
  const opts = parseArgs(argv)
  if (opts.command === '-h' || opts.command === '--help') {
    process.stdout.write(USAGE)
    process.exit(0)
  }
  if (!KNOWN_COMMANDS.includes(opts.command)) usageExit(`unknown command: ${opts.command}`)
  assertInputFile(opts.file)

  if (opts.command === 'preflight') return cmdPreflight(opts)
  if (opts.command === 'dry-run') return cmdDryRun(opts)
  if (opts.command === 'create') return cmdCreate(opts)
  if (opts.command === 'attach') return cmdAttach(opts)
  usageExit(`unknown command: ${opts.command}`)
}

main().catch((err) => {
  process.stderr.write(`error: ${(err && err.message) || String(err)}\n`)
  process.exit(1)
})
