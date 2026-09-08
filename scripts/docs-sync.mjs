#!/usr/bin/env node
// docs-sync.mjs -- render the project brain's source of truth (product/,
// tracking/, and handbook/) into VitePress pages under docs/. Single source
// of truth stays in those directories; this script copies content into
// docs/ with a small generated frontmatter header so the doc site always
// reflects reality.
//
// Prose is normalized to the ASCII house style on the way in (shared with
// context-ingest.mjs) so pages derived from verbatim artifacts or knowledge
// notes still pass prose-lint. Normalization is idempotent.
//
// Only node built-ins plus the local prose normalizer are imported.
//
// Power-of-10 in spirit: every loop is bounded by a constant cap, fs return
// values are checked, functions are small and named, and inputs are asserted
// before use.

import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join, relative, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { normalizeProse } from './lib/normalize-prose.mjs'
import { parseBacklog } from './jira-sync/lib/parse-backlog.mjs'
import { CONTEXT_EXCLUDES } from './lib/context-excludes.mjs'

// Hard caps so no loop can run unbounded.
const MAX_FILES = 2000
const MAX_DEPTH = 8

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const DOCS = join(ROOT, 'docs')

// Each rule maps a source path under product/, tracking/, or handbook/ to a
// destination page under docs/.
// `kind` is "file" for a single page or "tree" for a directory of pages.
const RULES = [
  { kind: 'file', src: 'product/overview.md', dst: 'overview.md', title: 'Project Overview' },
  { kind: 'file', src: 'product/story.md', dst: 'story.md', title: 'The Story' },
  { kind: 'file', src: 'product/scribl-full-app-spec.md', dst: 'scribl-full-app-spec.md', title: 'Full-App Spec' },
  { kind: 'file', src: 'product/android-distribution.md', dst: 'android-distribution.md', title: 'Android Distribution' },
  { kind: 'file', src: 'product/ios-distribution.md', dst: 'ios-distribution.md', title: 'iOS Distribution' },
  { kind: 'file', src: 'tracking/status.md', dst: 'status.md', title: 'Status' },
  { kind: 'file', src: 'tracking/open-questions.md', dst: 'open-questions.md', title: 'Open questions' },
  // onboarding.md renders to the site root, not under /handbook, because the nav and
  // sidebar link it as /onboarding. It is excluded from the handbook tree below so the
  // two rules cannot both emit it.
  { kind: 'file', src: 'handbook/onboarding.md', dst: 'onboarding.md', title: 'Onboarding, the reading path' },
  { kind: 'tree', src: 'handbook', dst: 'handbook', title: 'Handbook', exclude: ['onboarding.md'] },
  { kind: 'file', src: 'product/input-artifacts.md', dst: 'input-artifacts.md', title: 'Input Artifacts' },
  { kind: 'tree', src: 'product/context', dst: 'context', title: 'Project Information', exclude: CONTEXT_EXCLUDES },
  { kind: 'file', src: 'tracking/board.md', dst: 'board.md', title: 'Board' },
  { kind: 'file', src: 'tracking/roadmap.md', dst: 'roadmap.md', title: 'Roadmap' },
  { kind: 'tree', src: 'tracking/stories', dst: 'stories', title: 'Stories' },
  { kind: 'narrative', src: 'tracking/backlog-epics.md', dst: 'backlog-epics.md', title: 'Creating the Backlog' },
  { kind: 'file', src: 'tracking/sprint-zero.md', dst: 'sprint-zero.md', title: 'Sprint 0' },
  { kind: 'file', src: 'tracking/timeline-and-milestones.md', dst: 'timeline-and-milestones.md', title: 'Timeline and Milestones' },
  { kind: 'file', src: 'tracking/client-priority-to-delivery-week.md', dst: 'client-priority-to-delivery-week.md', title: 'Client Priority to Delivery Week' },
  { kind: 'file', src: 'tracking/production-backlog.md', dst: 'production-backlog.md', title: 'Production Starter Backlog' },
  { kind: 'file', src: 'tracking/expo-rebuild-epics.md', dst: 'expo-rebuild-epics.md', title: 'Expo Rebuild Epics' },
  { kind: 'file', src: 'tracking/production-sprint-backlog.md', dst: 'production-sprint-backlog.md', title: 'Production Sprint Backlog' },
  { kind: 'file', src: 'tracking/jira-board.md', dst: 'jira-board.md', title: 'Jira Board (SCRIBL)' },
  { kind: 'file', src: 'tracking/jira-mirror.md', dst: 'jira-mirror.md', title: 'Jira Mirror (SCRIBL)' },
  { kind: 'file', src: 'tracking/epic-board-mapping.md', dst: 'epic-board-mapping.md', title: 'Epic to Board Mapping' },
  { kind: 'file', src: 'tracking/production-backend-plan.md', dst: 'production-backend-plan.md', title: 'Production Backend Plan' },
  { kind: 'file', src: 'tracking/future-scale-track.md', dst: 'future-scale-track.md', title: 'Future Scale Track' },
  { kind: 'file', src: 'product/design/poc-realignment-plan.md', dst: 'design/poc-realignment-plan.md', title: 'POC Realignment Plan' },
  { kind: 'file', src: 'product/design/screen-flow-inventory.md', dst: 'design/screen-flow-inventory.md', title: 'Screen and Flow Inventory' },
  // product/prototype carries its own root index.md, so syncTree renders that
  // curated landing page instead of the mechanical link list it falls back to
  // when a tree has no index of its own.
  { kind: 'tree', src: 'product/prototype', dst: 'prototype', title: 'Prototype' },
  { kind: 'tree', src: 'knowledge', dst: 'knowledge', title: 'Knowledge', exclude: [
    'meetings/raw/',
    'raw/',
    'team/',
    'research/',
    'PROVENANCE.md',
    'wiki/log.md',
    'meetings/2026-08-18-alignment.md',
    'meetings/2026-08-20-kickoff-walkthrough.md',
    'meetings/scribl-approach-discussion.md'
  ] }
]

