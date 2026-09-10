// create.mjs -- walks a plan against live Jira, filing issues and links.
//
// The single hard invariant: a partially successful run never exits 0. Every
// successful createIssue is followed immediately by saveCreated before the
// next network call, so state on disk always matches what Jira actually has,
// and a killed or failed run can always be resumed by re-running the same
// command (the plan will skip whatever state already holds).
//
// runCreate never transitions or edits existing issues; it only creates new
// ones and links them.

import { PRIORITY_MAP } from './model.mjs'
import { mdToAdf } from './adf.mjs'
import { saveCreated } from './state.mjs'
import { buildPlan, issuesForPlan } from './plan.mjs'

const MAX_PLAN_LENGTH = 20000
const JIRA_KEY_RE = /^[A-Z][A-Z0-9]+-\d+$/

function resumeCommand(inputFile) {
  return `node scripts/jira-sync/jira-sync.mjs create ${inputFile} --execute`
}

function buildFields({ issue, config, parentJiraKey, log }) {
  const isEpic = issue.kind === 'epic'
  const fields = {
    project: { key: config.projectKey },
    summary: issue.summary,
    issuetype: { name: isEpic ? config.epicIssueType : config.storyIssueType },
    description: mdToAdf(issue.description ?? ''),
  }
  if (issue.labels && issue.labels.length > 0) {
    fields.labels = issue.labels.slice()
  }
  if (issue.priority !== null) {
    fields.priority = { name: PRIORITY_MAP[issue.priority] }
  }
  if (issue.points !== null) {
    if (config.storyPointsField) {
      fields[config.storyPointsField] = issue.points
    } else {
      log.error(
        `warning: points=${issue.points} on "${issue.summary}" but no JIRA_STORY_POINTS_FIELD configured; filing without story points`
      )
    }
  }
  if (parentJiraKey) {
    fields.parent = { key: parentJiraKey }
  }
  return fields
}

function resolveParentKey(parentRef, resolved) {
  if (!parentRef) return null
  if (parentRef.jiraKey) return parentRef.jiraKey
  if (parentRef.stableKey) {
    const key = resolved.get(parentRef.stableKey)
    if (!key) {
      throw new Error(`create: parent stableKey "${parentRef.stableKey}" has no resolved Jira key`)
    }
    return key
  }
  throw new Error('create: malformed parentRef')
}

