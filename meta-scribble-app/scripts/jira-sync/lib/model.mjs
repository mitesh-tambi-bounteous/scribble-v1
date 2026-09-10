// model.mjs -- the shared issue model for the jira-sync scripts.
//
// Every module in scripts/jira-sync imports these shapes and helpers. The two
// load-bearing decisions live here so they cannot drift per-module:
//   1. Dash policy: em and en dashes are accepted on input and normalized to
//      ' -- ' on everything outbound. Both David's originals and this repo's
//      no-em-dash files parse.
//   2. Idempotency key: stableKey(issue) is the item id where the input format
//      carries one (backlog E01 / E01-F1), else the whitespace-normalized,
//      lowercased summary. The create step and its resume journal key off it.

export const ISSUE_KINDS = ['epic', 'story']
export const SEVERITIES = ['error', 'warning']

export const PRIORITY_MAP = {
  P0: 'Highest',
  P1: 'High',
  P2: 'Medium',
  P3: 'Low',
  P4: 'Lowest',
}

const EM_DASH = '\u2014'
const EN_DASH = '\u2013'
const DASH_RE = new RegExp(`\\s*[${EM_DASH}${EN_DASH}]\\s*`, 'g')

export function normalizeDashes(text) {
  if (typeof text !== 'string') {
    throw new TypeError('normalizeDashes: text must be a string')
  }
  return text.replace(DASH_RE, ' -- ')
}

export function countDashes(text) {
  if (typeof text !== 'string') return 0
  let count = 0
  for (const ch of text) {
    if (ch === EM_DASH || ch === EN_DASH) count += 1
  }
  return count
}

export function stableKey(issue) {
  if (!issue || typeof issue !== 'object') {
    throw new TypeError('stableKey: issue must be an object')
  }
  if (typeof issue.id === 'string' && issue.id.length > 0) return issue.id
  if (typeof issue.summary !== 'string' || issue.summary.trim() === '') {
    throw new Error('stableKey: issue has neither id nor summary')
  }
  return issue.summary.toLowerCase().replace(/\s+/g, ' ').trim()
}

export function makeIssue(partial) {
  if (!partial || typeof partial !== 'object') {
    throw new TypeError('makeIssue: partial must be an object')
  }
  if (!ISSUE_KINDS.includes(partial.kind)) {
    throw new Error(`makeIssue: kind must be one of ${ISSUE_KINDS.join(', ')}`)
  }
  if (typeof partial.summary !== 'string' || partial.summary.trim() === '') {
    throw new Error('makeIssue: summary is required and must be non-empty')
  }
  if (!partial.source || typeof partial.source.file !== 'string' ||
      !Number.isInteger(partial.source.line) || partial.source.line < 1) {
    throw new Error('makeIssue: source {file, line >= 1} is required')
  }
  const issue = {
    id: partial.id ?? null,
    kind: partial.kind,
    summary: normalizeDashes(partial.summary).trim(),
    parentId: partial.parentId ?? null,
    labels: Array.isArray(partial.labels) ? partial.labels.slice() : [],
    priority: partial.priority ?? null,
    points: partial.points ?? null,
    sprint: partial.sprint ?? null,
    band: partial.band ?? null,
    discipline: partial.discipline ?? null,
    status: partial.status ?? null,
    size: partial.size ?? null,
    dependsOn: Array.isArray(partial.dependsOn) ? partial.dependsOn.slice() : [],
    blockedByQuestions: Array.isArray(partial.blockedByQuestions)
      ? partial.blockedByQuestions.slice() : [],
    carriesForward: partial.carriesForward ?? null,
    boardItem: partial.boardItem ?? null,
    description: normalizeDashes(partial.description ?? ''),
    ac: Array.isArray(partial.ac) ? partial.ac.slice() : [],
    source: { file: partial.source.file, line: partial.source.line },
  }
  if (issue.priority !== null && !(issue.priority in PRIORITY_MAP)) {
    throw new Error(`makeIssue: priority must be P0..P4, got ${issue.priority}`)
  }
  return issue
}

export function makeProblem({ severity, rule, message, file, line }) {
  if (!SEVERITIES.includes(severity)) {
    throw new Error(`makeProblem: severity must be one of ${SEVERITIES.join(', ')}`)
  }
  if (typeof rule !== 'string' || rule === '') {
    throw new Error('makeProblem: rule is required')
  }
  if (typeof message !== 'string' || message === '') {
    throw new Error('makeProblem: message is required')
  }
  return {
    severity,
    rule,
    message,
    file: typeof file === 'string' ? file : '(unknown)',
    line: Number.isInteger(line) && line >= 1 ? line : 0,
  }
}
