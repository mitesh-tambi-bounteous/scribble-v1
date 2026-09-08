// sidebar.mts -- generate VitePress sidebar item lists from the docs/ file
// tree so individual pages can never go stale relative to the sidebar.
//
// Imported by config.ts (VitePress config runs in Node, so node:fs/node:path
// are available directly from a .mts file).
//
// Power-of-10 in spirit: small named functions, bounded loops with explicit
// caps, asserted invariants, no unbounded recursion (each tree shape below is
// known and walked explicitly rather than via a generic recursive walker).

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

// Hard caps so no loop can run unbounded.
const MAX_ENTRIES = 500

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const DOCS = join(SCRIPT_DIR, '..')

interface SidebarItem {
  text: string
  link?: string
  collapsed?: boolean
  items?: SidebarItem[]
}

function assert(cond: unknown, message: string): asserts cond {
  if (!cond) {
    throw new Error(`sidebar: ${message}`)
  }
}

// Turn a filename (no extension) into a readable fallback title.
function humanize(name: string): string {
  const words = name.replace(/\.md$/i, '').replace(/[-_]+/g, ' ').trim().split(' ')
  return words
    .filter((w) => w.length > 0)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

// Derive a display title for a markdown file: first H1 heading, else the
// generated frontmatter `title:` (with any "Group: " prefix stripped), else a
// humanized filename.
function titleFor(fileAbs: string, fallbackName: string): string {
  assert(typeof fileAbs === 'string' && fileAbs.length > 0, 'titleFor needs a path')
  const body = readFileSync(fileAbs, 'utf8')
  const lines = body.split('\n')
  for (let i = 0; i < lines.length && i < MAX_ENTRIES; i += 1) {
    const m = lines[i].match(/^#\s+(.+?)\s*$/)
    if (m) {
      return m[1]
    }
  }
  const fm = body.match(/^title:\s*"?(.+?)"?\s*$/m)
  if (fm) {
    const raw = fm[1]
    const idx = raw.lastIndexOf(': ')
    return idx >= 0 ? raw.slice(idx + 2) : raw
  }
  return humanize(fallbackName)
}

// List markdown files directly in a directory, excluding index/README pages.
// Returns bare filenames (with extension), not full paths.
function listMarkdownFiles(dirAbs: string): string[] {
  if (!existsSync(dirAbs)) {
    return []
  }
  const entries = readdirSync(dirAbs, { withFileTypes: true })
  assert(entries.length <= MAX_ENTRIES, `too many entries in ${dirAbs}`)
  const out: string[] = []
  for (let i = 0; i < entries.length; i += 1) {
    const e = entries[i]
    if (!e.isFile() || !e.name.toLowerCase().endsWith('.md')) {
      continue
    }
    const lower = e.name.toLowerCase()
    if (lower === 'index.md' || lower === 'readme.md') {
      continue
    }
    out.push(e.name)
  }
  return out
}

function stripExt(name: string): string {
  return name.replace(/\.md$/i, '')
}

// Build one sidebar item for a markdown file under a route prefix.
function itemFor(dirAbs: string, fileName: string, routePrefix: string): SidebarItem {
  const fileAbs = join(dirAbs, fileName)
  const text = titleFor(fileAbs, fileName)
  const link = `${routePrefix}${stripExt(fileName)}`
  return { text, link }
}

// Strip a leading story-number prefix ("S-001 -- ", ...) from a display label,
// leaving just the story title. Ordering is unaffected (filename localeCompare).
function stripStoryPrefix(text: string): string {
  return text.replace(/^S-\d+\s+--\s+/, '')
}

// ---- Stories: natural filename sort (S-001 < S-002 < ...). ----

// ---- Epics: generated pages, grouped by band. ----
//
// docs-sync writes docs/epics/eNN.md from the backlog sources. Band comes from
// the page's own metadata line rather than a second hardcoded list here, so the
// grouping cannot drift from what was generated.
const EPIC_BANDS: Array<[string, string]> = [
  ['SPRINT0', 'Sprint 0, the Shape window'],
  ['GREEN', 'Green, carries the daily loop'],
  ['ORANGE', 'Orange, earns a sprint slot'],
  ['GRAY', 'Gray, outside these eight weeks'],
  ['PARKED', 'Parked, built and switched off']
]

type EpicFeaturePage = {
  id: string
  slug: string
  title: string
  status: string | null
}

type EpicManifestEntry = {
  id: string
  slug: string
  title: string
  band: string
  features: number
  jiraKey: string | null
  featurePages: EpicFeaturePage[]
}

// docs-sync writes docs/epics/epics.json alongside the pages. Reading it beats
// regexing the band back out of rendered prose, which would break the moment
// the page's metadata line is reworded.
function readEpicManifest(dirAbs: string): EpicManifestEntry[] {
  const manifestAbs = join(dirAbs, 'epics.json')
  if (!existsSync(manifestAbs)) return []
  const parsed = JSON.parse(readFileSync(manifestAbs, 'utf8'))
  if (!Array.isArray(parsed)) return []
  return parsed as EpicManifestEntry[]
}

export function buildEpicsSidebar(): SidebarItem[] {
  const dirAbs = join(DOCS, 'epics')
  if (!existsSync(dirAbs)) return []
  const manifest = readEpicManifest(dirAbs)
  if (manifest.length === 0) return []
  const byId = [...manifest].sort((a, b) => a.id.localeCompare(b.id))
  const groups: SidebarItem[] = []
  for (const [band, caption] of EPIC_BANDS) {
    const inBand = byId.filter((e) => e.band === band)
    if (inBand.length === 0) continue
    groups.push({
      text: caption,
      collapsed: false,
      items: inBand.map((e) => {
        const pages = e.featurePages ?? []
        if (pages.length === 0) {
          return { text: e.title, link: `/epics/${e.slug}` }
        }
        return {
          text: e.title,
          link: `/epics/${e.slug}`,
          collapsed: true,
          items: pages.map((p) => ({
            text: `${p.id.replace(/^E\d{2}-/, '')} ${p.title}`,
            link: `/epics/${e.slug}/${p.slug}`
          }))
        }
      })
    })
  }
  return groups
}

export function buildStoriesSidebar(): SidebarItem[] {
  const dirAbs = join(DOCS, 'stories')
  const files = listMarkdownFiles(dirAbs)
  files.sort((a, b) => a.localeCompare(b))
  return files.map((f) => {
    const item = itemFor(dirAbs, f, '/stories/')
    return { ...item, text: stripStoryPrefix(item.text) }
  })
}

// ---- Workshops: workshop retros filed under knowledge/wiki/sources. ----
//
// Workshop retros are wiki source pages (source-type: workshop) filed under
// knowledge/wiki/sources; docs-sync preserves each page's own frontmatter in
// the synced body, so a `source-type: workshop` line reliably marks one. This
// keeps the wiki-ingestor filing convention intact while giving the site a
// dedicated Workshops section that never goes stale.

const WORKSHOP_SOURCES_ROUTE = '/knowledge/wiki/sources/'

function isWorkshopSource(fileAbs: string): boolean {
  assert(typeof fileAbs === 'string' && fileAbs.length > 0, 'isWorkshopSource needs a path')
  const body = readFileSync(fileAbs, 'utf8')
  return /^source-type:\s*workshop\b/m.test(body)
}

// Newest first: workshop filenames lead with an ISO date, so reverse sort.
export function buildWorkshopsSidebar(): SidebarItem[] {
  const dirAbs = join(DOCS, 'knowledge/wiki/sources')
  const files = listMarkdownFiles(dirAbs).filter((f) => isWorkshopSource(join(dirAbs, f)))
  files.sort((a, b) => b.localeCompare(a))
  return files.map((f) => itemFor(dirAbs, f, WORKSHOP_SOURCES_ROUTE))
}

// The most recent workshop page route, or null if none have landed yet. Used
// for the top-nav Workshops entry so it points at the latest retro.
export function latestWorkshopLink(): string | null {
  const items = buildWorkshopsSidebar()
  return items.length > 0 ? items[0].link ?? null : null
}

// ---- Context: nested groups mirroring disk structure. ----

// Architecture Designs: one page per ingested diagram under context/media,
// with an index landing page. Emitted by context-ingest; skip gracefully if the
// directory has not landed yet (no images ingested). Stays a media-stub group
// until a later merge absorbs it.
export function buildArchitectureGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'context/media')
  if (!existsSync(dirAbs)) {
    return null
  }
  const items: SidebarItem[] = []
  const files = listMarkdownFiles(dirAbs).sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/context/media/'))
  }
  if (items.length === 0) {
    return null
  }
  return { text: 'Architecture Designs', collapsed: true, items }
}

