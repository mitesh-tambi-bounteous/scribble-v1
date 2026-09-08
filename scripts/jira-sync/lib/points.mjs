// points.mjs -- the one place that turns a `size:` lane-days string into a
// story-point value for Jira.
//
// Why a mapping and not the raw number: the `size:` metadata is capacity
// accounting (backend-days, design-days), not a difficulty estimate. Sending
// lane-days straight into the client-visible story-points field would publish
// planning detail and read as an authoritative estimate. Snapping onto the
// Fibonacci scale makes the number read as a rough difficulty point value.
// The one caller is the backlog parser, which pairs it with the
// ROUGH_POINTS_LABEL so the team knows to re-point. The V3 format is out of
// scope here: its `**Points:**` value is a story-point number a human already
// wrote, so it goes to Jira untouched and unlabelled.
//
// Power-of-10: no loops, asserted input, explicit throws, and null (never 0 or
// NaN) when the size string carries no leading integer.

export const ROUGH_POINTS_LABEL = 'rough-points'

// Upper bound on lane-days we will accept. A single feature sized past this is
// a data error in the backlog, not a 200-point story. roughPointsFromSize
// returns null for it; the backlog parser turns that null-with-a-number into a
// visible warning so the data error is not mistaken for "not sized".
const MAX_LANE_DAYS = 365

const LEADING_INTEGER_RE = /^\s*(\d+)/

// Maps lane-days onto the Fibonacci difficulty scale:
//   1 -> 1, 2 -> 2, 3 -> 3, 4-5 -> 5, 6-8 -> 8, 9+ -> 13
export function snapToFibonacciPoints(laneDays) {
  if (!Number.isInteger(laneDays) || laneDays < 1) {
    throw new Error(`snapToFibonacciPoints: laneDays must be an integer >= 1, got ${laneDays}`)
  }
  if (laneDays > MAX_LANE_DAYS) {
    throw new Error(`snapToFibonacciPoints: laneDays ${laneDays} exceeds MAX_LANE_DAYS ${MAX_LANE_DAYS}`)
  }
  if (laneDays <= 3) return laneDays
  if (laneDays <= 5) return 5
  if (laneDays <= 8) return 8
  return 13
}

// Reads a `size:` metadata value ("4 backend-days", "not sized") and returns
// the rough difficulty points, or null when there is no leading integer.
// Null means "no estimate", which is what the field carries today for unsized
// features; it is never coerced to 0.
export function roughPointsFromSize(sizeRaw) {
  if (sizeRaw === null || sizeRaw === undefined) return null
  if (typeof sizeRaw !== 'string') {
    throw new TypeError('roughPointsFromSize: sizeRaw must be a string, null, or undefined')
  }
  const m = LEADING_INTEGER_RE.exec(sizeRaw)
  if (!m) return null
  const laneDays = Number.parseInt(m[1], 10)
  if (!Number.isInteger(laneDays) || laneDays < 1) return null
  if (laneDays > MAX_LANE_DAYS) return null
  return snapToFibonacciPoints(laneDays)
}
