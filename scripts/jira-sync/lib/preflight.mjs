// preflight.mjs -- the no-network gate every issue set must clear before a
// plan or a create step runs. This module and everything it imports must be
// incapable of network I/O: it never imports lib/jira.mjs and never calls
// fetch.

import { stableKey, makeProblem } from './model.mjs'
import { scanForInternalContent, loadInternalPatterns } from './internal-gate.mjs'

const EARS_FORMS = [
  /^when\b.+,\s*the\s+\S+.*\bshall\b/i,
  /^if\b.+,\s*the\s+\S+.*\bshall\b/i,
  /^while\b.+,\s*the\s+\S+.*\bshall\b/i,
  /^where\b.+,\s*the\s+\S+.*\bshall\b/i,
  /^the\s+\S+.*\bshall\b/i,
]

function matchesEars(text) {
  for (const re of EARS_FORMS) {
    if (re.test(text)) return true
  }
  return false
}

function sortProblems(problems) {
  return problems.slice().sort((a, b) => {
    if (a.file !== b.file) return a.file < b.file ? -1 : 1
    return a.line - b.line
  })
}

// Backlog items carry no ac entries at all; EARS and missing-verification
// apply only to issues that have ac (V3 stories). Backlog issues pass this
// section vacuously by having an empty ac array.
function checkAc(issue, problems) {
  const acCap = issue.ac.length
  for (let i = 0; i < acCap; i += 1) {
    const entry = issue.ac[i]
    if (!matchesEars(entry.text)) {
      const snippet = entry.text.slice(0, 60)
      problems.push(makeProblem({
        severity: 'error',
        rule: 'ears-form',
        message: `${issue.summary}: acceptance criterion is not in EARS form: ` +
          `"${snippet}"`,
        file: issue.source.file,
        line: entry.line,
      }))
    }
    if (entry.verification === null || entry.verification === undefined) {
      problems.push(makeProblem({
        severity: 'error',
        rule: 'missing-verification',
        message: `${issue.summary}: acceptance criterion has no Verification line`,
        file: issue.source.file,
        line: entry.line,
      }))
    }
  }
}

export function runPreflight(parseResult, opts = {}) {
  if (!parseResult || !Array.isArray(parseResult.issues)) {
    throw new TypeError('runPreflight: parseResult.issues must be an array')
  }
  const problems = parseResult.problems ? parseResult.problems.slice() : []
  const issues = parseResult.issues

  if (issues.length === 0) {
    problems.push(makeProblem({
      severity: 'error',
      rule: 'no-issues',
      message: 'the input parsed to zero issues; nothing to file',
      file: issues.length ? issues[0].source.file : '(unknown)',
      line: 1,
    }))
  }

  // duplicate-summary-in-file: same stableKey seen twice.
  const seenAt = new Map()
  const issueCap = issues.length
  for (let i = 0; i < issueCap; i += 1) {
    const issue = issues[i]
    const key = stableKey(issue)
    if (seenAt.has(key)) {
      const firstLine = seenAt.get(key)
      problems.push(makeProblem({
        severity: 'error',
        rule: 'duplicate-summary-in-file',
        message: `duplicate issue "${issue.summary}" at lines ${firstLine} and ${issue.source.line}`,
        file: issue.source.file,
        line: issue.source.line,
      }))
    } else {
      seenAt.set(key, issue.source.line)
    }
  }

  // duplicate-summary-existing vs. opts.existingSummaries, or the loud
  // warning that the check did not run at all.
  if (Array.isArray(opts.existingSummaries)) {
    const existingLower = new Set(opts.existingSummaries.map((s) => String(s).toLowerCase()))
    for (let i = 0; i < issueCap; i += 1) {
      const issue = issues[i]
      if (existingLower.has(issue.summary.toLowerCase())) {
        problems.push(makeProblem({
          severity: 'error',
          rule: 'duplicate-summary-existing',
          message: `"${issue.summary}" already exists in Jira`,
          file: issue.source.file,
          line: issue.source.line,
        }))
      }
    }
  } else {
    problems.push(makeProblem({
      severity: 'warning',
      rule: 'existing-not-checked',
      message: 'duplicate check against live Jira DID NOT RUN. The create step ' +
        'checks live, or pass --existing <file> (a JSON array of summaries) to check now.',
      file: '(unknown)',
      line: 1,
    }))
  }

  for (let i = 0; i < issueCap; i += 1) {
    checkAc(issues[i], problems)
  }

  if (!opts.hasConfig) {
    problems.push(makeProblem({
      severity: 'warning',
      rule: 'jira-not-checked',
      message: 'no Jira config present: project key and issue types were not ' +
        'validated against Jira. The create step validates them live.',
      file: '(unknown)',
      line: 1,
    }))
  }

  // The internal gate always runs. opts.internalPatterns lets a caller
  // preload/override the pattern set (e.g. tests, or a --patterns file);
  // otherwise this loads the shipped internal-patterns.json. opts.rawText
  // and opts.fileName are not enumerated in the narrow opts shape above but
  // are required for scanForInternalContent's line lookup; the CLI always
  // has the raw text it just parsed, so it passes both through here.
  const patterns = opts.internalPatterns ?? loadInternalPatterns()
  const rawText = typeof opts.rawText === 'string' ? opts.rawText : ''
  const fileName = typeof opts.fileName === 'string'
    ? opts.fileName
    : (issues[0] ? issues[0].source.file : '(unknown)')
  const gateProblems = scanForInternalContent({ issues, rawText, fileName, patterns })
  for (const p of gateProblems) problems.push(p)

  return { problems: sortProblems(problems) }
}
