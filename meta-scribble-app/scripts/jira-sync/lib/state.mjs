// state.mjs -- the resume journal. Idempotency key is stableKey(issue) (see
// model.mjs): backlog item id, or the normalized-summary for V3 stories.
//
// saveCreated rewrites the WHOLE state file after every single successful
// creation, via a tmp-file-then-rename so a process killed mid-write never
// leaves a half-written journal on disk. A run killed between two creations
// loses nothing: the prior creation is already durable.

import { readFileSync, writeFileSync, renameSync, existsSync } from 'node:fs'
import { dirname, join, basename } from 'node:path'

export function statePathFor(inputFile) {
  if (typeof inputFile !== 'string' || inputFile === '') {
    throw new TypeError('statePathFor: inputFile must be a non-empty string')
  }
  return `${inputFile}.sync-state.json`
}

export function loadState(path) {
  if (typeof path !== 'string' || path === '') {
    throw new TypeError('loadState: path must be a non-empty string')
  }
  if (!existsSync(path)) {
    return { created: {}, attached: {}, inputFile: null }
  }
  const raw = readFileSync(path, 'utf8')
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (err) {
    throw new Error(`loadState: corrupt state file ${path}: ${err.message}`)
  }
  if (!parsed || typeof parsed !== 'object' || typeof parsed.created !== 'object' || parsed.created === null) {
    throw new Error(`loadState: state file ${path} missing "created" object`)
  }
  const attached = parsed.attached && typeof parsed.attached === 'object' ? parsed.attached : {}
  return { created: parsed.created, attached, inputFile: parsed.inputFile ?? null }
}

export function saveCreated(path, state, stableKey, jiraKey) {
  if (typeof path !== 'string' || path === '') {
    throw new TypeError('saveCreated: path must be a non-empty string')
  }
  if (typeof stableKey !== 'string' || stableKey === '') {
    throw new TypeError('saveCreated: stableKey must be a non-empty string')
  }
  if (typeof jiraKey !== 'string' || jiraKey === '') {
    throw new TypeError('saveCreated: jiraKey must be a non-empty string')
  }
  const next = {
    created: { ...state.created, [stableKey]: { jiraKey, at: new Date().toISOString() } },
    attached: { ...(state.attached ?? {}) },
    inputFile: state.inputFile,
  }
  const dir = dirname(path)
  const tmpPath = join(dir, `.${basename(path)}.tmp-${process.pid}-${Date.now()}`)
  writeFileSync(tmpPath, JSON.stringify(next, null, 2))
  renameSync(tmpPath, path)
  state.created[stableKey] = next.created[stableKey]
  return state
}

// saveAttached mirrors saveCreated's atomic tmp-write-then-rename discipline:
// rewrite the whole state file (created + attached + inputFile) after every
// single successful attach, so a killed process never leaves attach state
// out of sync with what Jira actually has.
export function saveAttached(path, state, key) {
  if (typeof path !== 'string' || path === '') {
    throw new TypeError('saveAttached: path must be a non-empty string')
  }
  if (typeof key !== 'string' || key === '') {
    throw new TypeError('saveAttached: key must be a non-empty string')
  }
  const at = new Date().toISOString()
  const next = {
    created: { ...state.created },
    attached: { ...(state.attached ?? {}), [key]: { at } },
    inputFile: state.inputFile,
  }
  const dir = dirname(path)
  const tmpPath = join(dir, `.${basename(path)}.tmp-${process.pid}-${Date.now()}`)
  writeFileSync(tmpPath, JSON.stringify(next, null, 2))
  renameSync(tmpPath, path)
  if (!state.attached) state.attached = {}
  state.attached[key] = next.attached[key]
  return state
}