export async function runCreate({ parseResult, config, state, statePath, epicKey, client, log = console }) {
  if (!config) throw new TypeError('runCreate: config is required')
  if (!client) throw new TypeError('runCreate: client is required')
  if (!state || typeof state.created !== 'object') throw new TypeError('runCreate: state is required')
  if (typeof statePath !== 'string' || statePath === '') throw new TypeError('runCreate: statePath is required')

  const inputFile = statePath.endsWith('.sync-state.json')
    ? statePath.slice(0, -'.sync-state.json'.length)
    : statePath
  const plan = buildPlan(issuesForPlan(parseResult, epicKey ?? null), { epicKey: epicKey ?? null, state })

  const created = []
  let failed = null

  // Step 1: prove the credentials work before blaming the parser.
  try {
    await client.myself()
  } catch (err) {
    log.error(`credentials failed, nothing attempted: ${err.message}`)
    return { created, skipped: 0, failed: null, exitCode: 1 }
  }

  // Step 2: verify the project resolves and both issue type names exist on it.
  let project
  try {
    project = await client.projectMeta(config.projectKey)
  } catch (err) {
    log.error(`project lookup failed, nothing attempted: ${err.message}`)
    return { created, skipped: 0, failed: null, exitCode: 1 }
  }
  const issueTypeNames = new Set((project.issueTypes ?? []).map((t) => t.name))
  const missingTypes = [config.epicIssueType, config.storyIssueType].filter(
    (name) => !issueTypeNames.has(name)
  )
  if (missingTypes.length > 0) {
    log.error(`project "${config.projectKey}" is missing issue type(s): ${missingTypes.join(', ')}`)
    return { created, skipped: 0, failed: null, exitCode: 1 }
  }

  if (!Array.isArray(plan) || plan.length > MAX_PLAN_LENGTH) {
    throw new Error('runCreate: parseResult.plan must be an array within bounds')
  }

  // Step 3: live duplicate check against every planned non-skip summary.
  const plannedCreates = plan.filter((a) => a.op === 'create-epic' || a.op === 'create-story')
  let existingSummaries
  try {
    existingSummaries = await client.searchSummaries(config.projectKey)
  } catch (err) {
    log.error(`duplicate check failed, nothing attempted: ${err.message}`)
    return { created, skipped: 0, failed: null, exitCode: 1 }
  }
  const existingSet = new Set(existingSummaries)
  const collisions = plannedCreates.filter((a) => existingSet.has(a.issue.summary.toLowerCase()))
  if (collisions.length > 0) {
    for (const c of collisions) {
      log.error(`duplicate in Jira, refusing to create: "${c.issue.summary}"`)
    }
    return { created, skipped: 0, failed: null, exitCode: 1 }
  }

  // Step 4: walk the plan, creating and journaling one issue at a time.
  const resolved = new Map() // stableKey -> jiraKey, this run + prior state
  for (const [key, entry] of Object.entries(state.created)) {
    resolved.set(key, entry.jiraKey)
  }

  let skipped = 0
  let stoppedIndex = -1
  for (let i = 0; i < plan.length; i += 1) {
    const action = plan[i]
    if (action.op === 'skip') {
      skipped += 1
      resolved.set(action.stableKey, action.jiraKey)
      continue
    }
    if (action.op !== 'create-epic' && action.op !== 'create-story') continue

    let parentJiraKey
    try {
      parentJiraKey = resolveParentKey(action.parentRef, resolved)
    } catch (err) {
      failed = { stableKey: action.stableKey, error: err.message }
      stoppedIndex = i
      break
    }
    const fields = buildFields({ issue: action.issue, config, parentJiraKey, log })
    let jiraKey
    try {
      jiraKey = await client.createIssue(fields)
    } catch (err) {
      failed = { stableKey: action.stableKey, error: err.message }
      stoppedIndex = i
      break
    }
    saveCreated(statePath, state, action.stableKey, jiraKey)
    resolved.set(action.stableKey, jiraKey)
    created.push({ stableKey: action.stableKey, jiraKey })
  }

  if (failed) {
    const remaining = plan.slice(stoppedIndex + 1).filter(
      (a) => a.op === 'create-epic' || a.op === 'create-story'
    ).length
    log.error(`created so far: ${created.map((c) => c.jiraKey).join(', ') || '(none)'}`)
    log.error(`failed on "${failed.stableKey}": ${failed.error}`)
    log.error(`remaining not attempted: ${remaining}`)
    log.error(`resume with: ${resumeCommand(inputFile)}`)
    return { created, skipped, failed, exitCode: 3 }
  }

  // Step 5: link-blocks, resolved via state plus this run.
  const linkFailures = []
  for (const action of plan) {
    if (action.op !== 'link-blocks') continue
    const { from, to, type } = action.links
    const inwardKey = resolved.get(from) ?? (JIRA_KEY_RE.test(from) ? from : null)
    const outwardKey = resolved.get(to) ?? (JIRA_KEY_RE.test(to) ? to : null)
    if (!inwardKey || !outwardKey) {
      linkFailures.push({ from, to, error: 'link endpoint has no resolved Jira key' })
      continue
    }
    try {
      await client.linkIssues({ inwardKey, outwardKey, type: 'Blocks' })
    } catch (err) {
      linkFailures.push({ from, to, error: err.message })
    }
  }
  if (linkFailures.length > 0) {
    for (const lf of linkFailures) {
      log.error(`link failed "${lf.from}" is blocked by "${lf.to}": ${lf.error}`)
    }
    return { created, skipped, failed: null, exitCode: 3 }
  }

  // Step 6: done.
  for (const c of created) {
    log.log(`created ${c.jiraKey} (${c.stableKey})`)
  }
  log.log(`created ${created.length}, skipped ${skipped}`)
  return { created, skipped, failed: null, exitCode: 0 }
}
