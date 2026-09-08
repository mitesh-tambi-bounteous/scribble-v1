// parse.mjs -- format-detection facade over the three story-doc formats.
//
// Detection order is fixed and documented in DESIGN.md: backlog, then v1,
// then v3-by-elimination. First match wins; do not reorder these checks.

import { makeProblem } from './model.mjs'
import { parseV3 } from './parse-v3.mjs'
import { parseBacklog } from './parse-backlog.mjs'

const BACKLOG_RE = /^`id: E\d{2} \| band:/m
const V1_RE = /^\*\*[A-Z][A-Z0-9]+-\d+:/m

export function parseFile(text, { fileName = 'unknown.md' } = {}) {
  if (typeof text !== 'string' || text.trim() === '') {
    throw new Error('parseFile: text must be a non-empty string')
  }
  if (BACKLOG_RE.test(text)) {
    return parseBacklog(text, { fileName })
  }
  if (V1_RE.test(text)) {
    return {
      format: 'v1',
      epicName: null,
      issues: [],
      problems: [
        makeProblem({
          severity: 'error',
          rule: 'legacy-v1',
          message: `${fileName} is V1 legacy format and is not parsed. Convert it to V3 ` +
            'using the template at handbook/story-ac-kit/templates/story-v3-jira.md.',
          file: fileName,
          line: 1,
        }),
      ],
    }
  }
  return parseV3(text, { fileName })
}
