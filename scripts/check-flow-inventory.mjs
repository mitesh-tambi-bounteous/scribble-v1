#!/usr/bin/env node
// Validates product/design/screen-flow-inventory.md: every router screen has a
// flow, every flow cites real screens and is cited by at least one screen, and
// the "four numbers" table reconciles against what the document's own table says.
// This is the mechanical check the doc promises in its "Orphan screens" section.
import { readFileSync } from 'node:fs';

const DEFAULT_PATH = 'product/design/screen-flow-inventory.md';
const MAX_LINES = 5000; // bound: this doc will never be this long; guards a runaway parse

// Fatal parse errors (malformed doc structure) still exit immediately: there is
// nothing sound left to check. Content assertions below use recordFailure so a
// single bad row surfaces every check it breaks, not just the first one hit.
function fail(msg) {
  console.error(`FAIL: ${msg}`);
  process.exit(1);
}

const failures = [];
function recordFailure(msg) {
  failures.push(msg);
}

// Grab the lines of a markdown table that starts right after a heading line
// matching headingRe, stopping at the first blank line or next heading.
// A duplicated or decoy heading would silently make every check below validate
// the wrong table, so require exactly one match rather than taking the first.
function extractTableRows(lines, headingRe) {
  const matches = [];
  for (let i = 0; i < Math.min(lines.length, MAX_LINES); i++) {
    if (headingRe.test(lines[i])) matches.push(i);
  }
  if (matches.length === 0) fail(`could not find heading matching ${headingRe}`);
  if (matches.length > 1) {
    fail(`heading ${headingRe} appears ${matches.length} times, on lines ${matches.map((i) => i + 1).join(', ')}`);
  }
  const start = matches[0];
  const rows = [];
  let sawHeaderSep = false;
  for (let i = start + 1; i < Math.min(lines.length, start + MAX_LINES); i++) {
    const line = lines[i];
    if (line.startsWith('##') && i !== start) break;
    if (!line.trim().startsWith('|')) {
      if (sawHeaderSep) break; // table ended
      continue;
    }
    if (/^\|[\s-:|]+\|$/.test(line.trim())) {
      sawHeaderSep = true;
      continue;
    }
    if (sawHeaderSep) rows.push(line);
  }
  return rows;
}

function splitCells(row) {
  // Drop the leading and trailing pipe, then split on every pipe. No cell in
  // this table contains a literal pipe, so no escape handling is needed.
  return row.trim().replace(/^\|/, '').replace(/\|$/, '').split('|').map((c) => c.trim());
}