// Design History is hand-maintained source at product/context/design-history,
// rendered here by docs-sync; skip gracefully if it has not been synced yet.
export function buildDesignHistoryGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'context/design-history')
  if (!existsSync(dirAbs)) {
    return null
  }
  const items: SidebarItem[] = []
  const files = listMarkdownFiles(dirAbs).sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/context/design-history/'))
  }
  if (items.length === 0) {
    return null
  }
  return { text: 'Design History', collapsed: true, items }
}

// ---- Meetings: standups and client calls, split from one flat group. ----
//
// knowledge/meetings/ holds three kinds of pages: the running standups
// rollup, per-day standup notes (`*-standup.md`), and client-attended
// digests (kickoffs, workshops-as-calls, etc). Split on filename convention
// rather than a hardcoded list so a new standup file needs no sidebar edit.

function isStandupFile(fileName: string): boolean {
  return /-standup\.md$/i.test(fileName)
}

// Newest first: standup filenames lead with an ISO date, so reverse sort.
export function buildStandupsGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'knowledge/meetings')
  const files = listMarkdownFiles(dirAbs)
    .filter((f) => isStandupFile(f))
    .sort((a, b) => b.localeCompare(a))
  const items: SidebarItem[] = []
  if (existsSync(join(dirAbs, 'standups.md'))) {
    items.push({ text: 'All Standups', link: '/knowledge/meetings/standups' })
  }
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/knowledge/meetings/'))
  }
  if (items.length === 0) {
    return null
  }
  return { text: 'Standups', collapsed: true, items }
}

