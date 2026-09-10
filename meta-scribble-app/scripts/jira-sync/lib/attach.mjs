// attach.mjs -- walks a resolved attach plan against a Jira client, journaling
// each successful attach immediately (same discipline as create.mjs). Stays
// decoupled from parseResult/Issue shapes and from lib/jira.mjs: it only
// takes a `client` object structurally, so it carries no static dependency on
// the network client.

import { saveAttached } from './state.mjs'

const MAX_CANDIDATES = 10000

function resumeCommand(inputFile) {
  return `node scripts/jira-sync/jira-sync.mjs attach ${inputFile} --execute`
}

export async function runAttach({ candidates, state, statePath, client, log = console }) {
  if (!Array.isArray(candidates)) {
    throw new TypeError('runAttach: candidates must be an array')
  }
  if (candidates.length > MAX_CANDIDATES) {
    throw new Error(`runAttach: too many candidates (max ${MAX_CANDIDATES})`)
  }
  if (!state || typeof state !== 'object') {
    throw new TypeError('runAttach: state is required')
  }
  if (!state.attached || typeof state.attached !== 'object') state.attached = {}
  if (typeof statePath !== 'string' || statePath === '') {
    throw new TypeError('runAttach: statePath is required')
  }
  if (!client || typeof client.attach !== 'function') {
    throw new TypeError('runAttach: client with an attach(key, path) method is required')
  }

  const inputFile = statePath.endsWith('.sync-state.json')
    ? statePath.slice(0, -'.sync-state.json'.length)
    : statePath

  const attached = []
  let failed = null

  for (let i = 0; i < candidates.length; i += 1) {
    const c = candidates[i]
    const key = `${c.stableKey}::${c.path}`
    if (state.attached[key]) {
      log.log(`SKIP (already attached): ${c.jiraKey} <- ${c.path}`)
      continue
    }
    try {
      await client.attach(c.jiraKey, c.path)
    } catch (err) {
      failed = { stableKey: c.stableKey, path: c.path, error: err.message }
      const remaining = candidates.length - (i + 1)
      log.error(`attached so far: ${attached.map((a) => `${a.jiraKey} <- ${a.path}`).join(', ') || '(none)'}`)
      log.error(`failed on "${c.jiraKey}" <- "${c.path}": ${err.message}`)
      log.error(`remaining not attempted: ${remaining}`)
      log.error(`resume with: ${resumeCommand(inputFile)}`)
      return { attached, failed, exitCode: 3 }
    }
    saveAttached(statePath, state, key)
    log.log(`attached: ${c.jiraKey} <- ${c.path}`)
    attached.push({ stableKey: c.stableKey, jiraKey: c.jiraKey, path: c.path })
  }

  return { attached, failed: null, exitCode: 0 }
}
