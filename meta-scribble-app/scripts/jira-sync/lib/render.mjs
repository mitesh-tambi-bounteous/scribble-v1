// render.mjs -- turns a ParseResult + plan + state into the human-readable
// dry-run artifact. This is prose Rob reads before filing 18 epics and 90
// features into a live Jira project, not a machine format: no JSON here.
//
// Pure and network-free by construction: no import in this file reaches
// fs, fetch, or lib/jira.mjs, so importing render.mjs can never trigger I/O.

import { ROUGH_POINTS_LABEL } from './points.mjs'

const MAX_SUMMARY_WIDTH = 100
const MAX_LINES = 20000 // Power-of-10 bound: this is a report, not a stream

function wrap(text) {
  if (typeof text !== 'string') return ''
  if (text.length <= MAX_SUMMARY_WIDTH) return text
  return `${text.slice(0, MAX_SUMMARY_WIDTH - 3)}...`
}

function labelsLine(issue) {
  return issue.labels && issue.labels.length > 0 ? issue.labels.join(', ') : '(none)'
}

function detailLine(issue) {
  const parts = []
  parts.push(`labels: ${labelsLine(issue)}`)
  if (issue.points !== null) parts.push(`points: ${issue.points}`)
  if (issue.status !== null) {
    parts.push(`status: ${issue.status} (reported only)`)
  }
  return parts.join(' | ')
}

function parentRefLabel(parentRef, keyByStable) {
  if (!parentRef) return null
  if (parentRef.jiraKey) return parentRef.jiraKey
  if (parentRef.stableKey) return keyByStable.get(parentRef.stableKey) ?? parentRef.stableKey
  return null
}

function renderCreate(action, index, keyByStable) {
  const issue = action.issue
  const isEpic = action.op === 'create-epic'
  const indent = isEpic ? '' : '  '
  const kindLabel = isEpic ? 'Epic' : 'Story'
  const parentLabel = !isEpic ? parentRefLabel(action.parentRef, keyByStable) : null
  const parentNote = parentLabel ? `  (parent: -> ${parentLabel})` : ''
  const lines = []
  lines.push(`${index}.${indent} CREATE ${kindLabel} "${wrap(issue.summary)}"${parentNote}`)
  lines.push(`${indent}     ${detailLine(issue)}`)
  return lines
}

function renderSkip(action, index) {
  return [`${index}.   SKIP  "${wrap(action.issue ? action.issue.summary : action.stableKey)}" -- already created as ${action.jiraKey}`]
}

export function renderDryRun({ parseResult, plan, state, fileName }) {
  if (!parseResult || !Array.isArray(parseResult.issues)) {
    throw new TypeError('renderDryRun: parseResult with issues[] is required')
  }
  if (!Array.isArray(plan)) {
    throw new TypeError('renderDryRun: plan must be an array of actions')
  }
  const stateKeys = state && state.created ? Object.keys(state.created) : []
  const epics = parseResult.issues.filter((i) => i.kind === 'epic')
  const stories = parseResult.issues.filter((i) => i.kind === 'story')

  const out = []
  out.push(`input file: ${fileName}`)
  out.push(`detected format: ${parseResult.format}`)
  out.push(parseResult.epicName ? `epic name: ${parseResult.epicName}` : `epic count: ${epics.length}`)
  out.push(`story/feature count: ${stories.length}`)
  out.push(`state file: ${state && state.path ? state.path : '(none supplied)'} (${stateKeys.length} key(s) already recorded)`)
  out.push('')
  out.push('creation order:')

  // keyByStable resolves parentRef display text for children of already-planned epics.
  const keyByStable = new Map()
  for (const [key, rec] of Object.entries(state && state.created ? state.created : {})) {
    keyByStable.set(key, rec.jiraKey)
  }

  let createCount = 0
  let epicCreateCount = 0
  let storyCreateCount = 0
  let skipCount = 0
  const linkLines = []
  const attachCandidates = []

  const cap = 100000
  if (plan.length > cap) throw new Error('renderDryRun: plan too large')

  let index = 0
  for (const action of plan) {
    if (action.op === 'create-epic' || action.op === 'create-story') {
      index += 1
      out.push(...renderCreate(action, index, keyByStable))
      createCount += 1
      if (action.op === 'create-epic') epicCreateCount += 1
      else storyCreateCount += 1
      if (action.stableKey) keyByStable.set(action.stableKey, `item ${index}`)
      if (action.issue && typeof action.issue.description === 'string') {
        const refs = action.issue.description.match(/!?\[[^\]]*\]\([^)\s]+\)/g) || []
        for (const ref of refs) {
          const m = ref.match(/\(([^)]+)\)/)
          if (m && !/^[a-z]+:\/\//i.test(m[1]) && /\.[a-zA-Z0-9]+$/.test(m[1])) {
            attachCandidates.push(`${action.issue.summary} -> ${m[1]}`)
          }
        }
      }
    } else if (action.op === 'skip') {
      index += 1
      out.push(...renderSkip(action, index))
      skipCount += 1
    } else if (action.op === 'link-blocks' && action.links) {
      const links = Array.isArray(action.links) ? action.links : [action.links]
      for (const link of links) {
        // plan.mjs link semantics: `from` is the dependent item, so the
        // sentence reads "<from> is blocked by <to>".
        linkLines.push(`${link.from} is blocked by ${link.to}`)
      }
    }
  }

  out.push('')
  if (linkLines.length > 0) {
    out.push('link plan:')
    for (const l of linkLines) out.push(`  ${l}`)
  } else {
    out.push('link plan: (none)')
  }

  out.push('')
  if (attachCandidates.length > 0) {
    out.push('attachment candidates (local file references found in descriptions):')
    for (const a of attachCandidates) out.push(`  ${a}`)
  } else {
    out.push('attachment candidates: (none)')
  }

  out.push('')
  out.push(`summary: ${createCount} to create (${epicCreateCount} epics, ${storyCreateCount} stories), ${skipCount} skipped, ${linkLines.length} links`)
  if (parseResult.issues.some((i) => Array.isArray(i.labels) && i.labels.includes(ROUGH_POINTS_LABEL))) {
    out.push(`point values tagged '${ROUGH_POINTS_LABEL}' are a rough first-pass difficulty guess derived from size; the team is expected to re-point them`)
  }
  out.push('status values are reported only: issues land in the default column; this tool never transitions issues')
  out.push('idempotency key: stableKey(issue) -- the item id for backlog items, else the whitespace-normalized lowercased summary')
  out.push('DRY RUN. Nothing was sent to Jira.')

  if (out.length > MAX_LINES) throw new Error('renderDryRun: output too large')
  return `${out.join('\n')}\n`
}
