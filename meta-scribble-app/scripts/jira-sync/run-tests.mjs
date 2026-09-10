#!/usr/bin/env node
// run-tests.mjs -- discovers test-*.mjs in this directory and runs each as a
// separate node process, sequentially, streaming its output. Not wired into
// package.json; this repo's npm test is owned elsewhere.
//
// Power-of-10: bounded file list, every spawn checked, one exit code.

import { spawnSync } from 'node:child_process'
import { readdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const HERE = dirname(fileURLToPath(import.meta.url))
const MAX_TEST_FILES = 200

function discoverTestFiles() {
  const entries = readdirSync(HERE)
  if (entries.length > MAX_TEST_FILES * 4) {
    throw new Error('run-tests: directory has an unexpected number of entries')
  }
  const tests = entries.filter((f) => f.startsWith('test-') && f.endsWith('.mjs'))
  if (tests.length > MAX_TEST_FILES) throw new Error('run-tests: too many test files')
  tests.sort()
  return tests
}

function main() {
  const files = discoverTestFiles()
  let passed = 0
  let failed = 0
  for (const file of files) {
    process.stdout.write(`\n--- running ${file} ---\n`)
    const result = spawnSync('node', [join(HERE, file)], { stdio: 'inherit' })
    if (result.status === 0) {
      passed += 1
    } else {
      failed += 1
      process.stderr.write(`--- ${file} FAILED (exit ${result.status}) ---\n`)
    }
  }
  process.stdout.write(`\nrun-tests: ${passed} passed, ${failed} failed, ${files.length} total\n`)
  process.exit(failed > 0 ? 1 : 0)
}

main()
