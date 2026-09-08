// internal-gate.mjs -- refuses to file text that matches a known internal
// marker or a client-sensitive fact. Refusal, not redaction: this module
// NEVER strips or rewrites the text it scans. Silent stripping means nobody
// learns the draft carried the sensitive line in the first place.

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { makeProblem } from './model.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DEFAULT_PATTERNS_PATH = path.join(__dirname, '..', 'internal-patterns.json')

// Bounded: a patterns file with more than this many entries in one list is
// almost certainly a mistake (config typo) rather than an intentional list.
const MAX_ENTRIES_PER_LIST = 1000

function compileEntry(entry, listName, index) {
  if (!entry || typeof entry !== 'object') {
    throw new Error(`loadInternalPatterns: ${listName}[${index}] must be an object`)
  }
  if (typeof entry.pattern !== 'string' || entry.pattern === '') {
    throw new Error(`loadInternalPatterns: ${listName}[${index}].pattern is required`)
  }
  if (typeof entry.why !== 'string' || entry.why === '') {
    throw new Error(`loadInternalPatterns: ${listName}[${index}].why is required`)
  }
  let compiled
  try {
    compiled = new RegExp(entry.pattern, 'i')
  } catch (e) {
    throw new Error(
      `loadInternalPatterns: ${listName}[${index}] has an invalid regex ` +
      `"${entry.pattern}": ${String((e && e.message) || e)}`
    )
  }
  return { pattern: compiled, why: entry.why, source: entry.pattern }
}

function compileList(rawList, listName) {
  if (!Array.isArray(rawList)) {
    throw new Error(`loadInternalPatterns: ${listName} must be an array`)
  }
  if (rawList.length > MAX_ENTRIES_PER_LIST) {
    throw new Error(`loadInternalPatterns: ${listName} exceeds ${MAX_ENTRIES_PER_LIST} entries`)
  }
  const out = []
  for (let i = 0; i < rawList.length; i += 1) {
    out.push(compileEntry(rawList[i], listName, i))
  }
  return out
}

export function loadInternalPatterns(jsonPath) {
  const resolvedPath = typeof jsonPath === 'string' ? jsonPath : DEFAULT_PATTERNS_PATH
  let raw
  try {
    raw = fs.readFileSync(resolvedPath, 'utf8')
  } catch (e) {
    throw new Error(`loadInternalPatterns: cannot read ${resolvedPath}: ${String((e && e.message) || e)}`)
  }
  let parsed
  try {
    parsed = JSON.parse(raw)
  } catch (e) {
    throw new Error(`loadInternalPatterns: ${resolvedPath} is not valid JSON: ${String((e && e.message) || e)}`)
  }
  return {
    markers: compileList(parsed.markers ?? [], 'markers'),
    facts: compileList(parsed.facts ?? [], 'facts'),
  }
}

// Finds the 1-based line number in rawText of the first line, at or after
// startLine, containing needleLine verbatim. Bounded by the input's own line
// count so a pathological input cannot spin.
function findLineAtOrAfter(rawLines, needleLine, startLine) {
  const start = Math.max(1, startLine) - 1
  const cap = rawLines.length
  for (let i = start; i < cap; i += 1) {
    if (rawLines[i].includes(needleLine)) return i + 1
  }
  // Fall back to a full scan in case the match line sits before the
  // recorded heading line (e.g. frontmatter or normalization shifted it).
  for (let i = 0; i < cap; i += 1) {
    if (rawLines[i].includes(needleLine)) return i + 1
  }
  return startLine
}

function scanField(text, entries) {
  const hits = []
  if (typeof text !== 'string' || text === '') return hits
  const lines = text.split('\n')
  const lineCap = lines.length
  for (let li = 0; li < lineCap; li += 1) {
    const line = lines[li]
    for (const entry of entries) {
      const match = line.match(entry.pattern)
      if (match) {
        hits.push({ line, why: entry.why, source: entry.source })
      }
    }
  }
  return hits
}

export function scanForInternalContent({ issues, rawText, fileName, patterns }) {
  if (!Array.isArray(issues)) {
    throw new TypeError('scanForInternalContent: issues must be an array')
  }
  if (typeof rawText !== 'string') {
    throw new TypeError('scanForInternalContent: rawText must be a string')
  }
  if (!patterns || !Array.isArray(patterns.markers) || !Array.isArray(patterns.facts)) {
    throw new TypeError('scanForInternalContent: patterns must be a loaded pattern set')
  }
  const allEntries = patterns.markers.concat(patterns.facts)
  const rawLines = rawText.split('\n')
  const problems = []

  const issueCap = issues.length
  for (let idx = 0; idx < issueCap; idx += 1) {
    const issue = issues[idx]
    const hits = scanField(issue.summary, allEntries).concat(scanField(issue.description, allEntries))
    for (const hit of hits) {
      const startLine = issue.source && Number.isInteger(issue.source.line) ? issue.source.line : 1
      const line = findLineAtOrAfter(rawLines, hit.line, startLine)
      problems.push(makeProblem({
        severity: 'error',
        rule: 'internal-content',
        message: `${fileName}:${line}: refusing to file internal content: ` +
          `matched "${hit.source}" (${hit.why}) in ${issue.summary}`,
        file: fileName,
        line,
      }))
    }
  }
  return problems
}
