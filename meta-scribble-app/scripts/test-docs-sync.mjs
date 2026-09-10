#!/usr/bin/env node
// test-docs-sync.mjs -- deterministic tests for the pure functions in
// docs-sync.mjs: exclude matching, source frontmatter parsing, and the epic
// helpers. Does not run a full sync; no filesystem writes.
//
// Power-of-10 in spirit: a small fixed table of cases, a bounded loop, an
// asserted invariant, non-zero exit on any failure. Run with `npm test`.

import {
  isExcluded,
  parseSourceFrontmatter,
  shortFeatureId,
  stripJiraLine,
  featureSlug,
  extractScreenSlugs,
  resolveScreenCapture,
  renderCaptureBlock
} from './docs-sync.mjs'

let failures = 0

function show(s) {
  return JSON.stringify(s)
}

function expectEquals(label, got, expected) {
  const gotStr = JSON.stringify(got)
  const expectedStr = JSON.stringify(expected)
  if (gotStr !== expectedStr) {
    failures += 1
    process.stderr.write(`FAIL: ${label}: expected ${show(expected)}, got ${show(got)}\n`)
  } else {
    process.stdout.write(`ok: ${label}\n`)
  }
}

// ---- isExcluded ----

expectEquals('isExcluded: exact file match', isExcluded('a.md', ['a.md']), true)
expectEquals('isExcluded: no match', isExcluded('b.md', ['a.md']), false)
expectEquals('isExcluded: trailing-slash subtree match', isExcluded('raw/x.md', ['raw/']), true)
expectEquals('isExcluded: trailing-slash matches root of subtree', isExcluded('raw', ['raw/']), true)
expectEquals('isExcluded: no excludes', isExcluded('a.md', []), false)
expectEquals("isExcluded: 'raw/x.md' does not match 'meetings/raw/' exclude",
  isExcluded('raw/x.md', ['meetings/raw/']), false)
expectEquals("isExcluded: 'meetings/raw/x.md' does not match 'raw/' exclude",
  isExcluded('meetings/raw/x.md', ['raw/']), false)
expectEquals("isExcluded: 'meetings/raw/x.md' matches 'meetings/raw/' exclude",
  isExcluded('meetings/raw/x.md', ['meetings/raw/']), true)

// ---- parseSourceFrontmatter ----

const REAL_FM = '---\ntitle: Ignored\nstatus: active\n---\nBody text.\n'
const fmResult = parseSourceFrontmatter(REAL_FM)
expectEquals('parseSourceFrontmatter: real frontmatter parses fields', fmResult && fmResult.fields.status, 'active')
expectEquals('parseSourceFrontmatter: real frontmatter strips body', fmResult && fmResult.rest, 'Body text.\n')
expectEquals('parseSourceFrontmatter: title line dropped from passthrough',
  fmResult && fmResult.passthroughLines.some((l) => /^title:/i.test(l)), false)

const THEMATIC_BREAK = '---\nThis is a normal paragraph that happens to start\nright after a thematic break.\n---\nMore text follows.\n'
expectEquals('parseSourceFrontmatter: thematic-break body returns null', parseSourceFrontmatter(THEMATIC_BREAK), null)

const NO_FM = 'Just a plain body.\n\nNo frontmatter here.\n'
expectEquals('parseSourceFrontmatter: no frontmatter returns null', parseSourceFrontmatter(NO_FM), null)

const FM_WITH_CONTINUATION = '---\nlabels: [a, b]\n  more: indented continuation\n---\nBody.\n'
const contResult = parseSourceFrontmatter(FM_WITH_CONTINUATION)
expectEquals('parseSourceFrontmatter: indented continuation line still counts as frontmatter',
  contResult !== null, true)

// ---- epic helpers ----

expectEquals('shortFeatureId: strips epic prefix', shortFeatureId('E02-F1'), 'F1')
expectEquals('shortFeatureId: falls back to full id when no prefix', shortFeatureId('weird-id'), 'weird-id')

expectEquals('stripJiraLine: drops the jira line', stripJiraLine('jira: SCRIBL Epic\nReal description.'), 'Real description.')
expectEquals('stripJiraLine: leaves other lines untouched', stripJiraLine('Line one.\nLine two.'), 'Line one.\nLine two.')
expectEquals('stripJiraLine: no jira line is a no-op', stripJiraLine('Just text.'), 'Just text.')

// ---- featureSlug ----

expectEquals('featureSlug: strips epic prefix and lowercases', featureSlug('E02-F7'), 'f7')
expectEquals('featureSlug: sanitizes ids with no epic prefix', featureSlug('Weird Id!!'), 'weird-id')

// ---- extractScreenSlugs ----

expectEquals('extractScreenSlugs: pulls a single slug',
  extractScreenSlugs('Full detail on the [avatar screen page](/prototype/screens/avatar).'),
  ['avatar'])
expectEquals('extractScreenSlugs: dedupes repeated links',
  extractScreenSlugs('[a](/prototype/screens/avatar) and again [a](/prototype/screens/avatar)'),
  ['avatar'])
expectEquals('extractScreenSlugs: no links returns empty array',
  extractScreenSlugs('No screen links here.'),
  [])
expectEquals('extractScreenSlugs: multiple distinct slugs in order',
  extractScreenSlugs('[x](/prototype/screens/onboarding-canvas) [y](/prototype/screens/avatar)'),
  ['onboarding-canvas', 'avatar'])

// ---- resolveScreenCapture ----

const fakeMap = new Map([['avatar', { tile: '10-avatar.png', route: '/avatar' }]])
const resolved = resolveScreenCapture('avatar', fakeMap)
expectEquals('resolveScreenCapture: resolves a known slug', resolved, { tile: '10-avatar.png', route: '/avatar', slug: 'avatar' })

let threw = false
try {
  resolveScreenCapture('not-a-real-slug', fakeMap)
} catch (e) {
  threw = /unknown screen slug/.test(String(e.message))
}
expectEquals('resolveScreenCapture: throws loudly on an unknown slug', threw, true)

// ---- renderCaptureBlock ----

expectEquals('renderCaptureBlock: empty input renders nothing', renderCaptureBlock([]), '')
expectEquals('renderCaptureBlock: single capture floats right',
  renderCaptureBlock([{ tile: '10-avatar.png', route: '/avatar', slug: 'avatar' }]).includes('float:right'), true)
expectEquals('renderCaptureBlock: multiple captures render a flex row',
  renderCaptureBlock([
    { tile: '1.png', route: '/a', slug: 'a' },
    { tile: '2.png', route: '/b', slug: 'b' }
  ]).includes('display:flex'), true)

if (failures > 0) {
  process.stderr.write(`\ntest-docs-sync: ${failures} assertion(s) failed\n`)
  process.exit(1)
}
process.stdout.write('\ntest-docs-sync: all assertions passed\n')
process.exit(0)
