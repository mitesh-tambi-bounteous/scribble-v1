#!/usr/bin/env node
// test-docs-fresh.mjs -- fails when docs/ does not match what docs-sync.mjs
// would generate from product/, tracking/, handbook/, reviews/ and knowledge/.
//
// This is a freshness gate, not a logic test. scripts/test-docs-sync.mjs proves
// the generator's pure functions behave; it never looks at the tree. Without
// this check main can sit stale against its own generator, which it did through
// 2026-08-25 (24 pages).
//
// Method: digest every generated page, run the real sync, digest again. Any page
// whose content moved means a source was edited without re-rendering, or a
// generated page was hand-edited. Both are the same defect to a reader.
//
// Do not use `git status --porcelain` for this. It reports only that a file
// changed, not what it now holds, so a page already dirty in the working tree
// looks identical before and after the sync and the gate passes a stale tree.
// Verified: appending to a source whose rendered page was already modified was
// not caught by a porcelain comparison.
//
// Power-of-10 in spirit: bounded walk depth and file count, asserted invariants,
// every child process status checked, non-zero exit on any failure.

import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const SYNC = 'scripts/docs-sync.mjs'
const DOCS = 'docs'
const SKIP = '.vitepress'
const MAX_DEPTH = 12
const MAX_FILES = 4000

function run(cmd, args) {
  return execFileSync(cmd, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })
}

// Returns a sorted "path sha1" line per generated page. Bounded on both depth
// and count so a symlink loop or a runaway generator cannot hang the gate.
function digest(dir, depth, acc) {
  if (depth > MAX_DEPTH) throw new Error(`docs/ nested deeper than ${MAX_DEPTH}: ${dir}`)
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === SKIP) continue
    const path = join(dir, entry.name)
    if (entry.isDirectory()) {
      digest(path, depth + 1, acc)
      continue
    }
    if (!entry.isFile() || !entry.name.endsWith('.md')) continue
    if (acc.length >= MAX_FILES) throw new Error(`more than ${MAX_FILES} pages under docs/`)
    acc.push(`${path} ${createHash('sha1').update(readFileSync(path)).digest('hex')}`)
  }
  return acc
}

function snapshot() {
  const lines = digest(DOCS, 0, []).sort()
  if (lines.length === 0) throw new Error('no generated pages found under docs/')
  return lines
}

// The pages whose digest line differs between the two snapshots.
function changed(before, after) {
  const map = new Map(before.map((l) => [l.slice(0, l.lastIndexOf(' ')), l]))
  const out = []
  for (const line of after) {
    const path = line.slice(0, line.lastIndexOf(' '))
    if (map.get(path) !== line) out.push(path)
    map.delete(path)
  }
  for (const path of map.keys()) out.push(`${path} (no longer generated)`)
  return out
}

// Compare the tree against the generator, not against HEAD. Uncommitted but
// freshly rendered pages must pass, or the gate would block the normal loop of
// editing a source and re-rendering before committing.
function main() {
  let before
  try {
    before = snapshot()
  } catch (err) {
    process.stderr.write(`FAIL: cannot digest docs/: ${err.message}\n`)
    return 1
  }

  try {
    run('node', [SYNC])
  } catch (err) {
    process.stderr.write(`FAIL: ${SYNC} exited non-zero: ${err.message}\n`)
    return 1
  }

  let after
  try {
    after = snapshot()
  } catch (err) {
    process.stderr.write(`FAIL: cannot digest docs/ after the sync: ${err.message}\n`)
    return 1
  }

  const moved = changed(before, after)
  if (moved.length > 0) {
    process.stderr.write(
      `FAIL: ${moved.length} page(s) under docs/ are stale against their own ` +
      'generator. Run `npm run docs:sync` and commit docs/ in the same change.\n' +
      moved.map((p) => `  ${p}\n`).join(''),
    )
    return 1
  }

  process.stdout.write(`ok: docs/ matches its sources, ${after.length} page(s) checked\n`)
  return 0
}

process.exit(main())