// Newest first, same convention as buildStandupsGroup.
export function buildClientCallsGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'knowledge/meetings')
  const files = listMarkdownFiles(dirAbs)
    .filter((f) => !isStandupFile(f) && f.toLowerCase() !== 'standups.md')
    .sort((a, b) => b.localeCompare(a))
  if (files.length === 0) {
    return null
  }
  return {
    text: 'Client Calls',
    collapsed: true,
    items: files.map((f) => itemFor(dirAbs, f, '/knowledge/meetings/'))
  }
}

// ---- Handbook: generated from the file tree, not hand-typed. ----
//
// Hand-typing this list was the root cause of pages going unreachable: any
// new handbook page (or whole subdirectory, like engineering/) needed a
// matching edit here that nobody remembered to make. Generate it instead, the
// same way Stories and Epics already are.

// A subdirectory's own index.md surfaces as that subgroup's home link, since
// listMarkdownFiles excludes index/README pages by convention.
function homeItemFor(dirAbs: string, routeIndexLink: string): SidebarItem | null {
  const indexAbs = join(dirAbs, 'index.md')
  if (!existsSync(indexAbs)) {
    return null
  }
  return { text: titleFor(indexAbs, 'index.md'), link: routeIndexLink }
}

function buildEngineeringPracticeGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'handbook/engineering')
  if (!existsSync(dirAbs)) {
    return null
  }
  const items: SidebarItem[] = []
  const home = homeItemFor(dirAbs, '/handbook/engineering/')
  if (home) {
    items.push(home)
  }
  const files = listMarkdownFiles(dirAbs).sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/handbook/engineering/'))
  }
  if (items.length === 0) {
    return null
  }
  return { text: 'Engineering Practice', collapsed: true, items }
}

