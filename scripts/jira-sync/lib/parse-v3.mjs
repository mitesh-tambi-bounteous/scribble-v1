// parse-v3.mjs -- parser for the V3 story-ac-kit format
// (handbook/story-ac-kit/templates/story-v3-jira.md).
//
// Line-by-line state machine, bounded by MAX_LINES: the format has no
// recursive structure, so a single forward pass over the file is sufficient
// and any construct needing a second pass is a parser bug, not a format gap.

import { makeIssue, makeProblem, normalizeDashes, countDashes } from './model.mjs'

const MAX_LINES = 10000

const STORY_HEADING_RE = /^####\s+(.+)$/
const THREE_HASH_RE = /^###\s+(.+)$/
const CATEGORY_RE = /\[([^[\]]+)\]\s*$/
const SEPARATOR_RE = /^---+\s*$/
const DASH_CLASS = '(?:--|-|\u2013|\u2014)'
const PRIORITY_LINE_RE = new RegExp(`\\*\\*Priority:\\*\\*\\s*(P[0-4])(?:\\s*${DASH_CLASS}\\s*[A-Za-z]+)?`)
const POINTS_LINE_RE = /\*\*Points:\*\*\s*(\d+)/
const SPRINT_LINE_RE = /\*\*Sprint:\*\*\s*(\d+)/
const DEPENDENCIES_RE = /^\*\*Dependencies:\*\*\s*(.+)$/
const AS_A_RE = /\*\*As a\*\*.+\*\*I want\*\*.+\*\*so that\*\*/
const AC_HEADER_RE = /^\*\*Acceptance Criteria:\*\*/
const AC_CHECKBOX_RE = /^\s*-\s*\[[ xX]\]\s*(.+)$/
const AC_PLAIN_BULLET_RE = /^\s*-\s+(?!\[[ xX]\])\S.*$/
const VERIFICATION_RE = /^\s+Verification:\s*(.+)$/
const STANDALONE_PRIORITY_RE = /^\s*-\s+\*\*(Priority|Story Points|Points)\b/
const PHASE_FILE_RE = /^Phase-(\d+)/i

function assertNonEmptyText(text) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('parseV3: text must be a non-empty string')
  }
}

function stripFrontmatter(lines) {
  if (lines[0] !== undefined && lines[0].trim() === '---') {
    let i = 1
    let guard = 0
    while (i < lines.length && guard < MAX_LINES) {
      if (lines[i].trim() === '---') return { lines: lines.slice(i + 1), offset: i + 1 }
      i += 1
      guard += 1
    }
  }
  return { lines, offset: 0 }
}

function fileStem(fileName) {
  const base = String(fileName || 'story').split('/').pop()
  return base.replace(/\.[^.]+$/, '')
}

function categoryLabel(category) {
  return category.trim().replace(/\s+/g, '-')
}

