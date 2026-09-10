#!/usr/bin/env node
// test-bootstrap-sync.mjs -- the developer bootstrap script is reproduced inside
// handbook/engineering/developer-bootstrap.md so it can be read without cloning
// the build repository. A copy can drift from its original, and a bootstrap page
// that describes a script the machine does not run is exactly the failure this
// handbook designs against everywhere else. This asserts the two are identical.
//
// The build repository is a sibling clone and may not be present: on a machine
// without it, this skips rather than fails, because a missing clone is not a
// drift and failing on it would make the suite unrunnable for anyone who only
// wants the brain.
//
// Power-of-10 in spirit: bounded work, checked returns, small named functions,
// inputs asserted before use.

import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const SCRIPT_DIR = dirname(fileURLToPath(import.meta.url))
const ROOT = join(SCRIPT_DIR, '..')
const PAGE = join(ROOT, 'handbook', 'engineering', 'developer-bootstrap.md')
const SIBLING = join(ROOT, '..', 'scribl-mobile', 'scripts', 'bootstrap.sh')

const FENCE_OPEN = '```bash'
const FENCE_CLOSE = '```'

// Pull the single fenced bash block out of the page. Asserts there is exactly
// one, because two would make "the script" ambiguous.
function extractFencedScript(markdown) {
  if (typeof markdown !== 'string' || markdown.length === 0) {
    throw new Error('developer-bootstrap.md is empty or unreadable')
  }
  const lines = markdown.split('\n')
  const opens = []
  const closes = []
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i] === FENCE_OPEN) opens.push(i)
    else if (lines[i] === FENCE_CLOSE) closes.push(i)
  }
  if (opens.length !== 1) {
    throw new Error(`expected exactly one ${FENCE_OPEN} fence, found ${opens.length}`)
  }
  const close = closes.find((i) => i > opens[0])
  if (close === undefined) throw new Error('unterminated bash fence')
  return lines.slice(opens[0] + 1, close).join('\n')
}

function firstDifferingLine(a, b) {
  const al = a.split('\n')
  const bl = b.split('\n')
  const max = Math.max(al.length, bl.length)
  for (let i = 0; i < max; i += 1) {
    if (al[i] !== bl[i]) {
      return { line: i + 1, page: al[i] ?? '(end of file)', script: bl[i] ?? '(end of file)' }
    }
  }
  return null
}

function main() {
  if (!existsSync(PAGE)) {
    console.error('FAIL: handbook/engineering/developer-bootstrap.md is missing')
    process.exit(1)
  }
  const reproduced = extractFencedScript(readFileSync(PAGE, 'utf8')).trimEnd()

  if (!existsSync(SIBLING)) {
    console.log('skip: scribl-mobile is not cloned alongside this repo, nothing to compare')
    return
  }
  const actual = readFileSync(SIBLING, 'utf8').trimEnd()

  const diff = firstDifferingLine(reproduced, actual)
  if (diff !== null) {
    console.error('FAIL: the bootstrap script and its handbook reproduction have drifted.')
    console.error(`  first difference at line ${diff.line}`)
    console.error(`  handbook page: ${diff.page}`)
    console.error(`  bootstrap.sh : ${diff.script}`)
    console.error('  Update both in the same unit of work.')
    process.exit(1)
  }
  console.log(`ok: bootstrap.sh matches its handbook reproduction, ${reproduced.split('\n').length} lines`)
}

main()