function buildStoryAcKitGroup(): SidebarItem | null {
  const dirAbs = join(DOCS, 'handbook/story-ac-kit')
  if (!existsSync(dirAbs)) {
    return null
  }
  const items: SidebarItem[] = []
  const home = homeItemFor(dirAbs, '/handbook/story-ac-kit/')
  if (home) {
    items.push(home)
  }
  const files = listMarkdownFiles(dirAbs).sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/handbook/story-ac-kit/'))
  }
  if (items.length === 0) {
    return null
  }
  return { text: 'Story/AC Kit', collapsed: true, items }
}

// ---- Prototype: generated from the file tree, not hand-typed. ----
//
// The prototype tree is authored content, but it fans out fast: 9 flow pages
// and 28 screen pages, one per route template in the app's router.
// Hand-typing each addition here would repeat the handbook's old failure mode
// -- a new flow or screen page landing on disk with no sidebar entry pointing
// at it.
//
// Ordering is by DISPLAYED LABEL, not by filename, using a plain code-unit
// compare rather than localeCompare. Both parts matter, and each fixes a real
// wart the filename sort produced:
//   - Labels are route templates, so sorting on them puts "/" first and keeps
//     routes in route order. Sorting on filenames scattered "/" into the
//     middle of the list under its slug, "root-today".
//   - A plain compare puts a prefix before its extensions, so
//     "/wall/[id]/prompt-packs" precedes ".../[packId]" and
//     "/onboarding/story" precedes "/onboarding/story-select". localeCompare
//     ignores punctuation and reversed both, listing each child above its
//     parent.
function buildPrototypeSubgroup(subdir: string, label: string, routePrefix: string): SidebarItem | null {
  const dirAbs = join(DOCS, `prototype/${subdir}`)
  if (!existsSync(dirAbs)) {
    return null
  }
  const files = listMarkdownFiles(dirAbs)
  const pages: SidebarItem[] = []
  for (let i = 0; i < files.length; i += 1) {
    pages.push(itemFor(dirAbs, files[i], routePrefix))
  }
  pages.sort((a, b) => (a.text < b.text ? -1 : a.text > b.text ? 1 : 0))

  const items: SidebarItem[] = []
  // Label the landing "Overview" rather than taking its H1, which reads
  // "Prototype workflows" and nests as Prototype > Workflows > Prototype
  // workflows. The page keeps its own descriptive H1; only the nav label is
  // fixed here. It leads the group, ahead of the sorted pages.
  if (existsSync(join(dirAbs, 'index.md'))) {
    items.push({ text: 'Overview', link: routePrefix })
  }
  for (let i = 0; i < pages.length; i += 1) {
    items.push(pages[i])
  }
  if (items.length === 0) {
    return null
  }
  return { text: label, collapsed: true, items }
}

export function buildPrototypeGroups(): SidebarItem[] {
  const dirAbs = join(DOCS, 'prototype')
  if (!existsSync(dirAbs)) {
    return []
  }
  const groups: SidebarItem[] = []
  const workflows = buildPrototypeSubgroup('workflows', 'Workflows', '/prototype/workflows/')
  if (workflows) {
    groups.push(workflows)
  }
  const screens = buildPrototypeSubgroup('screens', 'Screens', '/prototype/screens/')
  if (screens) {
    groups.push(screens)
  }
  return groups
}

export function buildHandbookGroup(): SidebarItem[] {
  const dirAbs = join(DOCS, 'handbook')
  const items: SidebarItem[] = []
  const home = homeItemFor(dirAbs, '/handbook/')
  if (home) {
    items.push(home)
  }
  const files = listMarkdownFiles(dirAbs).sort((a, b) => a.localeCompare(b))
  for (let i = 0; i < files.length; i += 1) {
    items.push(itemFor(dirAbs, files[i], '/handbook/'))
  }
  const engineeringGroup = buildEngineeringPracticeGroup()
  if (engineeringGroup) {
    items.push(engineeringGroup)
  }
  const storyAcKitGroup = buildStoryAcKitGroup()
  if (storyAcKitGroup) {
    items.push(storyAcKitGroup)
  }
  return items
}
