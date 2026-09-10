#!/usr/bin/env node
// Drives artifacts/scribl-backlog-epics-v2.html in headless Chromium from a
// file:// URL with the network hard-blocked, which is the one claim the artifact
// makes that cannot be checked by reading the HTML: that it renders complete
// with no repo checkout and no network.
//
// Checks, per tab: the tab switches, its panel is not empty, and every capture
// on it has actually painted. Plus, globally: no console error, and zero network
// requests attempted. A relative <img src> or a CDN font would break the offline
// contract while still looking fine on a dev machine, and both show up here as a
// blocked request rather than as a visual defect nobody notices.
//
// Not in the default `npm test` chain: playwright is not a dependency of this
// repo. Run it with `npm run test:artifact` after `npm run backlog:v2`.
//
// Power-of-10 in spirit: bounded loops, asserted invariants, checked returns.
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const TARGET = process.argv[2] || 'artifacts/scribl-backlog-epics-v2.html';
const MAX_TABS = 64; // bound: 19 epics plus a handful of framing tabs
const MIN_PANEL_CHARS = 200; // a panel shorter than this is an empty box

const failures = [];
function check(cond, msg) {
  if (!cond) failures.push(msg);
  return cond;
}

const file = resolve(process.cwd(), TARGET);
if (!existsSync(file)) {
  console.error(`FAIL: ${TARGET} does not exist. Run npm run backlog:v2 first.`);
  process.exit(1);
}

// Playwright is deliberately not a dependency of this repo, so resolve it from
// wherever it is installed. PLAYWRIGHT_MODULE lets a caller point at a global or
// npx copy without adding 300MB of browsers to this project's lockfile.
let chromium;
for (const spec of ['playwright', process.env.PLAYWRIGHT_MODULE].filter(Boolean)) {
  try {
    ({ chromium } = await import(spec));
    break;
  } catch (err) {
    // Only "not installed here" is worth trying the next candidate for. A
    // corrupt install or a missing native binary must not be reported as
    // "playwright is not available", which sends debugging the wrong way.
    if (err?.code !== 'ERR_MODULE_NOT_FOUND') throw err;
  }
}
if (!chromium) {
  console.error('FAIL: playwright is not available. Install it, or set '
    + 'PLAYWRIGHT_MODULE to an installed copy, then retry.');
  process.exit(1);
}

const browser = await chromium.launch();
const context = await browser.newContext();

// Let the file:// document and any sibling file read through, block everything
// else. A recorded attempt means the page reached for something it should have
// carried inline, which is exactly the failure this gate exists to catch.
const attempted = [];
await context.route('**/*', (route) => {
  const url = route.request().url();
  if (url.startsWith('file://')) return route.continue();
  attempted.push(url);
  return route.abort();
});

const page = await context.newPage();
const consoleErrors = [];
page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text()); });
page.on('pageerror', (e) => consoleErrors.push(String(e)));

await page.goto(pathToFileURL(file).href, { waitUntil: 'load' });

const tabs = await page.$$eval('.tabs button[data-tab]', (els) =>
  els.map((e) => e.dataset.tab));
check(tabs.length > 0, 'no tab buttons rendered at all');
check(tabs.length <= MAX_TABS, `more tabs than the bound allows: ${tabs.length}`);

// Every epic E00 through E18 must have a tab. This is the "nothing dropped"
// criterion, checked against the rendered DOM rather than the generator's own
// bookkeeping.
for (let n = 0; n <= 18; n++) {
  const id = 'E' + String(n).padStart(2, '0');
  check(tabs.includes(id), `epic ${id} has no tab`);
}

