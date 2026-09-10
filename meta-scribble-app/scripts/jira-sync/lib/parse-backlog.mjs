// parse-backlog.mjs -- parser for tracking/backlog-epics.md and its shape
// (epic headings + backticked metadata, feature bold lines + backticked
// metadata). See DESIGN.md "Builder A: parsers" for the field mapping this
// implements verbatim.

import { makeIssue, makeProblem, normalizeDashes, countDashes } from './model.mjs'
import { roughPointsFromSize, ROUGH_POINTS_LABEL } from './points.mjs'

const MAX_LINES = 10000
const MAX_META_LOOKAHEAD = 3

const EPIC_HEADING_RE = /^##\s+(E\d{2})\s+(.+)$/
const FEATURE_BOLD_RE = /^\*\*(E\d{2}-F\d+)\s+(.+?)\*\*$/
const BAND_H1_RE = /^#\s+(?!#)/
const EPIC_META_RE = /^`id:\s*E\d{2}\s*\|/
const FEATURE_META_RE = /^`parent:/

function assertNonEmptyText(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('parseBacklog: text must be a non-empty string')
  }
}

// Tolerates a leading YAML frontmatter block, a second docs-sync mirror
// frontmatter block, and an HTML comment banner, in any order, at the top.
function stripPreamble(lines) {
  let i = 0
  let guard = 0
  let changed = true
  while (changed && guard < MAX_LINES) {
    changed = false
    if (lines[i] !== undefined && lines[i].trim() === '---') {
      let j = i + 1
      let g2 = 0
      while (j < lines.length && g2 < MAX_LINES) {
        if (lines[j].trim() === '---') { i = j + 1; changed = true; break }
        j += 1
        g2 += 1
      }
    }
    if (lines[i] !== undefined && lines[i].trim().startsWith('<!--')) {
      if (lines[i].trim().endsWith('-->')) {
        i += 1
        changed = true
      } else {
        let j = i + 1
        let g2 = 0
        while (j < lines.length && g2 < MAX_LINES) {
          if (lines[j].includes('-->')) { i = j + 1; changed = true; break }
          j += 1
          g2 += 1
        }
      }
    }
    guard += 1
  }
  return { lines: lines.slice(i), offset: i }
}

function parseKV(metaLine) {
  const inner = metaLine.trim().replace(/^`/, '').replace(/`$/, '')
  const out = {}
  for (const chunk of inner.split(' | ')) {
    const idx = chunk.indexOf(': ')
    if (idx < 0) continue
    const key = chunk.slice(0, idx).trim()
    const value = chunk.slice(idx + 2).trim()
    out[key] = value
  }
  return out
}

function splitList(value) {
  if (!value || value.trim().toLowerCase() === 'none') return []
  return value.split(',').map((s) => s.trim()).filter(Boolean)
}

function findMetaLine(lines, headingIdx, metaRe) {
  let guard = 0
  for (let j = headingIdx + 1; j <= headingIdx + MAX_META_LOOKAHEAD && j < lines.length; j += 1) {
    guard += 1
    if (guard > MAX_META_LOOKAHEAD + 1) break
    if (metaRe.test(lines[j].trim())) return j
  }
  return -1
}

function extractBandAndParenthetical(bandValue) {
  const m = /^(\S+)\s*(\(.*\))?\s*$/.exec(bandValue || '')
  if (!m) return { band: bandValue || null, parenthetical: null }
  return { band: m[1], parenthetical: m[2] || null }
}

function extractJiraFutureParkedLabel(jiraValue) {
  if (!jiraValue) return { label: null }
  if (/,\s*label future\b/i.test(jiraValue)) return { label: 'future' }
  if (/,\s*label parked\b/i.test(jiraValue)) return { label: 'parked' }
  return { label: null }
}