export function parseV3(text, { fileName = 'unknown.md' } = {}) {
  assertNonEmptyText(text)
  const rawLines = text.split(/\r?\n/)
  if (rawLines.length > MAX_LINES) {
    throw new Error('parseV3: input exceeds MAX_LINES')
  }
  const { lines, offset } = stripFrontmatter(rawLines)

  const problems = []
  let epicName = null
  const phaseMatch = PHASE_FILE_RE.exec(String(fileName || ''))
  const phaseLabel = phaseMatch ? `Phase-${phaseMatch[1]}` : null

  // find first H1
  {
    let guard = 0
    for (const l of lines) {
      guard += 1
      if (guard > MAX_LINES) break
      const m = /^#\s+(.+)$/.exec(l)
      if (m) { epicName = m[1].trim(); break }
    }
  }
  if (epicName === null) epicName = fileStem(fileName)

  // pre-scan structural problems: three-hash headings that look like a story
  let guard = 0
  for (let i = 0; i < lines.length; i += 1) {
    guard += 1
    if (guard > MAX_LINES) throw new Error('parseV3: iteration cap exceeded')
    const m = THREE_HASH_RE.exec(lines[i])
    if (m && CATEGORY_RE.test(m[1])) {
      problems.push(makeProblem({
        severity: 'error', rule: 'three-hash-heading',
        message: `heading "${m[1].trim()}" uses ### but looks like a story (would be silently dropped)`,
        file: fileName, line: offset + i + 1,
      }))
    }
  }

  // find story heading indices ('#### ' lines), and validate category/separators
  const storyStarts = []
  guard = 0
  for (let i = 0; i < lines.length; i += 1) {
    guard += 1
    if (guard > MAX_LINES) throw new Error('parseV3: iteration cap exceeded')
    const m = STORY_HEADING_RE.exec(lines[i])
    if (m) storyStarts.push({ lineIdx: i, title: m[1].trim() })
  }

  const issues = []
  let totalDashCount = 0

  guard = 0
  for (let s = 0; s < storyStarts.length; s += 1) {
    guard += 1
    if (guard > MAX_LINES) throw new Error('parseV3: iteration cap exceeded')
    const { lineIdx, title } = storyStarts[s]
    const lineNo = offset + lineIdx + 1
    const catMatch = CATEGORY_RE.exec(title)
    if (!catMatch) {
      problems.push(makeProblem({
        severity: 'error', rule: 'missing-category',
        message: `story heading "${title}" is missing a trailing [Category]`,
        file: fileName, line: lineNo,
      }))
    }
    const cleanTitle = catMatch ? title.slice(0, catMatch.index).trim() : title
    const category = catMatch ? catMatch[1].trim() : null

    // missing-separator: if this isn't the first story, a '---' must appear
    // between the previous story's end and this heading.
    if (s > 0) {
      const prevEnd = storyStarts[s - 1].lineIdx
      let sawSeparator = false
      let g2 = 0
      for (let j = prevEnd + 1; j < lineIdx; j += 1) {
        g2 += 1
        if (g2 > MAX_LINES) break
        if (SEPARATOR_RE.test(lines[j])) { sawSeparator = true; break }
      }
      if (!sawSeparator) {
        problems.push(makeProblem({
          severity: 'error', rule: 'missing-separator',
          message: `story "${cleanTitle}" has no --- separator before it`,
          file: fileName, line: lineNo,
        }))
      }
    }

    const bodyEnd = s + 1 < storyStarts.length ? storyStarts[s + 1].lineIdx : lines.length
    const bodyLines = lines.slice(lineIdx + 1, bodyEnd)
    const bodyText = bodyLines.join('\n')

    let priority = null
    let points = null
    let sprint = null
    {
      const pm = PRIORITY_LINE_RE.exec(bodyText)
      if (pm) priority = pm[1]
      const ptm = POINTS_LINE_RE.exec(bodyText)
      if (ptm) points = Number.parseInt(ptm[1], 10)
      const sm = SPRINT_LINE_RE.exec(bodyText)
      if (sm) sprint = Number.parseInt(sm[1], 10)
    }

    let dependsOn = []
    {
      let g2 = 0
      for (const bl of bodyLines) {
        g2 += 1
        if (g2 > MAX_LINES) break
        const dm = DEPENDENCIES_RE.exec(bl)
        if (dm) {
          dependsOn = dm[1].split(',').map((chunk) => {
            const idMatch = /^\s*([A-Z][A-Z0-9]*-\d+)/.exec(chunk)
            return idMatch ? idMatch[1] : chunk.trim()
          }).filter(Boolean)
          break
        }
      }
    }

    const hasAsA = AS_A_RE.test(bodyText)
    if (!hasAsA) {
      problems.push(makeProblem({
        severity: 'error', rule: 'missing-as-a',
        message: `story "${cleanTitle}" has no As-a/I-want/so-that line`,
        file: fileName, line: lineNo,
      }))
    }

    // standalone-priority-item, anywhere in the body
    {
      let g2 = 0
      for (let j = 0; j < bodyLines.length; j += 1) {
        g2 += 1
        if (g2 > MAX_LINES) break
        if (STANDALONE_PRIORITY_RE.test(bodyLines[j])) {
          problems.push(makeProblem({
            severity: 'error', rule: 'standalone-priority-item',
            message: `story "${cleanTitle}" has a standalone priority/points list item (legacy V1 habit)`,
            file: fileName, line: offset + lineIdx + 1 + 1 + j,
          }))
        }
      }
    }

    // AC parsing: only within the Acceptance Criteria section
    const ac = []
    let acHeaderIdx = -1
    {
      let g2 = 0
      for (let j = 0; j < bodyLines.length; j += 1) {
        g2 += 1
        if (g2 > MAX_LINES) break
        if (AC_HEADER_RE.test(bodyLines[j])) { acHeaderIdx = j; break }
      }
    }
    if (acHeaderIdx >= 0) {
      let g2 = 0
      for (let j = acHeaderIdx + 1; j < bodyLines.length; j += 1) {
        g2 += 1
        if (g2 > MAX_LINES) break
        const line = bodyLines[j]
        if (line.trim() === '') continue
        const cbMatch = AC_CHECKBOX_RE.exec(line)
        if (cbMatch) {
          let verification = null
          if (j + 1 < bodyLines.length) {
            const vm = VERIFICATION_RE.exec(bodyLines[j + 1])
            if (vm) { verification = vm[1].trim(); j += 1 }
          }
          ac.push({
            text: normalizeDashes(cbMatch[1].trim()),
            verification,
            line: offset + lineIdx + 1 + 1 + j - (verification !== null ? 1 : 0),
          })
          continue
        }
        if (AC_PLAIN_BULLET_RE.test(line)) {
          problems.push(makeProblem({
            severity: 'error', rule: 'plain-bullet-ac',
            message: `story "${cleanTitle}" has a plain "-" bullet under Acceptance Criteria (must be "- [ ]")`,
            file: fileName, line: offset + lineIdx + 1 + 1 + j,
          }))
          continue
        }
        if (VERIFICATION_RE.test(line)) continue
        if (/^\*\*/.test(line) || SEPARATOR_RE.test(line)) break
      }
    }

    const labels = []
    if (category) labels.push(categoryLabel(category))
    if (phaseLabel) labels.push(phaseLabel)
    if (sprint !== null) labels.push(`Sprint-${sprint}`)

    const rawDescription = bodyText
    totalDashCount += countDashes(rawDescription)
    const description = normalizeDashes(rawDescription).trim()

    const issue = makeIssue({
      id: null,
      kind: 'story',
      summary: cleanTitle,
      parentId: '__EPIC__',
      labels,
      priority,
      points,
      sprint,
      dependsOn,
      description,
      ac,
      source: { file: fileName, line: lineNo },
    })
    issues.push(issue)
  }

  totalDashCount += countDashes(epicName || '')
  if (totalDashCount > 0) {
    problems.push(makeProblem({
      severity: 'warning', rule: 'dash-normalized',
      message: `normalized ${totalDashCount} em/en dash occurrence(s) to ' -- '`,
      file: fileName, line: 1,
    }))
  }

  problems.sort((a, b) => a.line - b.line)

  return { format: 'v3', epicName, issues, problems }
}