// Assert a precondition; fail loud rather than producing a broken site.
function assert(cond, message) {
  if (!cond) {
    throw new Error(`docs-sync: ${message}`)
  }
}

// Build the generated frontmatter header prepended to every synced page. The
// provenance notice is an HTML comment so it never renders as body text; the
// "do not hand-edit" warning still shows to anyone viewing the page source.
// `extraLines` carries a source's own frontmatter fields (minus its own
// `title`, which the generated title always wins over) so fields like
// `source-type: workshop` survive inside real frontmatter.
function header(title, sourceRel, extraLines) {
  assert(typeof title === 'string' && title.length > 0, 'header needs a title')
  assert(typeof sourceRel === 'string' && sourceRel.length > 0, 'header needs a source')
  const extras = extraLines ?? []
  const MAX_EXTRA_LINES = 200
  assert(extras.length <= MAX_EXTRA_LINES, 'too many source frontmatter lines')
  // Quote the title: synced titles can contain a colon (for example
  // "Stories: S-001-..."), which is not valid bare YAML.
  const safeTitle = title.replace(/"/g, '\\"')
  const lines = [
    '---',
    `title: "${safeTitle}"`,
    ...extras,
    '---',
    '',
    `<!-- Generated by docs-sync from \`${sourceRel}\`. Do not hand-edit; edit the`,
    '     source and re-run `npm run docs:sync`. -->',
    '',
    ''
  ]
  return lines.join('\n')
}

// Relative path with forward slashes, always, on every platform.
//
// node:path's relative() returns the host separator, so on Windows it yields
// "handbook\engineering\index.md". That leaks into three kinds of output: the
// generated-from comment, the page title, and the link targets in a tree index.
// The first two churn every generated page on a Windows run; the third writes
// links that do not resolve. Generated pages must be byte-identical whoever runs
// the sync, so every path that becomes text goes through here.
function relPosix(from, to) {
  const rel = relative(from, to)
  assert(typeof rel === 'string', `relative() returned a non-string for ${to}`)
  return rel.split(sep).join('/')
}

// Detect a leading `---\n ... \n---` frontmatter block in a source body. Flat
// `key: value` lines are parsed into `fields`; every raw line (minus its own
// `title:` line, which would collide with the generated title) is kept in
// `passthroughLines` so nested YAML rides through unparsed. Returns null if
// the source carries no frontmatter.
const MAX_FRONTMATTER_LINES = 200

// True if every non-empty line of a candidate frontmatter block looks like
// frontmatter: either an indented continuation line, or an unindented
// `key: value` line. Guards against misparsing a body that opens with a
// `---` thematic break rather than real frontmatter.
function looksLikeFrontmatter(rawLines) {
  for (let i = 0; i < rawLines.length && i < MAX_FRONTMATTER_LINES; i += 1) {
    const line = rawLines[i]
    if (line.trim() === '') {
      continue
    }
    if (/^\s/.test(line)) {
      continue
    }
    if (!/^[A-Za-z0-9_-]+:/.test(line)) {
      return false
    }
  }
  return true
}

function parseSourceFrontmatter(body) {
  assert(typeof body === 'string', 'parseSourceFrontmatter needs a string')
  const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(body)
  if (!m) {
    return null
  }
  const rawLines = m[1].split('\n')
  assert(rawLines.length <= MAX_FRONTMATTER_LINES, 'source frontmatter block too large')
  if (!looksLikeFrontmatter(rawLines)) {
    return null
  }
  const fields = {}
  for (let i = 0; i < rawLines.length; i += 1) {
    const km = /^([A-Za-z0-9_-]+):\s?(.*)$/.exec(rawLines[i])
    if (km) {
      fields[km[1].toLowerCase()] = km[2].trim()
    }
  }
  const passthroughLines = rawLines.filter((l) => !/^title:\s?/i.test(l))
  return { fields, passthroughLines, rest: body.slice(m[0].length) }
}

// Fields worth surfacing as a small metadata table under the H1, in display
// order. Pages without any of these (meeting digests, wiki sources) get no
// table -- just the frontmatter merge.
const META_TABLE_FIELDS = [
  ['status', 'Status'],
  ['owner', 'Owner'],
  ['stage', 'Stage'],
  ['phase', 'Phase'],
  ['labels', 'Labels']
]

// Strip a flat list value's brackets for display, e.g. "[daily-loop]" -> "daily-loop".
function stripBrackets(value) {
  assert(typeof value === 'string', 'stripBrackets needs a string')
  return value.replace(/^\[/, '').replace(/\]$/, '')
}

// Build the `| Field | value |` table rows for the fields present in
// `fields`, or null if none of META_TABLE_FIELDS are present.
function buildMetaTable(fields) {
  const rows = []
  for (const [key, label] of META_TABLE_FIELDS) {
    if (fields[key]) {
      rows.push(`| ${label} | ${stripBrackets(fields[key])} |`)
    }
  }
  if (rows.length === 0) {
    return null
  }
  return ['| | |', '|---|---|', ...rows]
}

// Insert metadata table lines right after the first H1 in the body. If no H1
// is found within the scan cap, the body is returned unchanged rather than
// guessing where to put it.
const MAX_H1_SCAN = 50
function insertMetaTable(body, tableLines) {
  if (!tableLines) {
    return body
  }
  const lines = body.split('\n')
  let h1Idx = -1
  for (let i = 0; i < lines.length && i < MAX_H1_SCAN; i += 1) {
    if (/^#\s/.test(lines[i])) {
      h1Idx = i
      break
    }
  }
  if (h1Idx === -1) {
    return body
  }
  const before = lines.slice(0, h1Idx + 1)
  const after = lines.slice(h1Idx + 1)
  return [...before, '', ...tableLines, '', ...after].join('\n')
}

// Ensure a directory exists; returns true if present after the call.
function ensureDir(dir) {
  assert(typeof dir === 'string' && dir.length > 0, 'ensureDir needs a path')
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
  return existsSync(dir)
}

// Directory names never rendered to the client, wherever they occur in a
// synced tree. Client-feedback stays a source-only record until the client
// visibility question (Q52) resolves.
const EXCLUDED_DIR_NAMES = new Set(['client-feedback'])

// List markdown files under a directory, bounded by MAX_FILES and MAX_DEPTH.
function collectMarkdown(dir) {
  assert(typeof dir === 'string', 'collectMarkdown needs a path')
  const found = []
  // Explicit stack with depth so recursion stays bounded and traceable.
  const stack = [{ path: dir, depth: 0 }]
  let guard = 0
  while (stack.length > 0 && guard < MAX_FILES) {
    guard += 1
    const node = stack.pop()
    if (node.depth > MAX_DEPTH) {
      continue
    }
    const entries = readdirSync(node.path, { withFileTypes: true })
    for (let i = 0; i < entries.length && found.length < MAX_FILES; i += 1) {
      const entry = entries[i]
      if (EXCLUDED_DIR_NAMES.has(entry.name)) {
        continue
      }
      const full = join(node.path, entry.name)
      if (entry.isDirectory()) {
        stack.push({ path: full, depth: node.depth + 1 })
      } else if (entry.isFile() && entry.name.endsWith('.md')) {
        found.push(full)
      }
    }
  }
  assert(guard < MAX_FILES, 'collectMarkdown hit the file cap; raise MAX_FILES or split the tree')
  return found
}

// Copy one source file to one destination page, prepending the header. A
// source's own frontmatter (stories, meeting digests, wiki sources) is
// stripped from the body and merged into the generated frontmatter instead,
// so it never renders as a literal body block; status/owner/stage/phase/
// labels also get a small table under the H1.
function syncFile(srcAbs, dstAbs, title) {
  assert(existsSync(srcAbs), `source missing: ${srcAbs}`)
  const ok = ensureDir(dirname(dstAbs))
  assert(ok, `could not create directory for ${dstAbs}`)
  const raw = readFileSync(srcAbs, 'utf8')
  const sourceRel = relPosix(ROOT, srcAbs)
  const fm = parseSourceFrontmatter(raw)
  const extraLines = fm ? fm.passthroughLines : []
  let body = fm ? fm.rest : raw
  if (fm) {
    body = insertMetaTable(body, buildMetaTable(fm.fields))
  }
  writeFileSync(dstAbs, header(title, sourceRel, extraLines) + normalizeProse(body), 'utf8')
  assert(existsSync(dstAbs), `write failed: ${dstAbs}`)
  return dstAbs
}

// True if a relative path falls under an exclude entry. A trailing '/' entry
// excludes the whole subtree it names; otherwise it must match exactly.
function isExcluded(rel, excludes) {
  assert(typeof rel === 'string', 'isExcluded needs a relative path')
  if (!excludes || excludes.length === 0) {
    return false
  }
  const MAX_EXCLUDES = 200
  assert(excludes.length <= MAX_EXCLUDES, 'exclude list too large')
  for (let i = 0; i < excludes.length; i += 1) {
    const entry = excludes[i]
    if (entry.endsWith('/')) {
      if (rel === entry.slice(0, -1) || rel.startsWith(entry)) {
        return true
      }
    } else if (rel === entry) {
      return true
    }
  }
  return false
}

// Sync a directory of markdown into a docs/ subtree. If the source tree
// already carries its own root index.md (an authored or generated landing
// page), it is rendered as-is and the auto-generated link index is skipped,
// so a curated landing is never clobbered. Otherwise, if the root has a
// README.md instead, that README is rendered AS index.md (no separate
// README.md copy, no generated link list) -- a root README is a curated
// landing too, just under a different filename. READMEs deeper in the tree
// pass through untouched, as ordinary pages. Trees with neither get today's
// mechanical link index.
function syncTree(srcAbs, dstDirAbs, title, excludes) {
  const files = collectMarkdown(srcAbs)
  const written = []
  const indexLinks = []
  const hasRootIndex = files.some((f) => relPosix(srcAbs, f) === 'index.md')
  const hasRootReadme = files.some((f) => relPosix(srcAbs, f) === 'README.md')
  assert(!(hasRootIndex && hasRootReadme),
    `${srcAbs} has both index.md and README.md at its root; merge README.md into index.md, one landing page per tree`)
  let hasSourceIndex = false
  for (let i = 0; i < files.length && i < MAX_FILES; i += 1) {
    const file = files[i]
    const rel = relPosix(srcAbs, file)
    if (isExcluded(rel, excludes)) {
      continue
    }
    if (rel === 'index.md') {
      hasSourceIndex = true
      const dstAbs = join(dstDirAbs, rel)
      syncFile(file, dstAbs, title)
      written.push(dstAbs)
      continue
    }
    if (rel === 'README.md' && !hasRootIndex) {
      // Root README, no root index.md: render as the tree's index page and
      // skip both the mechanical README.md copy and the link list below.
      const dstAbs = join(dstDirAbs, 'index.md')
      syncFile(file, dstAbs, title)
      written.push(dstAbs)
      continue
    }
    const dstAbs = join(dstDirAbs, rel)
    syncFile(file, dstAbs, `${title}: ${rel.replace(/\.md$/, '')}`)
    written.push(dstAbs)
    indexLinks.push(`- [${rel.replace(/\.md$/, '')}](./${rel.replace(/\.md$/, '')})`)
  }
  if (!hasSourceIndex && !hasRootReadme) {
    writeIndex(dstDirAbs, title, indexLinks)
  }
  return written
}

// Write an index.md listing the synced pages in a tree.
function writeIndex(dstDirAbs, title, links) {
  const ok = ensureDir(dstDirAbs)
  assert(ok, `could not create directory ${dstDirAbs}`)
  const body = links.length > 0 ? links.join('\n') + '\n' : '_No pages yet._\n'
  const indexPath = join(dstDirAbs, 'index.md')
  writeFileSync(indexPath, header(title, relPosix(ROOT, dstDirAbs)) + body, 'utf8')
  assert(existsSync(indexPath), `index write failed: ${indexPath}`)
}

// ---- Epic pages, generated from the backlog sources ----
//
// tracking/backlog-epics.md is the machine-readable input to scripts/jira-sync,
// so it stays one flat file in the parser's format. The site wants one page per
// epic instead. Both come from the same parse, using jira-sync's own parser, so
// a page can never describe something different from what Jira gets.
//
// Sprint 0 lives in its own source because a spike is not a feature.
const EPIC_SOURCES = ['tracking/backlog-sprint0.md', 'tracking/backlog-epics.md']
const EPICS_DST = 'epics'
const MAX_EPICS = 100
const MAX_FEATURES_PER_EPIC = 200
const BAND_ORDER = ['SPRINT0', 'GREEN', 'ORANGE', 'GRAY', 'PARKED']
const BAND_CAPTION = {
  SPRINT0: 'Sprint 0, the Shape window',
  GREEN: 'Green, carries the daily loop',
  ORANGE: 'Orange, earns a sprint slot',
  GRAY: 'Gray, outside these eight weeks',
  PARKED: 'Parked, built and switched off'
}

// Jira keys, read back from the board on 2026-08-24. Absent means not filed.
const EPIC_KEYS = {
  E00: 'SCRIBL-3', E01: 'SCRIBL-1', E02: 'SCRIBL-27', E03: 'SCRIBL-34',
  E04: 'SCRIBL-40', E05: 'SCRIBL-47', E06: 'SCRIBL-54', E07: 'SCRIBL-62',
  E11: 'SCRIBL-68'
}

function epicSlug(id) {
  assert(/^E\d{2}$/.test(id), `bad epic id: ${id}`)
  return id.toLowerCase()
}

// Child-page slug for a feature id: "E02-F7" -> "f7". Ids that do not match
// the "E\d\d-<rest>" shape fall back to a sanitized lowercase slug so no
// feature is ever unaddressable.
function featureSlug(id) {
  assert(typeof id === 'string' && id.length > 0, 'featureSlug needs a string id')
  const m = /^E\d{2}-(.+)$/.exec(id)
  const raw = m ? m[1] : id
  const slug = raw.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
  assert(slug.length > 0, `could not derive a slug from feature id: ${id}`)
  return slug
}

// ---- Screen-capture map: feature description -> POC capture thumbnails ----
//
// scripts/data/screen-backlog-map.json is keyed by app route; the field we
// need is screen_page (the prototype screen doc's source filename), which
// with '.md' stripped is the same slug used in the /prototype/screens/<slug>
// links that feature descriptions already carry.
const SCREEN_MAP_PATH = join(ROOT, 'scripts/data/screen-backlog-map.json')
let screenSlugMapCache = null

function loadScreenSlugMap() {
  if (screenSlugMapCache) return screenSlugMapCache
  assert(existsSync(SCREEN_MAP_PATH), `missing screen backlog map: ${SCREEN_MAP_PATH}`)
  const raw = JSON.parse(readFileSync(SCREEN_MAP_PATH, 'utf8'))
  const map = new Map()
  for (const key of Object.keys(raw)) {
    const entry = raw[key]
    if (!entry || typeof entry.screen_page !== 'string') continue
    const slug = entry.screen_page.replace(/\.md$/, '')
    map.set(slug, { tile: entry.tile, route: entry.screen_name })
  }
  screenSlugMapCache = map
  return map
}

const MAX_SCREEN_LINKS = 20
const MAX_CAPTURES = 8

// Pull deduped /prototype/screens/<slug> slugs out of a feature description,
// in the order they first appear, bounded by MAX_SCREEN_LINKS matches.
function extractScreenSlugs(description) {
  assert(typeof description === 'string', 'extractScreenSlugs needs a string')
  const re = /\/prototype\/screens\/([a-z0-9-]+)/gi
  const seen = new Set()
  const out = []
  let match = re.exec(description)
  let guard = 0
  while (match && guard < MAX_SCREEN_LINKS) {
    guard += 1
    const slug = match[1].toLowerCase()
    if (!seen.has(slug)) {
      seen.add(slug)
      out.push(slug)
    }
    match = re.exec(description)
  }
  return out
}

// Resolve one screen slug to its capture tile and route, asserting the slug
// is a known screen. Loud failure beats a silently missing thumbnail.
function resolveScreenCapture(slug, map) {
  assert(typeof slug === 'string' && slug.length > 0, 'resolveScreenCapture needs a slug')
  assert(map instanceof Map, 'resolveScreenCapture needs a Map')
  const entry = map.get(slug)
  assert(entry, `unknown screen slug in feature description: ${slug}, not in screen-backlog-map.json`)
  return { tile: entry.tile, route: entry.route, slug }
}

// Render the capture thumbnail block for a feature child page. Empty input
// renders nothing; a single capture floats right so text wraps beside it;
// several wrap into a row. Inline styles only: no hardcoded background so
// dark mode stays legible, and the divider color follows the VitePress theme.
function renderCaptureBlock(captures) {
  assert(Array.isArray(captures), 'renderCaptureBlock needs an array')
  if (captures.length === 0) return ''
  const bounded = captures.slice(0, MAX_CAPTURES)
  const figure = (cap, width) => {
    const href = `/prototype/screens/${cap.slug}`
    return [
      `<figure style="margin:0;text-align:center;width:${width}px;">`,
      `  <a href="${href}"><img src="/assets/prototype/${cap.tile}" width="${width}" loading="lazy" alt="POC capture of ${cap.route}"></a>`,
      `  <figcaption style="font-size:0.8em;"><a href="${href}">${cap.route}</a></figcaption>`,
      '</figure>'
    ].join('\n')
  }
  if (bounded.length === 1) {
    return [
      '<div style="float:right;margin:0 0 1em 1em;border:1px solid var(--vp-c-divider);padding:0.5em;">',
      figure(bounded[0], 180),
      '</div>',
      ''
    ].join('\n')
  }
  const tiles = bounded.map((cap) => figure(cap, 140)).join('\n')
  return [
    '<div style="display:flex;flex-wrap:wrap;gap:0.75em;margin:0 0 1em 0;">',
    tiles,
    '</div>',
    ''
  ].join('\n')
}

// Read every source and return { epics: [...], byParent: Map }.
function parseEpicSources() {
  const epics = []
  const byParent = new Map()
  for (let i = 0; i < EPIC_SOURCES.length && i < MAX_FILES; i += 1) {
    const rel = EPIC_SOURCES[i]
    const abs = join(ROOT, rel)
    if (!existsSync(abs)) continue
    const parsed = parseBacklog(readFileSync(abs, 'utf8'), { fileName: rel })
    const errors = parsed.problems.filter((x) => x.severity === 'error')
    assert(errors.length === 0, `${rel} has ${errors.length} parse error(s)`)
    for (const issue of parsed.issues) {
      if (issue.kind === 'epic') {
        epics.push({ issue, source: rel })
      } else {
        const list = byParent.get(issue.parentId) ?? []
        list.push(issue)
        byParent.set(issue.parentId, list)
      }
    }
  }
  assert(epics.length > 0 && epics.length <= MAX_EPICS, `epic count out of range: ${epics.length}`)
  return { epics, byParent }
}

// The backlog source's backticked KV line carries a `jira: SCRIBL Epic` pair
// that the jira-sync parser folds into issue.description as an "extras" line
// (scripts/jira-sync/lib/parse-backlog.mjs, parseBacklog(), the `if
// (kv.jira) extras.push(...)` line for epics). jira-sync needs that line for
// its own dry-run report; the rendered page does not, so it is filtered out
// here rather than in the parser.
function stripJiraLine(description) {
  assert(typeof description === 'string', 'stripJiraLine needs a string')
  const lines = description.split('\n').filter((l) => !/^jira:\s/i.test(l))
  while (lines.length > 0 && lines[0] === '') {
    lines.shift()
  }
  return lines.join('\n')
}

// Short id for a feature/epic child: "E02-F1" -> "F1". Falls back to the
// full id if it does not match the expected "E\d\d-" prefix.
function shortFeatureId(id) {
  const m = /^E\d{2}-(.+)$/.exec(id)
  return m ? m[1] : id
}

// A feature's summary is "<id> <title>"; strip the id prefix for display.
function featureTitle(feature) {
  const prefix = `${feature.id} `
  return feature.summary.startsWith(prefix) ? feature.summary.slice(prefix.length) : feature.summary
}

// Two-column metadata table for the epic itself: band, lane, Jira key, board card.
function epicMetaTable(issue) {
  const rows = []
  if (issue.band) rows.push(`| Band | ${issue.band} |`)
  if (issue.discipline) rows.push(`| Lane | ${issue.discipline} |`)
  const key = EPIC_KEYS[issue.id]
  rows.push(`| Jira | ${key ?? 'Not yet filed'} |`)
  if (issue.boardItem) rows.push(`| Board card | ${issue.boardItem} |`)
  return ['| | |', '|---|---|', ...rows]
}

// One bold metadata line under each feature H2. Lowercased connective words
// keep it reading as a sentence fragment rather than a label list.
function featureMetaLine(issue) {
  const bits = []
  if (issue.size) bits.push(issue.size)
  if (issue.status) bits.push(issue.status)
  if (issue.discipline) bits.push(issue.discipline)
  if (issue.dependsOn && issue.dependsOn.length > 0) {
    bits.push(`depends on ${issue.dependsOn.join(', ')}`)
  }
  if (issue.blockedByQuestions && issue.blockedByQuestions.length > 0) {
    const qs = issue.blockedByQuestions.map((q) => `[${q}](/open-questions)`).join(', ')
    bits.push(`blocked by ${qs}`)
  }
  if (issue.carriesForward) bits.push(`carries forward ${issue.carriesForward}`)
  if (bits.length === 0) {
    return ''
  }
  return `**${bits.join(' | ')}**`
}

// Feature summary table: `# | Feature | Size | Status | Depends on`, one row
// per feature/spike, cells blank where a field is absent.
function renderFeatureSummaryTable(epicSlugValue, features) {
  const out = ['| # | Feature | Size | Status | Depends on |', '|---|---|---|---|---|']
  for (let i = 0; i < features.length && i < MAX_FEATURES_PER_EPIC; i += 1) {
    const f = features[i]
    const size = f.size ?? ''
    const status = f.status ?? ''
    const dependsOn = f.dependsOn && f.dependsOn.length > 0 ? f.dependsOn.join(', ') : ''
    const link = `[${featureTitle(f)}](/${EPICS_DST}/${epicSlugValue}/${featureSlug(f.id)})`
    out.push(`| ${shortFeatureId(f.id)} | ${link} | ${size} | ${status} | ${dependsOn} |`)
  }
  return out
}

function renderEpicPage(entry, features) {
  const { issue, source } = entry
  const out = [header(issue.summary, source)]
  out.push(`# ${issue.summary}\n`)
  out.push(`${stripJiraLine(issue.description)}\n`)
  out.push(epicMetaTable(issue).join('\n') + '\n')
  out.push(renderFeatureSummaryTable(epicSlug(issue.id), features).join('\n') + '\n')
  return out.join('\n')
}

// Render one feature's child page: title, meta line, capture thumbnails (if
// its description links to any prototype screens), the description itself,
// then a back link to the parent epic.
function renderFeaturePage(entry, feature, screenMap) {
  const { issue, source } = entry
  const out = [header(feature.summary, source)]
  out.push(`# ${feature.summary}\n`)
  const meta = featureMetaLine(feature)
  if (meta) out.push(`${meta}\n`)
  const slugs = extractScreenSlugs(feature.description)
  const captures = slugs.map((slug) => resolveScreenCapture(slug, screenMap))
  const captureBlock = renderCaptureBlock(captures)
  if (captureBlock) out.push(captureBlock)
  out.push(`${feature.description}\n`)
  out.push(`[<- Back to ${issue.summary}](/${EPICS_DST}/${epicSlug(issue.id)})\n`)
  return out.join('\n')
}

function renderEpicsIndex(grouped) {
  const out = [header('Epics', EPIC_SOURCES.join(', '))]
  out.push('# Epics\n')
  out.push('Every epic in the plan, grouped by band. The band is the filing order')
  out.push('into Jira and the build order, because feature work is serial behind')
  out.push('one iOS engineer.\n')
  for (const band of BAND_ORDER) {
    const list = grouped.get(band)
    if (!list || list.length === 0) continue
    out.push(`## ${BAND_CAPTION[band] ?? band}\n`)
    out.push('| Epic | Features | Jira |')
    out.push('|---|---|---|')
    for (const { issue, count } of list) {
      const key = EPIC_KEYS[issue.id] ?? 'not filed'
      out.push(`| [${issue.summary}](/${EPICS_DST}/${epicSlug(issue.id)}) | ${count} | ${key} |`)
    }
    out.push('')
  }
  return out.join('\n')
}

// Delete stale .md files sitting directly inside an epic's child directory
// (not recursive) so renamed or removed features never leave orphan pages.
function clearStaleFeaturePages(epicDirAbs) {
  if (!existsSync(epicDirAbs)) return
  const entries = readdirSync(epicDirAbs, { withFileTypes: true })
  for (let i = 0; i < entries.length && i < MAX_FEATURES_PER_EPIC; i += 1) {
    const entry = entries[i]
    if (entry.isFile() && entry.name.endsWith('.md')) {
      rmSync(join(epicDirAbs, entry.name))
    }
  }
}

// Write docs/epics/*.md, its per-feature child pages, and the epics index.
// Returns the page count.
function syncEpicPages() {
  const { epics, byParent } = parseEpicSources()
  const dstDir = join(DOCS, EPICS_DST)
  const ok = ensureDir(dstDir)
  assert(ok, `could not create ${dstDir}`)
  const screenMap = loadScreenSlugMap()
  const grouped = new Map()
  const manifest = []
  let written = 0
  for (let i = 0; i < epics.length && i < MAX_EPICS; i += 1) {
    const entry = epics[i]
    const slug = epicSlug(entry.issue.id)
    const features = byParent.get(entry.issue.id) ?? []
    const dst = join(dstDir, `${slug}.md`)
    writeFileSync(dst, renderEpicPage(entry, features), 'utf8')
    assert(existsSync(dst), `write failed: ${dst}`)
    written += 1

    const epicDirAbs = join(dstDir, slug)
    clearStaleFeaturePages(epicDirAbs)
    const featurePages = []
    if (features.length > 0) {
      const okChild = ensureDir(epicDirAbs)
      assert(okChild, `could not create ${epicDirAbs}`)
      for (let j = 0; j < features.length && j < MAX_FEATURES_PER_EPIC; j += 1) {
        const f = features[j]
        const fSlug = featureSlug(f.id)
        const fDst = join(epicDirAbs, `${fSlug}.md`)
        writeFileSync(fDst, renderFeaturePage(entry, f, screenMap), 'utf8')
        assert(existsSync(fDst), `write failed: ${fDst}`)
        written += 1
        featurePages.push({ id: f.id, slug: fSlug, title: featureTitle(f), status: f.status ?? null })
      }
    }

    const band = entry.issue.band ?? 'PARKED'
    const list = grouped.get(band) ?? []
    list.push({ issue: entry.issue, count: features.length })
    grouped.set(band, list)
    manifest.push({
      id: entry.issue.id,
      slug,
      title: entry.issue.summary,
      band: entry.issue.band ?? null,
      features: features.length,
      jiraKey: EPIC_KEYS[entry.issue.id] ?? null,
      featurePages
    })
  }
  const idx = join(dstDir, 'index.md')
  writeFileSync(idx, renderEpicsIndex(grouped), 'utf8')
  assert(existsSync(idx), `write failed: ${idx}`)
  // The sidebar groups epics by band. It reads this manifest rather than
  // regexing the band back out of the rendered page, so the grouping depends on
  // structured data and not on how epicMetaLine happens to format itself.
  const missingBand = manifest.filter((m) => !m.band).map((m) => m.id)
  assert(missingBand.length === 0, `epic(s) with no band: ${missingBand.join(', ')}`)
  // features (count) and featurePages (array) state the same fact twice; the
  // sidebar falls back to a flat entry when featurePages is short, so a
  // mismatch would degrade the nav silently. Refuse to write one.
  const inconsistent = manifest.filter((m) => m.featurePages.length !== m.features).map((m) => m.id)
  assert(inconsistent.length === 0, `epic(s) with featurePages/features mismatch: ${inconsistent.join(', ')}`)
  const manifestPath = join(dstDir, 'epics.json')
  writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n', 'utf8')
  assert(existsSync(manifestPath), `write failed: ${manifestPath}`)
  return written + 1
}

// Write only the narrative above the first band H1. The epics themselves get
// their own pages, so repeating them here made a 1,544-line page with a 24-entry
// outline. The source file is untouched: jira-sync still needs it whole.
const BAND_H1 = /^#\s+(?!#)\s*(GREEN|ORANGE|GRAY|PARKED|SPRINT0)\b/m

function syncNarrativeOnly(srcAbs, dstAbs, title) {
  assert(existsSync(srcAbs), `source missing: ${srcAbs}`)
  const ok = ensureDir(dirname(dstAbs))
  assert(ok, `could not create directory for ${dstAbs}`)
  const body = readFileSync(srcAbs, 'utf8')
  const m = BAND_H1.exec(body)
  assert(m, `no band heading found in ${srcAbs}; refusing to guess where to cut`)
  const narrative = body.slice(0, m.index).trimEnd()
  assert(narrative.length > 0, `nothing above the first band heading in ${srcAbs}`)
  const tail = [
    '',
    '',
    '## The epics themselves',
    '',
    'Every epic has its own page, and every feature has its own page beneath',
    'it. Start at',
    '[Epics](/epics/), which groups them by band.',
    ''
  ].join('\n')
  const sourceRel = relPosix(ROOT, srcAbs)
  writeFileSync(dstAbs, header(title, sourceRel) + normalizeProse(narrative + tail), 'utf8')
  assert(existsSync(dstAbs), `write failed: ${dstAbs}`)
  return dstAbs
}

// Apply one rule; skip gracefully if its source does not exist yet.
function applyRule(rule) {
  assert(rule && rule.kind && rule.src && rule.dst, 'malformed rule')
  const srcAbs = join(ROOT, rule.src)
  if (!existsSync(srcAbs)) {
    process.stdout.write(`docs-sync: skip (no source) ${rule.src}\n`)
    return 0
  }
  if (rule.kind === 'file') {
    assert(statSync(srcAbs).isFile(), `expected a file: ${rule.src}`)
    syncFile(srcAbs, join(DOCS, rule.dst), rule.title)
    return 1
  }
  if (rule.kind === 'narrative') {
    assert(statSync(srcAbs).isFile(), `expected a file: ${rule.src}`)
    syncNarrativeOnly(srcAbs, join(DOCS, rule.dst), rule.title)
    return 1
  }
  assert(statSync(srcAbs).isDirectory(), `expected a directory: ${rule.src}`)
  const written = syncTree(srcAbs, join(DOCS, rule.dst), rule.title, rule.exclude)
  return written.length
}

function main() {
  assert(existsSync(ROOT), 'brain root not found')
  const ok = ensureDir(DOCS)
  assert(ok, 'docs/ directory could not be created')
  let total = 0
  for (let i = 0; i < RULES.length && i < MAX_FILES; i += 1) {
    total += applyRule(RULES[i])
  }
  total += syncEpicPages()
  process.stdout.write(`docs-sync: synced ${total} page(s)\n`)
}

// Only run when invoked directly (`node scripts/docs-sync.mjs`), not when
// imported for its pure functions by scripts/test-docs-sync.mjs.
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main()
}

export {
  isExcluded,
  parseSourceFrontmatter,
  shortFeatureId,
  stripJiraLine,
  featureSlug,
  extractScreenSlugs,
  resolveScreenCapture,
  renderCaptureBlock,
  loadScreenSlugMap
}
