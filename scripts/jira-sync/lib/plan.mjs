// plan.mjs -- turns parsed issues into an ordered Action[] for create.mjs.
//
// Never reorders beyond parents-before-children: document order is the filing
// order. A parent that appears after its child in the input is a bug in the
// source file, not something this tool silently fixes, so it throws.
//
// Contract note (ambiguity in the design doc, resolved here): buildPlan takes
// only `issues`, not the full ParseResult, so it has no epicName string when
// epicKey is null. For V3 input in "no epic key" mode, the caller must include
// a kind:'epic' Issue (built via makeIssue from epicName) as an element of the
// issues array; buildPlan treats the first such issue as the parent for every
// story whose parentId is '__EPIC__'. This keeps buildPlan decoupled from the
// parser's ParseResult shape.

import { stableKey, makeIssue } from './model.mjs'

const MAX_ISSUES = 10000
const JIRA_KEY_RE = /^[A-Z][A-Z0-9]+-\d+$/

export function buildPlan(issues, { epicKey = null, state } = {}) {
  if (!Array.isArray(issues)) {
    throw new TypeError('buildPlan: issues must be an array')
  }
  if (issues.length > MAX_ISSUES) {
    throw new Error(`buildPlan: too many issues (max ${MAX_ISSUES})`)
  }
  if (!state || typeof state.created !== 'object' || state.created === null) {
    throw new TypeError('buildPlan: state with a created map is required')
  }

  const created = state.created
  const byId = new Map()
  for (const issue of issues) {
    if (typeof issue.id === 'string' && issue.id.length > 0) byId.set(issue.id, issue)
  }

  const actions = []
  const placed = new Set()

  for (const issue of issues) {
    const key = stableKey(issue)
    if (created[key]) {
      actions.push({
        op: 'skip',
        issue,
        stableKey: key,
        jiraKey: created[key].jiraKey,
        reason: `already created as ${created[key].jiraKey}`,
      })
      placed.add(key)
      continue
    }

    if (issue.kind === 'epic') {
      actions.push({ op: 'create-epic', issue, stableKey: key })
      placed.add(key)
      continue
    }

    let parentRef = null
    if (issue.parentId === '__EPIC__') {
      if (epicKey !== null) {
        parentRef = { jiraKey: epicKey }
      } else {
        const epicIssue = issues.find((x) => x.kind === 'epic')
        if (!epicIssue) {
          throw new Error(
            `buildPlan: no epicKey supplied and no epic issue present for story "${issue.summary}"`
          )
        }
        const epicStable = stableKey(epicIssue)
        if (!placed.has(epicStable)) {
          throw new Error(
            `buildPlan: epic for story "${issue.summary}" must precede it in document order`
          )
        }
        parentRef = { stableKey: epicStable }
      }
    } else if (issue.parentId !== null) {
      const parentIssue = byId.get(issue.parentId)
      if (parentIssue) {
        const parentStable = stableKey(parentIssue)
        if (!placed.has(parentStable)) {
          throw new Error(
            `buildPlan: parent "${issue.parentId}" for "${issue.summary}" must precede it in document order`
          )
        }
        parentRef = { stableKey: parentStable }
      } else if (created[issue.parentId]) {
        parentRef = { jiraKey: created[issue.parentId].jiraKey }
      } else {
        throw new Error(
          `buildPlan: parent "${issue.parentId}" for "${issue.summary}" not found in file or state`
        )
      }
    }

    actions.push({ op: 'create-story', issue, stableKey: key, parentRef })
    placed.add(key)
  }

  for (const issue of issues) {
    if (!Array.isArray(issue.dependsOn) || issue.dependsOn.length === 0) continue
    const fromKey = stableKey(issue)
    for (const targetId of issue.dependsOn) {
      let toKey = null
      const targetIssue = byId.get(targetId)
      if (targetIssue) {
        toKey = stableKey(targetIssue)
        if (!placed.has(toKey)) {
          throw new Error(
            `buildPlan: dependsOn target "${targetId}" for "${issue.summary}" is not placed before use`
          )
        }
      } else if (created[targetId]) {
        toKey = targetId
      } else if (JIRA_KEY_RE.test(targetId)) {
        toKey = targetId
      } else {
        throw new Error(
          `buildPlan: dependsOn target "${targetId}" for "${issue.summary}" not found in file, state, or as a Jira key`
        )
      }
      actions.push({ op: 'link-blocks', links: { from: fromKey, to: toKey, type: 'is blocked by' } })
    }
  }

  return actions
}

// issuesForPlan's contract (see the note above): when no --epic-key is given
// and the parsed file carries no epic issue of its own (the V3 case), the
// caller must synthesize one so buildPlan has a parent for stories whose
// parentId is '__EPIC__'.
export function issuesForPlan(parseResult, epicKey) {
  const hasEpicIssue = parseResult.issues.some((i) => i.kind === 'epic')
  if (epicKey !== null || hasEpicIssue || !parseResult.epicName) {
    return parseResult.issues
  }
  const epicIssue = makeIssue({
    kind: 'epic',
    summary: parseResult.epicName,
    parentId: null,
    source: { file: parseResult.issues[0]?.source?.file ?? '(unknown)', line: 1 },
  })
  return [epicIssue, ...parseResult.issues]
}