// --- Screen inventory table -------------------------------------------------
function parseScreenTable(lines) {
  const rows = extractTableRows(lines, /^## Screen inventory$/);
  if (rows.length === 0) fail('screen inventory table is empty or missing');
  const screens = [];
  for (const row of rows) {
    const cells = splitCells(row);
    if (cells.length < 4) fail(`malformed screen row, expected 4 columns: ${row}`);
    const route = cells[0].replace(/`/g, '').trim();
    const flowsCell = cells[2];
    const flowIds = (flowsCell.match(/F\d+/g) || []);
    // The capture column is the document's own claim about whether the capture
    // reached this screen. "not captured" is the only value meaning unreached;
    // "no, shows /draw" still means reached, just showing the wrong screen.
    const captureCell = cells[3].toLowerCase();
    const reached = captureCell.length > 0 && !captureCell.startsWith('not captured');
    screens.push({ route, flowIds, reached });
  }
  return screens;
}

// --- Flow inventory sections -------------------------------------------------
function parseFlowSections(lines) {
  const flowStartRe = /^### (F\d+) /;
  const sections = [];
  const inventoryStart = lines.findIndex((l) => /^## Flow inventory$/.test(l));
  if (inventoryStart === -1) fail('could not find "## Flow inventory" heading');
  for (let i = inventoryStart + 1; i < lines.length; i++) {
    const m = flowStartRe.exec(lines[i]);
    if (!m) continue;
    const id = m[1];
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      if (/^##\s/.test(lines[j]) || flowStartRe.test(lines[j])) { end = j; break; }
    }
    const body = lines.slice(i + 1, end).join('\n');
    const routes = new Set((body.match(/`\/[^`]*`/g) || []).map((t) => t.replace(/`/g, '')));
    sections.push({ id, routes });
  }
  if (sections.length === 0) fail('no "### F<N>" flow sections found');
  return sections;
}

// --- The four numbers table ---------------------------------------------------
function parseFourNumbers(lines) {
  const rows = extractTableRows(lines, /^## The four numbers$/);
  const values = [];
  for (const row of rows) {
    const cells = splitCells(row);
    if (cells.length < 2) fail(`malformed four-numbers row: ${row}`);
    const n = Number.parseInt(cells[1], 10);
    if (!Number.isInteger(n)) fail(`non-integer value in four-numbers table: ${row}`);
    values.push(n);
  }
  if (values.length !== 4) fail(`expected 4 rows in the four-numbers table, found ${values.length}`);
  const [routerScreens, reachedByCapture, placedStated, orphanStated] = values;
  return { routerScreens, reachedByCapture, placedStated, orphanStated };
}

function main() {
  const path = process.argv[2] || DEFAULT_PATH;
  const text = readFileSync(path, 'utf8');
  const lines = text.split('\n');
  if (lines.length > MAX_LINES) fail(`file exceeds ${MAX_LINES} lines, refusing to parse`);

  const screens = parseScreenTable(lines);
  const flows = parseFlowSections(lines);
  const flowIds = new Set(flows.map((f) => f.id));
  const routes = new Set(screens.map((s) => s.route));

  // ORPHAN CHECK: a screen row with no flow IDs is an orphan.
  const orphans = screens.filter((s) => s.flowIds.length === 0).map((s) => s.route);
  if (orphans.length > 0) {
    recordFailure(`orphan screen(s) with no Flows entry: ${orphans.join(', ')}`);
  }

  // Every flow ID cited by a screen must exist as a section.
  for (const s of screens) {
    for (const fid of s.flowIds) {
      if (!flowIds.has(fid)) {
        recordFailure(`screen ${s.route} cites flow ${fid}, which has no "### ${fid}" section`);
      }
    }
  }

  // Every route named inside a flow section must be an inventoried screen.
  for (const f of flows) {
    for (const r of f.routes) {
      if (!routes.has(r)) {
        recordFailure(`flow ${f.id} references route ${r}, which is not a row in the screen inventory table`);
      }
    }
  }

  // Every flow section must be cited by at least one screen (catches an empty flow).
  const citedFlowIds = new Set(screens.flatMap((s) => s.flowIds));
  for (const f of flows) {
    if (!citedFlowIds.has(f.id)) {
      recordFailure(`flow ${f.id} is not cited by any screen in the inventory table`);
    }
  }

  // RECONCILIATION: count placed/orphaned directly from the table, independent
  // of anything the four-numbers table claims, then cross-check both.
  const countedPlaced = screens.filter((s) => s.flowIds.length > 0 && s.route !== '/+not-found').length;
  const countedOrphaned = screens.filter((s) => s.flowIds.length === 0 && s.route !== '/+not-found').length;
  const countedRouterRows = screens.filter((s) => s.route !== '/+not-found').length;

  const four = parseFourNumbers(lines);

  if (countedRouterRows !== four.routerScreens) {
    recordFailure(
      `router screen count mismatch: table has ${countedRouterRows} rows (excluding /+not-found), ` +
      `four-numbers table states ${four.routerScreens}`
    );
  }
  if (countedPlaced + countedOrphaned !== four.routerScreens) {
    recordFailure(
      `reconciliation failed: counted placed (${countedPlaced}) + counted orphaned (${countedOrphaned}) ` +
      `= ${countedPlaced + countedOrphaned}, does not equal router screens (${four.routerScreens})`
    );
  }
  // Without this the "reached by capture" number would be the one figure in the
  // four-numbers table that nothing verifies, and the doc promises all four
  // reconcile.
  const countedReached = screens.filter((s) => s.reached && s.route !== '/+not-found').length;
  if (countedReached !== four.reachedByCapture) {
    recordFailure(
      `"reached by the capture" mismatch: four-numbers table states ${four.reachedByCapture}, ` +
      `counted ${countedReached} from the capture column`
    );
  }
  if (countedPlaced !== four.placedStated) {
    recordFailure(`"placed in a flow" mismatch: four-numbers table states ${four.placedStated}, counted ${countedPlaced}`);
  }
  if (countedOrphaned !== four.orphanStated) {
    recordFailure(`"orphan screens" mismatch: four-numbers table states ${four.orphanStated}, counted ${countedOrphaned}`);
  }

  if (failures.length > 0) {
    for (const msg of failures) console.error(`FAIL: ${msg}`);
    process.exit(1);
  }

  console.log(
    `OK: ${countedRouterRows} router screens, ${countedPlaced} placed, ${countedOrphaned} orphaned, ` +
    `${countedReached} reached, ${flows.length} flows, ${screens.length} table rows.`
  );
}

main();