let tilesSeen = 0;
const tilesByTab = new Map();
for (const tab of tabs.slice(0, MAX_TABS)) {
  await page.click(`.tabs button[data-tab="${tab}"]`);
  const panel = await page.$(`#tab-${tab}`);
  if (!check(panel, `tab ${tab} has no panel`)) continue;
  check(!(await panel.isHidden()), `panel ${tab} stayed hidden after its tab was clicked`);
  const text = (await panel.innerText()).trim();
  check(text.length >= MIN_PANEL_CHARS,
    `panel ${tab} renders only ${text.length} chars, which reads as an empty box`);
  check(!/<\/?\s*(div|span|p|table|figure|b|a|code|article|section)\b/i.test(text),
    `panel ${tab} shows raw HTML tags as text`);
  // Unrendered markdown is the likelier failure: the shared inline renderer
  // handles a subset of markdown, so a source using a form it does not cover
  // leaks asterisks and backticks onto the page.
  const leaked = text.match(/\*\*[^*\n]{2,60}\*\*|(?<!`)`[^`\n]{2,60}`(?!`)/);
  check(!leaked, `panel ${tab} shows unrendered markdown: ${leaked && leaked[0]}`);

  // A table that renders its header and no rows is the shape of a format-string
  // slip: the panel still has plenty of text, so a length check waves it
  // through. Every table on the page is a list of something that exists.
  const emptyTables = await panel.$$eval('table', (els) => els
    .filter((el) => el.querySelectorAll('tbody tr').length === 0)
    .map((el) => (el.querySelector('th') || {}).innerText || 'unlabelled'));
  for (const th of emptyTables) {
    check(false, `panel ${tab} has a table with no rows, first column "${th}"`);
  }

  // A capture that failed to decode paints nothing. Backgrounds have no
  // naturalWidth, so assert the bytes are present and the box has real size.
  const tiles = await panel.$$eval('.tileimg', (els) => els.map((el) => {
    const cs = getComputedStyle(el);
    return {
      cls: el.className,
      hasImage: cs.backgroundImage.startsWith('url("data:image/webp;base64,'),
      w: el.getBoundingClientRect().width,
      h: el.getBoundingClientRect().height,
      label: el.getAttribute('aria-label') || '',
    };
  }));
  for (const t of tiles) {
    check(t.hasImage, `tile ${t.cls} on ${tab} has no inlined webp background`);
    check(t.w > 20 && t.h > 20,
      `tile ${t.cls} on ${tab} lays out at ${Math.round(t.w)}x${Math.round(t.h)}`);
    check(t.label.length > 0, `tile ${t.cls} on ${tab} has no aria-label`);
  }
  tilesSeen += tiles.length;
  tilesByTab.set(tab, tiles.length);
  if (/^E\d\d$/.test(tab)) {
    // An epic tab with no feature cards means the backlog was dropped on the
    // way to the page. Panel length alone would not notice: the chips, the
    // heading and the add-note clear 200 chars on their own.
    const cards = (await panel.$$('.feature')).length;
    check(cards > 0, `epic tab ${tab} rendered no feature cards`);
  }
}

check(tilesSeen > 0, 'not one capture rendered anywhere in the artifact');

// Coverage is one row per screen, each with its capture. Checking the two
// counts against each other catches a regression that wipes the captures on
// one tab while other tabs keep the global total non-zero.
await page.click('.tabs button[data-tab="COVERAGE"]');
const covRows = (await page.$$('#tab-COVERAGE table.cov tbody tr')).length;
check(covRows > 0, 'the coverage table rendered no rows');
check(tilesByTab.get('COVERAGE') === covRows,
  `coverage has ${covRows} rows but ${tilesByTab.get('COVERAGE')} captures`);
const distinct = await page.$$eval('.tileimg', (els) => {
  const s = new Set();
  for (const el of els) {
    for (const c of el.classList) if (c.startsWith('t-')) s.add(c);
  }
  return s.size;
});
check(distinct >= covRows,
  `only ${distinct} distinct captures for ${covRows} screens, so tiles are being reused`);
check(attempted.length === 0,
  `the page reached for ${attempted.length} network resources: ${attempted.slice(0, 5).join(', ')}`);
check(consoleErrors.length === 0,
  `console errors: ${consoleErrors.slice(0, 5).join(' | ')}`);

await browser.close();

if (failures.length) {
  for (const f of failures) console.error('FAIL: ' + f);
  console.error(`\n${failures.length} failure(s) in ${TARGET}`);
  process.exit(1);
}
console.log(`PASS: ${TARGET}`);
console.log(`  ${tabs.length} tabs, all switch and carry content`);
console.log(`  ${tilesSeen} capture placements, every one painted from an inlined webp`);
console.log('  0 network requests attempted, 0 console errors');