export function parseBacklog(text, { fileName = 'unknown.md' } = {}) {
  assertNonEmptyText(text)
  const rawLines = text.split(/\r?\n/)
  if (rawLines.length > MAX_LINES) {
    throw new Error('parseBacklog: input exceeds MAX_LINES')
  }
  const { lines, offset } = stripPreamble(rawLines)

  const problems = []
  const items = []

  let guard = 0
  for (let i = 0; i < lines.length; i += 1) {
    guard += 1
    if (guard > MAX_LINES) throw new Error('parseBacklog: iteration cap exceeded')
    const em = EPIC_HEADING_RE.exec(lines[i])
    if (em) { items.push({ type: 'epic', lineIdx: i, id: em[1], title: em[2].trim() }); continue }
    const fm = FEATURE_BOLD_RE.exec(lines[i])
    if (fm) { items.push({ type: 'feature', lineIdx: i, id: fm[1], title: fm[2].trim() }) }
  }

  const bandStops = []
  guard = 0
  for (let i = 0; i < lines.length; i += 1) {
    guard += 1
    if (guard > MAX_LINES) break
    if (BAND_H1_RE.test(lines[i])) bandStops.push(i)
  }

  const allStops = [...items.map((it) => it.lineIdx), ...bandStops, lines.length].sort((a, b) => a - b)

  function descriptionEnd(afterIdx) {
    for (const s of allStops) {
      if (s > afterIdx) return s
    }
    return lines.length
  }

  const epicIds = new Set(items.filter((it) => it.type === 'epic').map((it) => it.id))
  const seenIds = new Set()
  const issues = []
  let totalDashCount = 0

  guard = 0
  for (const item of items) {
    guard += 1
    if (guard > MAX_LINES) throw new Error('parseBacklog: iteration cap exceeded')
    const lineNo = offset + item.lineIdx + 1

    if (seenIds.has(item.id)) {
      problems.push(makeProblem({
        severity: 'error', rule: 'duplicate-id',
        message: `id ${item.id} appears more than once (second occurrence "${item.title}")`,
        file: fileName, line: lineNo,
      }))
    }
    seenIds.add(item.id)

    if (item.type === 'epic') {
      const metaIdx = findMetaLine(lines, item.lineIdx, EPIC_META_RE)
      const kv = metaIdx >= 0 ? parseKV(lines[metaIdx]) : {}
      const { band, parenthetical } = extractBandAndParenthetical(kv.band)
      const { label: jiraLabel } = extractJiraFutureParkedLabel(kv.jira)
      const blockedByQuestions = splitList(kv['blocked by'])

      const descStartIdx = metaIdx >= 0 ? metaIdx + 1 : item.lineIdx + 1
      const descEndIdx = descriptionEnd(item.lineIdx)
      const bodyLines = lines.slice(descStartIdx, descEndIdx)
      const extras = []
      if (parenthetical) extras.push(`band note: ${parenthetical}`)
      if (kv['later home']) extras.push(`later home: ${kv['later home']}`)
      if (kv.jira) extras.push(`jira: ${kv.jira}`)
      const rawDescription = [...extras, '', ...bodyLines].join('\n')
      totalDashCount += countDashes(rawDescription)

      const labels = []
      if (band) labels.push(band)
      if (kv.discipline) labels.push(kv.discipline.trim().replace(/,/g, '').replace(/\s+/g, '-'))
      for (const q of blockedByQuestions) labels.push(q)
      if (jiraLabel) labels.push(jiraLabel)

      issues.push(makeIssue({
        id: item.id,
        kind: 'epic',
        summary: `${item.id} ${item.title}`,
        parentId: null,
        labels,
        priority: null,
        band,
        discipline: kv.discipline || null,
        blockedByQuestions,
        boardItem: kv['board item'] || null,
        description: normalizeDashes(rawDescription).trim(),
        source: { file: fileName, line: lineNo },
      }))
    } else {
      const metaIdx = findMetaLine(lines, item.lineIdx, FEATURE_META_RE)
      if (metaIdx < 0) {
        problems.push(makeProblem({
          severity: 'error', rule: 'missing-metadata',
          message: `feature "${item.id} ${item.title}" has no metadata line within ${MAX_META_LOOKAHEAD} lines`,
          file: fileName, line: lineNo,
        }))
        continue
      }
      const kv = parseKV(lines[metaIdx])
      const { band } = extractBandAndParenthetical(kv.band)
      const dependsOn = splitList(kv['depends on'])
      const blockedByQuestions = splitList(kv['blocked by'])
      const sizeRaw = kv.size || null
      // Rough difficulty guess derived from lane-days. The raw size string
      // never reaches Jira: it stays on the model for the dry-run report only.
      const points = roughPointsFromSize(sizeRaw)
      // A size value that HAS a leading integer but yields no points is a
      // backlog data error (0, or past the lane-days bound). Never let it look
      // like "not sized": null points plus silence is indistinguishable.
      if (sizeRaw !== null && points === null && /^\s*\d+/.test(sizeRaw)) {
        problems.push(makeProblem({
          severity: 'warning', rule: 'unusable-size',
          message: `feature ${item.id} has size "${sizeRaw}" whose leading number yields no points; it is reported as unsized`,
          file: fileName, line: offset + metaIdx + 1,
        }))
      }
      const carriesForward = (!kv['carries forward'] || kv['carries forward'].toLowerCase() === 'none')
        ? null : kv['carries forward']

      if (kv.parent && !epicIds.has(kv.parent)) {
        problems.push(makeProblem({
          severity: 'error', rule: 'orphan-feature',
          message: `feature ${item.id} has parent "${kv.parent}" which is not a parsed epic`,
          file: fileName, line: lineNo,
        }))
      }

      const descStartIdx = metaIdx + 1
      const descEndIdx = descriptionEnd(item.lineIdx)
      const bodyLines = lines.slice(descStartIdx, descEndIdx)
      const rawDescription = bodyLines.join('\n')
      totalDashCount += countDashes(rawDescription)

      const labels = []
      if (band) labels.push(band)
      if (kv.discipline) labels.push(kv.discipline.trim().replace(/,/g, '').replace(/\s+/g, '-'))
      for (const q of blockedByQuestions) labels.push(q)
      if (points !== null) labels.push(ROUGH_POINTS_LABEL)

      issues.push(makeIssue({
        id: item.id,
        kind: 'story',
        summary: `${item.id} ${item.title}`,
        parentId: kv.parent || null,
        labels,
        priority: null,
        band,
        discipline: kv.discipline || null,
        status: kv.status || null,
        size: sizeRaw,
        points,
        dependsOn,
        blockedByQuestions,
        carriesForward,
        description: normalizeDashes(rawDescription).trim(),
        source: { file: fileName, line: lineNo },
      }))
    }
  }

  if (totalDashCount > 0) {
    problems.push(makeProblem({
      severity: 'warning', rule: 'dash-normalized',
      message: `normalized ${totalDashCount} em/en dash occurrence(s) to ' -- '`,
      file: fileName, line: 1,
    }))
  }

  problems.sort((a, b) => a.line - b.line)

  return { format: 'backlog', epicName: null, issues, problems }
}
