#!/usr/bin/env python3
"""Assemble the single-file scribl backlog document.

Reads the two source HTML views on branch scribl-timeline-and-sprint1 and
splices their verbatim blocks into an authored narrative. Bounded: every slice
is a fixed line range, checked against an expected first line before use.
"""
import re, sys, pathlib

BASE = pathlib.Path(__file__).resolve().parents[1] / "docs/public/assets/backlog"
assert BASE.is_dir(), BASE
OUT = BASE / "scribl-backlog-onefile.html"

# Live sources. The epics view is versioned: v1 is the deslopped copy this file
# is built from, and the unsuffixed original stays untouched as the reference.
# REF holds the pristine copies the fixed line ranges below were written against.
E = (BASE / "scribl-backlog-epics-v1.html").read_text().split("\n")
T = (BASE / "scribl-timeline.html").read_text().split("\n")
REF = {id(E): (BASE / "scribl-backlog-epics.html").read_text().split("\n"),
       id(T): (BASE / "scribl-timeline.html").read_text().split("\n")}

def demote(block, levels=1):
    """Shift h2/h3 down one level so a reused block nests under its new parent."""
    assert 1 <= levels <= 2
    for _ in range(levels):
        block = re.sub(r"<(/?)h3>", r"<\1h4>", block)
        block = re.sub(r"<(/?)h2([ >])", r"<\1h3\2", block)
    return block

def cut(src, a, b, expect):
    """Content-anchored slice. a and b are 1-indexed inclusive line numbers into
    the PRISTINE reference copy. The block is then relocated in the live source
    by matching its first and last lines, so an edit inside a slice shifts the
    range rather than silently slicing the wrong content, which is the failure
    the fixed-range version could not detect.

    Anchors like <table class="tbl"> are not unique, so every candidate start is
    scored by how much of the reference block it recovers and the best must win
    outright. A tie means the anchor is genuinely ambiguous and this raises."""
    ref = REF[id(src)]
    assert 1 <= a <= b <= len(ref), (a, b, len(ref))
    refblock = ref[a - 1:b]
    first, last = refblock[0], refblock[-1]
    assert first.startswith(expect), "reference slice %d moved: %r" % (a, first[:60])
    want = set(refblock)
    scored = []
    for i, ln in enumerate(src):
        if ln != first:
            continue
        for j in range(i, min(i + 4 * len(refblock) + 40, len(src))):
            if src[j] != last:
                continue
            block = src[i:j + 1]
            scored.append((len(want & set(block)) - abs(len(block) - len(refblock)), i, block))
    assert scored, "slice %d-%d: no candidate spans %r .. %r" % (a, b, first[:40], last[:40])
    scored.sort(key=lambda t: -t[0])
    block = scored[0][2]
    # The winner must recover nearly all of the reference block. Set overlap is
    # blind to line order, so a merely-best candidate is not good enough.
    recovered = len(want & set(block))
    assert recovered >= len(want) - 3, (
        "slice %d-%d recovered only %d of %d reference lines" % (a, b, recovered, len(want)))
    # And it must win by a clear margin, or the anchors are too generic to trust.
    # A runner-up one point behind is the same start anchor closing on a later
    # duplicate of the end line, which the length term already resolves. Only a
    # dead heat means the anchors cannot distinguish two different blocks.
    if len(scored) > 1:
        assert scored[0][0] > scored[1][0], (
            "slice %d-%d is ambiguous, two candidates score %d" % (a, b, scored[0][0]))
    assert block[0].startswith(expect)
    return "\n".join(block)


# ---- verbatim slices, epics view ----
BOARDMAP   = demote(cut(E, 160, 260, "<h2>Board mapping"))
CAP_PEOPLE = cut(E, 325, 361, "<table class=\"tbl\">")
SIZERULE   = cut(E, 364, 364, "<p>Every feature below carries a size")
CAP_IOS    = cut(E, 421, 490, "<h4>The iOS lane")
CAP_BACK   = cut(E, 491, 493, "<h4>The backend lane")
CUTTABLE   = cut(E, 496, 537, "<table class=\"tbl\">")
OPT23      = cut(E, 539, 541, "<p><strong>Option 2")
SERIAL     = cut(E, 542, 572, "<h4>Where the iOS lane serializes")
DISCOVERY  = demote(cut(E, 573, 675, "<h2>What discovery produces"))
SPRINT1    = demote(cut(E, 681, 894, "<h2>Sprint 1 lane view"))
METAFIELDS = demote(cut(E, 896, 898, "<h2>Metadata fields"))
CONTROLS   = cut(E, 900, 919, "<div class=\"controls\">")
BANDS      = cut(E, 921, 1901, "<section class=\"band-section\"")
# The two disputed sizes must carry a VISIBLE flag, not just a mention in the
# intro. Sizes are untouched; a chip and one sentence are added to each card.
FLAGS = {
    "E02-F4": "Size disputed. 5 iOS-days takes the realignment plan's top of range and adds nothing for greenfield, which breaks this document's own sizing rule on the biggest single iOS line in the plan, and it excludes the Get Inspired branch that has no frame and no content (Q10). Eight screens of greenfield React Native in 5 days is thin. Left at 5 on purpose. Re-size it at sprint 1 planning, not here.",
    "E04-F6": "Size disputed. 2 iOS-days holds only while iPad stays out of scope. By this feature's own text, iPad in scope makes it a layout pass across every screen in E02 and E05, which is an order-of-magnitude break rather than a rounding error. Q44 decides it. Left at 2 on purpose. Re-size it at sprint 1 planning, not here.",
}
for _fid, _why in FLAGS.items():
    _head = '<span class="fid">%s</span>' % _fid
    assert BANDS.count(_head) == 1, _fid
    _i = BANDS.index(_head)
    _j = BANDS.index('</div>', BANDS.index('<span class="chip disc', _i))
    BANDS = BANDS[:_j] + '<span class="chip sizeflag" title="Size disputed">Size flagged</span>\n' + BANDS[_j:]
    _k = BANDS.index('<div class="fbody">', _i)
    _e = BANDS.index('</div>', _k)
    BANDS = BANDS[:_e] + '<p class="sizenote"><strong>Size flagged, deliberately not changed.</strong> %s</p>' % _why + BANDS[_e:]
assert BANDS.count('chip sizeflag') == 2 and BANDS.count('class="sizenote"') == 2
BANDS      = BANDS.replace('<h2 class="band-heading">', '<h3 class="band-heading">')
assert '<h2 class="band-heading">' not in BANDS
BANDS      = re.sub(r'(<h3 class="band-heading">[^<]*)</h2>', r'\1</h3>', BANDS)
assert BANDS.count('<h3 class="band-heading">') == 4 and '</h2>' not in BANDS
RISKS_TAIL = cut(E, 1904, 1909, "<p><strong>Q5 blocks more")
# A4. The risks section re-explained the Q5 mechanism a fourth time. Point instead.
_a = "No Apple Developer account means no signing identity, no TestFlight, and no demo build. It blocks four features across E07 and it is not something Bounteous can close on its own."
assert RISKS_TAIL.count(_a) == 1
RISKS_TAIL = RISKS_TAIL.replace(_a, "It blocks four features across E07, Bounteous cannot close it, and section 4 works through what it costs the week-four demo.")
SOURCES    = demote(cut(E, 1911, 1912, "<h2>Sources</h2>"))
SCRIPT     = cut(E, 1920, 2000, "(function () {")

# ---- verbatim slices, timeline view ----
T_CAL     = cut(T, 196, 245, "<p class=\"caption\">One band")
T_PHASES  = cut(T, 247, 257, "<h3>Phases</h3>")
# A duplicate of the S2_MID note below, same fact in weaker wording. Cut here.
_dupshape = [l for l in T_PHASES.split("\n") if l.startswith('<p class="note">Shape is seven')]
assert len(_dupshape) == 1, _dupshape
T_PHASES = "\n".join(l for l in T_PHASES.split("\n") if l != _dupshape[0])
T_HOL     = cut(T, 259, 269, "<h3>Holiday and availability")
T_EPICTL  = demote(cut(T, 273, 382, "<p class=\"caption\">Bar length"))
# Defect in the source timeline: E08's no-slot label says 4 iOS-days. Its four
# features roll up to 2 iOS-days and 8 backend-days (E08-F2 is 2 and is the only
# iOS line), and E08-F2's own body says "these two days". The 4 also breaks the
# capacity section's orange iOS total of 9 across E08-F2, E09-F3, E10-F2, E10-F4
# and E11-F2, which is 2+2+3+2. E09, E10 and E11's labels are right.
# PR 18 corrected this at source, so accept the label in either state.
_bad = "No slot. 8 backend-days and 4 iOS-days when funded"
_good = "No slot. 8 backend-days and 2 iOS-days when funded"
assert T_EPICTL.count(_bad) + T_EPICTL.count(_good) == 1
T_EPICTL = T_EPICTL.replace(_bad, _good)
T_OVERRUN = cut(T, 386, 455, "<p class=\"caption\">Each lane")
# A2. This paragraph restated the lane-rows-not-totals point from the supply
# section and the post-Shape per-lane figures from "What the discovery
# allocation buys". Both keep it. Reduced here to the number the chart needs.
_a = "<p><strong>An idle QA-day cannot be spent as an iOS-day.</strong> That is why the lane rows matter and the total does not. The build-lane total after Shape is 95 against 99, 96 percent, and that number is comfortable and useless. Underneath it, iOS is 4 days over and backend is 5 days over, and the 13 days of QA slack cannot convert to either.</p>"
assert T_OVERRUN.count(_a) == 1
T_OVERRUN = T_OVERRUN.replace(_a, "<p>The build-lane total after Shape is 95 against 99, which is the number to distrust. The lane bars above it are the ones that decide the plan.</p>")
# Chart cluster 1, second table. Same three lanes and same scenarios as the bar
# chart directly above it, with no visual overrun cue. Dropped.
_t0 = T_OVERRUN.index('<table class="tbl">')
_t1 = T_OVERRUN.index('</table>', _t0) + len('</table>')
assert T_OVERRUN.count('<table class="tbl">') == 1
assert 'Load after Shape' in T_OVERRUN[_t0:_t1]
T_OVERRUN = T_OVERRUN[:_t0] + T_OVERRUN[_t1:]
# The source comment called the band colors "the brand's". They are not: the
# brand is the Bounteous palette in the :root block above. The validator numbers
# it quotes are correct and were re-run for this file. Only the attribution and
# one banned word are corrected here.
_old = "Palette note. The band colors are the brand's and are not swapped."
_new = "Palette note. The band colors are not brand tokens and are not swapped;\n  the reason is in the accessibility override at the top of this file."
assert _old in T_OVERRUN
T_OVERRUN = T_OVERRUN.replace(_old, _new)
T_OVERRUN = T_OVERRUN.replace("the three bands additionally differ in form",
                              "the three bands also differ in form")
assert "the brand's" not in T_OVERRUN
T_MS      = cut(T, 460, 571, "<p class=\"caption\">Bar the Shape readout")
# Deslop. Each _d pair removes a claim that another section already owns.
_D_MS = [
  # A10. The caption repeated the column-width argument from the paragraph above it.
  (" The two columns get the same width and the same type size, because the right-hand one is the half a client needs.", ""),
  # A4. The Q5 mechanism is spelled out in full in the gates subsection of section 4.
  ("If Q5 has not closed by 2026-09-02, E07-F1, E07-F3 and E07-F4 stall, there is no TestFlight build here, and the demo is a simulator screen recording rather than an app on a tester's phone.",
   "Not closed by 2026-09-02 means no signed build at this demo. The gates subsection in section 4 has the detail."),
  # A5. Same, for the AWS gate.
  ("The hosted API and the database in the left-hand column are exactly as conditional as the TestFlight build. Ranks 1 and 2 in the backend lane cannot start until these close and nothing else in that lane deploys behind them. If they are still open on 2026-09-02, \"it is hosted, it has a back end\" is not true at this demo, and what survives is the app running against E01-F5's mock server.",
   "The hosted API and the database in the left-hand column are exactly as conditional as the TestFlight build. Still open on 2026-09-02 means what survives is the app running against E01-F5's mock server."),
]
for _a, _b in _D_MS:
    assert T_MS.count(_a) == 1, ("T_MS deslop target missing", _a[:60])
    T_MS = T_MS.replace(_a, _b)

# ---- Lane-level rewrite ----------------------------------------------------
# Section 4 was organized by name throughout, which made the same lane fact read
# as five people's paragraphs and forced section 7 to carry four cut rows undoing
# it. Headings and table labels now name the lane. A name survives only where the
# fact is person-shaped: the roster table, the backend lane's 2.0 plus 0.6
# arithmetic, the argument that one part-time architect is the constraint, and
# attributions that source a claim to whoever made it.
_LANE_SUBS = [
  ("<h4>Neelesh Aggarwal, iOS, 7 days</h4>", "<h4>iOS lane, 7 days</h4>"),
  ("<h4>Nitish Goyal, backend, 7 days</h4>", "<h4>Backend lane, 7 days</h4>"),
  ("<h4>Karuna Arshakota, QA, 7 days</h4>", "<h4>QA lane, 7 days</h4>"),
  ("<h4>Pramod Kumar, delivery, 3 days at 0.4</h4>", "<h4>Delivery lane, 3 days at 0.4</h4>"),
  ("<h4>Neelesh Aggarwal, iOS. Capacity 10, committed 10</h4>",
   "<h4>iOS lane. Capacity 10, committed 10</h4>"),
  ("<h4>Nitish Goyal, backend. Capacity 10, committed 10</h4>",
   "<h4>Backend lane. Capacity 10, committed 10</h4>"),
  ("<h4>Karuna Arshakota, QA. Capacity 10, committed 10</h4>",
   "<h4>QA lane. Capacity 10, committed 10</h4>"),
  # The architect keeps a name in this heading because the 0.6 split is the
  # argument the subsection makes, not decoration on a lane label.
  ("<h4>Pankaj Aggarwal, engineering lead and architect, 4 days at 0.6</h4>",
   "<h4>Architect lane, 4 days at 0.6</h4>"),
  ("<h4>Pankaj Aggarwal, architecture and AWS. Capacity 3, committed 3</h4>",
   "<h4>Architecture and AWS lane. Capacity 3, committed 3</h4>"),
]
_lane_hits = 0
for _blockname in ("DISCOVERY", "SPRINT1"):
    _b = globals()[_blockname]
    for _a, _c in _LANE_SUBS:
        if _a in _b:
            assert _b.count(_a) == 1, (_blockname, _a)
            _b = _b.replace(_a, _c); _lane_hits += 1
    globals()[_blockname] = _b
assert _lane_hits == len(_LANE_SUBS), (_lane_hits, len(_LANE_SUBS))

# Table cells and prose that were a lane statement with a name appended.
_NAME_TO_LANE = [
  # Supply derivations. The arithmetic stays checkable without the names, and
  # "one engineer" is the fact that makes the iOS lane serialize.
  ("30 iOS-days for the whole build, from Neelesh Aggarwal at 2.0 person-weeks per sprint across three sprints.",
   "30 iOS-days for the whole build, from one engineer at 2.0 person-weeks per sprint across three sprints."),
  ("Nitish Goyal at 2.0 plus Pankaj Aggarwal at 0.6 is 2.6 person-weeks per sprint",
   "One backend engineer at 2.0 plus the architect at 0.6 is 2.6 person-weeks per sprint"),
  ("iOS, Neelesh Aggarwal", "iOS"),
  ("Backend and AWS, Nitish Goyal plus Pankaj Aggarwal", "Backend and AWS"),
  ("QA, Karuna Arshakota", "QA"),
  ("Neelesh, sprint 1", "iOS lane, sprint 1"),
  ("Nitish, sprint 1", "Backend lane, sprint 1"),
  ("Karuna, sprint 1", "QA lane, sprint 1"),
  ("Pankaj, sprint 1", "Architect, sprint 1"),
  ("Nitish, 2 days in Shape and 1 in sprint 1",
   "Backend lane, 2 days in Shape and 1 in sprint 1"),
]
_LANE_BLOCKS = ("DISCOVERY", "SPRINT1", "T_OVERRUN", "CAP_IOS", "CAP_BACK",
                "CUTTABLE", "SERIAL")
for _a, _c in _NAME_TO_LANE:
    _n = sum(globals()[_bn].count(_a) for _bn in _LANE_BLOCKS)
    assert _n >= 1, ("lane substitution never fired, text moved: %r" % _a)
    for _bn in _LANE_BLOCKS:
        globals()[_bn] = globals()[_bn].replace(_a, _c)
# No build-lane name may survive as a label in the rewritten blocks. Two kinds
# of mention are deliberate and exempt: attributions, which source a claim to
# whoever made it, and the architect, kept because the 0.6 split is the argument
# rather than decoration. Anything else is a missed substitution.
_ATTRIBUTIONS = ("Karuna Arshakota raised exactly this",)
for _bn in _LANE_BLOCKS:
    _b = globals()[_bn]
    for _ok in _ATTRIBUTIONS:
        _b = _b.replace(_ok, "")
    for _who in ("Neelesh Aggarwal", "Nitish Goyal", "Karuna Arshakota"):
        assert _who not in _b, ("lane rewrite missed %s in %s" % (_who, _bn))

# ---- guards: nothing reused may carry a 105 denominator or the false E03 line ----
for name, block in [("BANDS", BANDS), ("SPRINT1", SPRINT1), ("DISCOVERY", DISCOVERY),
                    ("CAP_IOS", CAP_IOS), ("CAP_BACK", CAP_BACK), ("T_OVERRUN", T_OVERRUN),
                    ("T_MS", T_MS), ("T_CAL", T_CAL), ("BOARDMAP", BOARDMAP),
                    ("CUTTABLE", CUTTABLE), ("OPT23", OPT23), ("SERIAL", SERIAL),
                    ("T_EPICTL", T_EPICTL), ("CAP_PEOPLE", CAP_PEOPLE), ("RISKS_TAIL", RISKS_TAIL)]:
    if "105" in block:
        sys.exit("reused block %s still carries a 105 denominator" % name)
    if "generation pipeline was built" in block:
        sys.exit("reused block %s carries the false E03 sentence" % name)

# T_OVERRUN ends at the lane table; its trailing note carried 105 and is re-authored below.

HEAD = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>scribl -- The eight-week plan. INTERNAL</title>
<style>

/* ------------------------------------------------------------------
   Brand.
   Tokens are the Bounteous document brand applied to the exec session
   material in commit 825c557 (docs/meetings/schedule-plan.html). They are
   not invented here. docs/.vitepress/theme defines no colors and no fonts,
   only VitePress stock variables, so it is not the brand source.

   Nunito Sans leads a system stack with no font file and no remote fetch,
   because this file must load nothing. It degrades to the OS UI font.

   ACCESSIBILITY OVERRIDE, deliberate. Accessibility wins over palette purity.
   The four band colors below (green #18864A, orange #B4530A, gray #55606E,
   parked #20145F) are NOT brand tokens and are deliberately not re-hued.
   Run the dataviz validator on them and they fail:

     validate_palette.js "#18864A,#B4530A,#55606E,#20145F" --mode light
     [FAIL] lightness band, #20145F at 0.267
     [FAIL] chroma floor, #55606E at 0.026, reads gray
     [WARN] CVD separation, orange to green deutan dE 6.8
     [PASS] normal-vision floor 18.4, [PASS] contrast vs surface

   They stay for two reasons. Band identity is the load-bearing encoding in
   this document and these four are the ones the team and the client already
   read on the kickoff board. And a deutan dE of 6.8 sits in the 6 to 8 floor
   band, which is legal with secondary encoding, so every band mark here
   carries a printed number, a text label, and a distinct FORM: green is
   filled and positioned, orange is outlined and unpositioned, gray sits past
   the rule at 2026-10-16. Identity is never color alone anywhere on the page.

   The brand pair is the opposite case. Violet #693AF4 against electric blue
   #34B4FF passes CVD separation at deutan dE 20.7, but electric blue is
   2.24:1 against the light surface, below the 3:1 floor. So electric blue
   carries no data mark. It appears only in the one-time header gradient and
   in the focus ring, where nothing depends on reading it as a value.
   ------------------------------------------------------------------ */

:root {
  /* Bounteous brand, 825c557 */
  --midnight: #0B111C;
  --indigo: #33139F;
  --violet: #693AF4;
  --purple: #853EFF;
  --eblue: #34B4FF;
  --paper: #FAFAFC;
  --card: #FFFFFF;
  --gray-50: #F4F5F8;
  --gray-100: #EAECF2;
  --gray-500: #636B82;
  --gray-700: #2D3344;
  --danger: #EF4444;
  --warning: #F59E0B;

  /* component aliases used by the reused blocks */
  --ink: var(--midnight);
  --accent: var(--violet);
  --tint: var(--gray-50);
  --line: var(--gray-100);
  --muted: var(--gray-500);
  --peach: var(--gray-50);
  --mono: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;

  /* band encoding, held fixed, see the note above */
  --green: #18864A;
  --orange: #B4530A;
  /* Sprint 0 band. Fourth hue, added for E00. Measured with the WCAG 2.x
     relative-luminance formula: #1F4E9C against white is 7.99:1 both ways,
     so the chip passes AA at any weight and AAA for large text. The CVD
     separation check quoted above was run for three hues, not four. */
  --sprint0: #1F4E9C;
  --gray: #55606E;
  --parked: #20145F;
  --over: #FBE3E7;
  --grid: #ECEDF3;
}
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  background: var(--paper);
  color: var(--ink);
  font-family: "Nunito Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  font-size: 15px;
  line-height: 1.55;
}
.wrap { max-width: 1040px; margin: 0 auto; padding: 0 20px 72px; }
h1 { font-size: 32px; margin: 0 0 8px; letter-spacing: -0.015em; font-weight: 700; }
h1, h2, h3, h4 { color: var(--ink); }
h2 { font-size: 24px; margin: 52px 0 12px; border-bottom: 3px solid var(--accent); padding-bottom: 8px; font-weight: 700; }
h3 { font-size: 18px; margin: 26px 0 8px; font-weight: 700; }
h4 { font-size: 13px; margin: 18px 0 6px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
p { margin: 0 0 12px; }
a { color: var(--accent); }
a:focus-visible, button:focus-visible, summary:focus-visible { outline: 2px solid var(--eblue); outline-offset: 2px; }
.meta-line { color: var(--muted); font-size: 13px; margin-bottom: 20px; }
.intro p, .note { max-width: 78ch; }
.note { color: var(--muted); font-size: 13px; margin: 8px 0 16px; }
.caption { font-size: 13px; color: var(--ink); background: var(--tint); border-left: 3px solid var(--accent); border-radius: 0 10px 10px 0; padding: 8px 12px; margin: 0 0 14px; max-width: 78ch; }
.lead { font-size: 17px; max-width: 74ch; }

/* the signature gradient, used once */
.masthead { background: linear-gradient(90deg, #34B4FF 0%, #853EFF 100%); height: 6px; }

/* the internal marker. Unmissable by construction: full-bleed, dark,
   sticky, and repeated in the print header. */
.internal {
  position: sticky; top: 0; z-index: 50;
  background: var(--midnight); color: #FFFFFF;
  border-bottom: 3px solid var(--danger);
  padding: 10px 20px; font-size: 13.5px; font-weight: 700;
  letter-spacing: 0.02em;
}
.internal .tag { display: inline-block; background: var(--danger); color: #FFFFFF; border-radius: 4px; padding: 2px 8px; margin-right: 10px; font-size: 12px; letter-spacing: 0.06em; }
.internal .rest { font-weight: 400; color: #E7E9F0; }
.internal a { color: #FFFFFF; }

table.tbl { width: 100%; border-collapse: collapse; font-size: 13.5px; background: var(--card); border: 1px solid var(--line); margin: 10px 0 18px; border-radius: 12px; overflow: hidden; }
table.tbl th, table.tbl td { text-align: left; padding: 8px 10px; border-bottom: 1px solid var(--line); vertical-align: top; }
table.tbl th { background: var(--tint); font-size: 11.5px; text-transform: uppercase; letter-spacing: 0.04em; color: var(--gray-700); }
table.tbl tr:last-child td { border-bottom: none; }
table.tbl td.num { font-family: var(--mono); white-space: nowrap; }

code { font-family: var(--mono); background: var(--tint); border-radius: 4px; padding: 1px 5px; font-size: 12.5px; }

/* chips */
.chip {
  display: inline-block; font-size: 11px; font-weight: 700; letter-spacing: 0.04em;
  padding: 3px 10px; border-radius: 999px; vertical-align: middle; white-space: nowrap;
  margin-right: 6px; text-transform: uppercase;
}
.chip.band-GREEN  { background: var(--green); color: #ffffff; }
.chip.band-ORANGE { background: var(--orange); color: #ffffff; }
.chip.band-SPRINT0 { background: var(--sprint0); color: #ffffff; }
.chip.band-GRAY   { background: var(--gray); color: #ffffff; }
.chip.band-PARKED { background: var(--parked); color: #ffffff; }
.chip.q5gate { background: var(--indigo); color: #ffffff; }
.chip.anchor { background: var(--ink); color: #ffffff; }
.chip.cutme { background: var(--danger); color: #ffffff; }
/* A disputed size is marked in text and by a warning-outlined chip, never
   by color alone. */
.chip.sizeflag { background: #FFF7E6; color: #6B4700; border: 1px solid var(--warning); text-transform: none; }
.sizenote { border-left: 3px solid var(--warning); background: var(--tint); border-radius: 0 8px 8px 0; padding: 8px 12px; font-size: 12.5px; margin-top: 10px; }

.chip.disc { text-transform: none; font-weight: 600; border: 1px solid; }
.chip.disc-ios       { background: #E7F0FF; color: #113B7A; border-color: #B7D0FF; }
.chip.disc-backend   { background: #EAF7EE; color: #145A32; border-color: #BEE7CC; }
.chip.disc-aws       { background: #FFF3E0; color: #7A4A00; border-color: #FFD79A; }
.chip.disc-qa        { background: #F1ECFE; color: #3A1E8A; border-color: #CFC0FB; }
.chip.disc-platform  { background: #EFEBFF; color: #3B2C82; border-color: #CBBFF7; }
.chip.disc-product   { background: #E9FBF7; color: #0D6156; border-color: #B4EEE2; }
.chip.disc-delivery  { background: #FFF9DB; color: #6B5600; border-color: #F3E28C; }

/* buttons / controls */
.controls { display: flex; flex-wrap: wrap; gap: 10px; align-items: center; margin: 18px 0 28px; padding: 14px; background: var(--card); border: 1px solid var(--line); border-radius: 12px; position: sticky; top: 44px; z-index: 20; }
.controls .grp { display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
.controls .lbl { font-size: 11.5px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; margin-right: 4px; }
button {
  font: inherit; font-size: 13px; font-weight: 600; cursor: pointer;
  padding: 6px 14px; border: 1px solid var(--line); background: var(--paper); color: var(--ink);
  border-radius: 999px;
}
button.on { background: var(--accent); border-color: var(--accent); color: #ffffff; }
button.util { background: var(--ink); border-color: var(--ink); color: #ffffff; }

/* epics */
details.epic {
  background: var(--card); border: 1px solid var(--line); border-radius: 12px; margin: 14px 0;
}
details.epic > summary {
  cursor: pointer; padding: 14px 16px; list-style: none; font-size: 16px; font-weight: 700;
  display: flex; flex-wrap: wrap; align-items: center; gap: 8px;
}
details.epic > summary::-webkit-details-marker { display: none; }
details.epic > summary::after { content: " [-]"; color: var(--muted); font-weight: 400; font-size: 12px; margin-left: auto; }
details.epic:not([open]) > summary::after { content: " [+]"; }
.eid { font-family: var(--mono); color: var(--accent); font-weight: 700; }
.fcount { color: var(--muted); font-weight: 500; font-size: 12.5px; margin-left: auto; }
.epic-body { padding: 0 18px 18px; }
.epic-sub { font-size: 13px; color: var(--muted); margin: 4px 0; }
.epic-sub .k { font-family: var(--mono); font-weight: 700; margin-right: 6px; text-transform: uppercase; font-size: 11px; }
.epic-desc { margin: 10px 0 16px; }
h3.band-heading { font-size: 21px; margin: 40px 0 12px; border-bottom: 3px solid var(--accent); padding-bottom: 8px; }

/* feature cards */
.feature.card {
  border: 1px solid var(--line); border-radius: 12px; padding: 12px 16px; margin: 10px 0; background: var(--paper);
}
.fhead { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; margin-bottom: 6px; }
.fid { font-family: var(--mono); font-weight: 700; font-size: 12.5px; color: var(--ink); }
.ftitle { font-weight: 600; }
.metarow { display: flex; flex-wrap: wrap; gap: 6px 14px; background: var(--tint); border-radius: 12px; padding: 8px 12px; margin: 6px 0 10px; font-size: 12px; }
.metarow .kv { white-space: nowrap; }
.metarow .k { font-family: var(--mono); text-transform: uppercase; font-size: 10.5px; color: var(--muted); margin-right: 4px; }
.metarow .v { color: var(--ink); }
.fbody p:last-child { margin-bottom: 0; }

footer { margin-top: 44px; border-top: 1px solid var(--line); padding-top: 14px; color: var(--muted); font-size: 12.5px; }

/* band filter: body[data-bandfilter] hides sections not matching */
body[data-bandfilter="SPRINT0"] .band-section:not([data-band="SPRINT0"]) { display: none; }
body[data-bandfilter="GREEN"]  .band-section:not([data-band="GREEN"])  { display: none; }
body[data-bandfilter="ORANGE"] .band-section:not([data-band="ORANGE"]) { display: none; }
body[data-bandfilter="GRAY"]   .band-section:not([data-band="GRAY"])   { display: none; }
body[data-bandfilter="PARKED"] .band-section:not([data-band="PARKED"]) { display: none; }

/* discipline filter: dim features that do not carry the selected discipline */
body[data-discfilter] .feature.card { opacity: 0.28; filter: grayscale(60%); }
body[data-discfilter] .feature.card.disc-match { opacity: 1; filter: none; }

.panel { position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 12px; padding: 16px 18px; margin: 10px 0 18px; }

/* ---- shared dated-grid geometry, carried over unchanged ----
   Day 0 is 2026-08-24, day 53 is 2026-10-16. 54 calendar days span the window.
   Every left/width percentage is day-index / 54 rounded to 3 decimals. */
.row { display: grid; grid-template-columns: 148px 1fr; gap: 10px; align-items: center; }
.row.margin { grid-template-columns: 148px 1fr 178px; }
.rlab { font-size: 12.5px; font-weight: 600; }
.rlab .sub { display: block; font-weight: 400; color: var(--muted); font-size: 11.5px; }
.track { position: relative; height: 30px; background: var(--paper); border: 1px solid var(--line); border-radius: 8px; }
.track.tall { height: 46px; }
.gl { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--grid); }
.mtick { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--line); }

.seg { position: absolute; top: 4px; bottom: 4px; border-radius: 6px; color: #ffffff; font-size: 11.5px; font-weight: 700; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.seg.shape { background: var(--parked); }
.seg.s1 { background: var(--green); }
.seg.s2 { background: #14713E; }
.seg.s3 { background: #0F5C32; }
.seg.tail { background: repeating-linear-gradient(135deg, var(--line) 0 4px, var(--paper) 4px 8px); color: var(--muted); }

.demo { position: absolute; top: -6px; bottom: -6px; width: 3px; background: var(--accent); }
.demo::after { content: ""; position: absolute; left: -3px; top: -5px; width: 9px; height: 9px; background: var(--accent); border-radius: 2px; }
.hol { position: absolute; top: -3px; bottom: -3px; background: repeating-linear-gradient(45deg, var(--indigo) 0 3px, transparent 3px 7px); border-left: 2px dotted var(--indigo); border-right: 2px dotted var(--indigo); }
.axis { position: relative; height: 34px; font-size: 11px; color: var(--muted); }
.axis span { position: absolute; top: 0; transform: translateX(-50%); white-space: nowrap; }
.axis span.l { transform: none; }
.axis b { display: block; color: var(--ink); font-size: 11px; }
.legend { display: flex; flex-wrap: wrap; gap: 6px 18px; font-size: 12.5px; color: var(--ink); margin: 12px 0 4px; }
.legend i { display: inline-block; width: 14px; height: 12px; border-radius: 3px; margin-right: 6px; vertical-align: -1px; }

/* epic bars */
.bar { position: absolute; top: 6px; bottom: 6px; background: var(--green); border-radius: 6px; }
.bar span { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); color: #ffffff; font-size: 10.5px; font-family: var(--mono); }
.track .gate { position: absolute; top: -4px; bottom: -4px; width: 3px; background: var(--indigo); }
.track .gatelab { position: absolute; font-size: 10.5px; font-weight: 700; color: var(--indigo); top: -2px; white-space: nowrap; }
.noslot { position: absolute; left: 0; right: 0; top: 6px; bottom: 6px; border: 2px dashed var(--orange); border-radius: 6px; background: repeating-linear-gradient(45deg, rgba(180,83,10,0.16) 0 4px, transparent 4px 9px); display: flex; align-items: center; padding-left: 10px; font-size: 11.5px; color: var(--orange); font-weight: 600; }
.endrule { border-left: 3px solid var(--ink); padding-left: 10px; }
.later { font-size: 11.5px; color: var(--gray); border: 1px solid var(--gray); border-left: 4px solid var(--gray); border-radius: 6px; padding: 4px 8px; background: var(--card); }
.rulelab { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; color: var(--ink); }
.parked-line { border: 1px solid var(--line); border-left: 4px solid var(--parked); border-radius: 8px; padding: 10px 12px; background: var(--card); font-size: 13px; }

/* overrun */
.cap { position: relative; height: 30px; }
.capbox { position: absolute; left: 0; top: 0; bottom: 0; width: 45%; border: 2px solid var(--ink); border-radius: 6px 0 0 6px; background: var(--card); }
.overzone { position: absolute; left: 45%; right: 0; top: 0; bottom: 0; background: repeating-linear-gradient(45deg, var(--over) 0 6px, #F6C9D2 6px 12px); border-top: 1px dashed var(--danger); border-bottom: 1px dashed var(--danger); }
.load { position: absolute; left: 0; top: 7px; height: 16px; border-radius: 0 4px 4px 0; }
.load.g { background: var(--green); }
.load.o { background: var(--orange); }
.load.a { background: var(--parked); }
.load em { position: absolute; left: calc(100% + 6px); top: -3px; font-style: normal; font-size: 11.5px; font-family: var(--mono); font-weight: 700; color: var(--ink); white-space: nowrap; }
.caplab { position: absolute; left: 45%; top: -18px; font-size: 10.5px; font-weight: 700; color: var(--ink); transform: translateX(-100%); padding-right: 4px; }
.lanehead { font-size: 13.5px; font-weight: 700; margin: 18px 0 2px; }
.lanesub { font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.orow { display: grid; grid-template-columns: 168px 1fr; gap: 10px; align-items: center; margin: 10px 0; }
.orow .k { font-size: 12px; color: var(--ink); }

/* milestones. Both columns get the same width and the same type size on
   purpose: the not-yet-true column is the half a client reads. */
.ms { position: relative; background: var(--card); border: 1px solid var(--line); border-radius: 12px; margin: 14px 0; overflow: hidden; }
.ms.anchor { border: 2px solid var(--accent); }
.mshead { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 12px 16px; background: var(--tint); border-bottom: 1px solid var(--line); }
.mshead .mid { font-family: var(--mono); font-weight: 700; color: var(--accent); }
.mshead .mdate { font-family: var(--mono); font-size: 12.5px; margin-left: auto; }
.cols { display: grid; grid-template-columns: 1fr 1fr; }
.cols > div { padding: 14px 16px; font-size: 13.5px; }
.cols > div:first-child { border-right: 1px solid var(--line); }
.cols h4 { margin-top: 0; }
.cols ul { margin: 0; padding-left: 18px; }
.cols li { margin: 3px 0; }
.gatebox { position: relative; border-top: 1px solid var(--line); padding: 12px 16px; font-size: 13px; background: var(--paper); }

/* the client cut list */
.cutlist { border: 2px solid var(--danger); border-radius: 12px; background: var(--card); padding: 4px 18px 18px; }
.cutlist table.tbl { border: 1px solid var(--line); }

/* contents */
.toc { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 8px; padding: 0; list-style: none; }
.toc li a { display: inline-block; font-size: 13px; font-weight: 600; text-decoration: none; border: 1px solid var(--line); background: var(--card); border-radius: 999px; padding: 5px 13px; color: var(--gray-700); }

@media (max-width: 720px) {
  .row, .row.margin, .orow { grid-template-columns: 1fr; }
  .cols { grid-template-columns: 1fr; }
  .cols > div:first-child { border-right: none; border-bottom: 1px solid var(--line); }
  .controls { position: static; }
}

@media (prefers-color-scheme: dark) {
  /* Dark steps are selected against the dark surface, not an automatic flip. */
  :root {
    --ink: #F1F2F7;
    --accent: #A98BFF;
    --paper: #10141F;
    --card: #1A2030;
    --gray-50: #232A3C;
    --gray-100: #333B50;
    --gray-500: #A7AEC2;
    --gray-700: #D3D8E4;
    --tint: #232A3C;
    --line: #333B50;
    --muted: #A7AEC2;
    --peach: #232A3C;
    --indigo: #9C8BFF;
    --green: #3FA96C;
    --orange: #D98436;
    --sprint0: #6E9BE0; /* 6.18:1 on the dark ground */
    --gray: #8B96A6;
    --parked: #8B7DE0;
    --over: #3A1F2E;
    --grid: #262E40;
    --danger: #FF7A7A;
  }
  .seg.s2 { background: #348C58; }
  .seg.s3 { background: #2A7247; }
  .seg.shape, .seg.s1, .seg.s2, .seg.s3 { color: #10141F; }
  .chip.band-GREEN, .chip.band-ORANGE, .chip.band-GRAY, .chip.band-PARKED, .chip.q5gate { color: #10141F; }
  .chip.anchor { background: var(--ink); color: #10141F; }
  .chip.cutme { color: #10141F; }
  .chip.sizeflag { background: #33280E; color: #F3D89B; }
  .bar span { color: #10141F; }
  .overzone { background: repeating-linear-gradient(45deg, var(--over) 0 6px, #4A2739 6px 12px); }
  .noslot { background: repeating-linear-gradient(45deg, rgba(217,132,54,0.22) 0 4px, transparent 4px 9px); }
  .internal { background: #05080E; }
  .chip.disc-ios      { background: #12233D; color: #B9D3FF; border-color: #274668; }
  .chip.disc-backend  { background: #12301F; color: #B6E7C6; border-color: #275238; }
  .chip.disc-aws      { background: #33260D; color: #F5D79B; border-color: #5B4519; }
  .chip.disc-qa       { background: #241A45; color: #CDBCFB; border-color: #40316E; }
  .chip.disc-platform { background: #221C45; color: #CBBFF7; border-color: #3D3470; }
  .chip.disc-product  { background: #0E2E2A; color: #B0EADF; border-color: #205049; }
  .chip.disc-delivery { background: #2E2A0E; color: #EDDE96; border-color: #514A1E; }
}

@media print {
  body { background: #ffffff; }
  .controls { display: none !important; }
  .internal { position: static; }
  details.epic, details.epic > * { display: block !important; }
  details.epic { break-inside: avoid; border: 1px solid #999; }
  .feature.card { opacity: 1 !important; filter: none !important; break-inside: avoid; }
  body[data-bandfilter] .band-section { display: block !important; }
  body[data-discfilter] .feature.card { opacity: 1 !important; filter: none !important; }
  h2, .panel, .ms, table.tbl, .cutlist { break-inside: avoid; }
  .overzone, .noslot, .seg.tail, .hol { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
  a { color: var(--ink); text-decoration: underline; }
}

</style>
</head>
<body>

<div class="internal">
  <span class="tag">INTERNAL</span>Bounteous internal. Do not send this file to Scribl.
  <span class="rest">It carries named delivery risk, per-person capacity, the unfunded QA execution budget and the priced staffing options. Section 7 lists exactly what to cut for a client copy.</span>
</div>
<div class="masthead"></div>
<div class="wrap">
<header>
<h1>scribl. The eight-week plan</h1>
<div class="meta-line">Project: scribl. Status: draft for team review. Updated: 2026-08-20. Window: 2026-08-24 to 2026-10-16.</div>
<div class="intro">
<p class="lead">Eight weeks, one iOS engineer, one backend engineer, one QA engineer and two part-time leads, running seven days of Shape and then three two-week sprints against four Wednesday demos. The plan is the whole daily loop for one person and their wall by 2026-10-14, and the arithmetic says the green band does not fit in the two lanes that build it. Everything is in one document, from the dates through to all 15 epics and all 76 features.</p>
</div>
<ul class="toc">
<li><a href="#s1">1. What this is</a></li>
<li><a href="#s2">2. The calendar and the four demos</a></li>
<li><a href="#s3">3. What is true, and what is not yet true</a></li>
<li><a href="#s4">4. Capacity</a></li>
<li><a href="#s5">5. The epics and features</a></li>
<li><a href="#s6">6. Reference</a></li>
<li><a href="#s7">7. Before this goes to the client</a></li>
</ul>
</header>
"""

S1 = r"""
<h2 id="s1">1. What this is</h2>
<p>This is the plan of record for the eight-week Scribl build at the epic and feature level. It merges three documents that were written separately: the epics and features backlog, the dated timeline and milestones, and the capacity charts. There are no user stories here by direction. Decomposition happens at sprint planning with the people who will do the work.</p>
<p>Prioritization is the kickoff board of 2026-08-19, read verbatim. Its three bands are GREEN ("FIRST, carries the daily loop"), ORANGE ("NEXT, the real conversation, what earns a sprint slot"), and GRAY ("OUTSIDE these 8 weeks, each has a later home, none are dropped"). Every gray epic carries a named later home, because the board's own words are that none are dropped.</p>
<p>Two epics are not on the board. E06, QA foundation and standards, and E07, build, signing and tester distribution, are additions and each argues for itself in its description. One item, E15, is not work at all. It is the capability the new designs took off the product surface, already built and switched off, recorded so nobody reads the reduction as a deletion.</p>

<h3>How to read the numbers</h3>
<p><strong>Supply is 99 lane-days.</strong> Every percentage here divides by 99, the three build lanes. Section 4 derives it and says which earlier copies divided by 105 instead.</p>
<p><strong>Sizes are floors, not estimates.</strong> Sixteen features carry <code>not sized</code> rather than a guess. Two sizes are flagged as probably wrong and deliberately left alone: E02-F4 guided onboarding at 5 iOS-days, and E04-F6 canvas performance on the device matrix at 2 iOS-days. Each card in section 5 carries a Size flagged chip and one sentence saying what is suspected wrong. Nobody re-sized them quietly, and re-sizing them is a sprint 1 planning conversation, not an edit.</p>
<p><strong>Week numbers are approximate.</strong> Sprint boundaries fall on Wednesdays, so read the dates.</p>
"""

S2_HEAD = r"""
<h2 id="s2">2. The calendar and the four demos</h2>
<p>The dates come first because every number later in this document hangs off them. This calendar is confirmed as of 2026-08-20 and is not being invented here. It comes from the meeting schedule plan.</p>
"""

S2_MID = r"""
<p class="note">The Shape band is Sprint 0. Section 4 gives it its spikes, its owners and its day cost, and sprint 1 still starts 2026-09-02. Shape is seven working days, not ten. An earlier draft of the backlog called it "two weeks of discovery" and that is wrong. Starting sprint 1 on 2026-09-02 rather than 2026-09-09 costs Shape three working days, and the later start would push the last demo past the end of the eight weeks and into the re:Invent freeze around 2026-10-23. Discovery supply is 25 build-lane days (Neelesh 7, Nitish 7, Karuna 7, Pankaj 4 at 0.6), not the 35 a full two weeks would give. Do not reuse the 35-day figure.</p>
"""

S3_HEAD = r"""
<h2 id="s3">3. What is true, and what is not yet true</h2>
<p>Four milestones, one per demo Wednesday plus the Shape readout. The right-hand column of every card is the half that matters, so it gets the same width and the same type size as the left. A client who reads only the left column will be surprised in week four, and the surprise is avoidable today.</p>
<!-- A10: the caption below repeated this argument. Trimmed to chart mechanics. -->
"""

S4_HEAD = r"""
<h2 id="s4">4. Capacity</h2>
<p>The constraint from the board is roughly 21 person-weeks across three build sprints, about 7 per sprint, with feature work serial behind one iOS engineer. Here is where the 7 per sprint comes from, a sprint being two calendar weeks.</p>
"""

S4_SUPPLY = r"""
<p><strong>Supply is 99 build-lane days.</strong> The three build lanes hold 99 of the 105 lane-days and the delivery lane is the other 6. An idle delivery-management day cannot be spent as an iOS-day, so 99 is the denominator everywhere below. Read the lane rows rather than the total, because an idle QA-day cannot be spent as an iOS-day either.</p>
<p>Two rows explain why the denominator is 99 and not 105. The one platform green-day sits inside the architect's share rather than on a row of its own, and the 6 delivery days cannot absorb build demand. Earlier copies totalled green at 119 and green plus orange at 155 by counting that platform day twice and dividing by 105. The build-lane figures are 118 and 154 against 99.</p>
<p>The per-lane load is charted below rather than tabulated, because a lane breaking its capacity frame is the point.</p>
<p>The delivery-lane items in this document (E07-F1, E07-F4, E09-F4 and most of E12) are deliberately unsized because they are client and vendor coordination rather than build work, so 118 is a floor rather than a total. Three numbers matter.</p>
<p><strong>The green band alone is 118 lane-days against 99 available.</strong> That is an overrun of 19 lane-days, a 119 percent load, before a single orange item.</p>
<p><strong>Green plus orange is 154 lane-days against 99.</strong> A 156 percent load, 55 lane-days over. There is no sequencing of this backlog that makes that fit, and reshuffling to hide it would only move which sprint discovers it.</p>
<p><strong>The overrun is not concentrated in the iOS lane.</strong> iOS is 11 days over on green and backend is 14 days over, so the two lanes are almost equally underwater. QA is the only lane with slack, 6 days of it, and QA-days do not convert.</p>
"""

S4_OPT1 = r"""
<p><strong>Option 1, land the green band only, and cut into it.</strong> The orange band coming out saves 36 lane-days and gets green to 118 against 99, still 19 over, with iOS 11 over and backend 14 over. Slipping the features that are already gated on client answers gets part of the way: E04-F6 (2 iOS-days, Q44), E02-F5 (3 iOS-days, Q8) and E01-F1 (2 backend-days, Q17 and Q49) recover 5 iOS-days and 2 backend-days, leaving iOS 6 over and backend 12 over. That is not enough, so this option means cutting green work that nobody has a reason to cut except the arithmetic. Where I would take the remaining 18 lane-days, in this order.</p>
"""

S4_OPT1_TAIL = r"""
<p>That lands green at roughly 99 lane-days, which is the budget with zero slack for demos, review or defects. Zero slack across three sprints is a plan that fails in week five, so read option 1 as the floor rather than the plan. It needs no money and no new people, and it is what happens by default if nobody decides anything. Say that to Scribl now rather than in week six.</p>
"""

S4_DISC_BUYS = r"""
<h4>What the discovery allocation buys</h4>
<p>Green build-lane demand is 118 against 99. Shape absorbs 23 green lane-days, 7 iOS, 9 backend and 7 QA, which takes green demand to 95 against 99 and closes the total overrun.</p>
<p>It does not close the overrun per lane, and the lane rows are the ones that matter because an idle QA-day cannot be spent as an iOS-day. After Shape, iOS is 34 against 30, still 4 over. Backend is 44 against 39, still 5 over. QA is 17 against 30, 13 under. The nine remaining lane-days of overrun sit in the two lanes with no slack, and face 13 days of slack in the lane that cannot convert.</p>
<p>Shape is the cheapest relief available and it was worth claiming before asking for money. It is not a fix.</p>
"""

# Re-authored trailing note for the overrun charts. The original divided by 105.
S4_OVERRUN_NOTE = r"""
<p class="note">The totals row is the rollup of the three build lanes. Shape absorbs 23 of the green lane-days, which is worked through below.</p>
"""

SPRINT0 = r"""
<h3 id="sprint0">Sprint 0, the seven days before sprint 1</h3>
<p>Sprint 0 is not new time on the calendar. It is the Shape window above, 2026-08-24 to 2026-09-01, seven working days and 25 lane-days, named as a sprint and given a structure it did not have. Sprint 1 keeps its 2026-09-02 start and all four demo dates hold.</p>
<p>Naming it changes what it is accountable for. The allocation above assigns all 25 of those days to backlog work pulled forward. None of it produces a decision, and sprint 1 presumes fifteen decisions that nobody has made. A sprint that starts with engineers implementing against an unchosen architecture, an unpicked test framework and an unbuilt dev environment discovers all three in week two.</p>
<p>Every spike below carries an owner, a timebox, the question it answers, the artifact it produces, and the sprint 1 work it unblocks. A spike without an artifact is a meeting.</p>

<h4>The fifteen spikes</h4>
<p>The Source column says where each one came from. <strong>Derived</strong> means it came out of a feature-by-feature pass over all 76 features asking what decision each sprint 1 item presumes, rather than off anybody's list.</p>
<table class="tbl">
<thead><tr><th>Spike</th><th>Owner</th><th>Days</th><th>Question it answers</th><th>Artifact</th><th>What it unblocks</th><th>Source</th></tr></thead>
<tbody>
<tr><td>Lay down the Claude Code harness in the new repo</td><td>Rob Forshier</td><td class="num">2</td><td>What harness configuration, skills and guardrails does this team adopt, rather than the ones Rob runs alone?</td><td>A working Claude Code harness committed to <code>hs2studio/scribl-mobile</code>, plus a one-page standard for using it</td><td>No sprint 1 item hard-blocked. Every lane inherits it on day one. Sits outside the 99 build-lane days, so it costs the build nothing</td><td>Named</td></tr>
<tr><td>Arc in the delivery flow</td><td>Rob Forshier</td><td class="num">1</td><td>Where does Arc sit in the delivery flow, and who uses it for what?</td><td>Written flow with its entry and exit points</td><td>No sprint 1 item hard-blocked. Outside the 99</td><td>Named</td></tr>
<tr><td>Automation framework choice</td><td>QA lane</td><td class="num">4</td><td>Which automation framework, and why that one rather than the alternatives?</td><td>Tooling recommendation with the alternatives written down</td><td>E06-F3 (3 QA-days), E06-F6 (2 QA-days), the sprint 1 test-execution day. Answers Q48 and Q53</td><td>Named</td></tr>
<tr><td>Backend architecture, signed</td><td>Backend and AWS lane</td><td class="num">2</td><td>Is serverless-first Lambda the committed compute tier for this phase, and what user base, concurrency and regions is it sized for?</td><td>Signed architecture decision plus a sizing memo</td><td>E01-F4 (5 backend-days), E01-F7, E01-F8. Answers Q50 and closes the ADR-0002 divergence</td><td>Named</td></tr>
<tr><td>Client architecture, and how it stays portable</td><td>iOS lane with the architect</td><td class="num">3</td><td>iOS ships first and Android is a fast follow, so which layers are written once and which are deliberately per-platform?</td><td>Client architecture ADR naming the shared layer and the platform boundary</td><td>E02-F2, E03-F2, E04-F1. Decides now whether Android is a port or a rewrite</td><td>Named</td></tr>
<tr><td>Dev environment</td><td>Architect</td><td class="num">2</td><td>What does a developer have working on day one, and how long does it take to get there?</td><td>Documented setup plus a repository bootstrap that runs end to end</td><td>Every lane, on day one. Repository access, toolchain and a running local build are each a way this fails before any feature work starts</td><td>Named</td></tr>
<tr><td>Design token handoff</td><td>Design, into the iOS lane</td><td class="num">1</td><td>What are the final canvas surface, ink row, splash and muted-text tokens?</td><td>Token sheet the theme pass and the ink palette both read</td><td>E04-F1 ink palette, the E01-F9 theme pass. Answers Q1, Q2, Q3 and Q4. Sessions are booked for 2026-08-26 and 2026-08-27, so this is a dated dependency rather than effort the build lanes spend</td><td>Proposed</td></tr>
<tr><td>Security and privacy review</td><td>Architect</td><td class="num">2</td><td>What do family sharing, invites and under-13 accounts require before a single one of them is built?</td><td>Written scope decision covering COPPA and data handling</td><td>E02, E05 and E14. This is one of four decisions the ADR register marks as blocking the build</td><td>Proposed</td></tr>
<tr><td>Team readiness</td><td>Delivery</td><td class="num">1</td><td>Can every person on the roster log in, build and run on day one, and which calendar days are they actually available?</td><td>Confirmed access checklist and a published holiday calendar</td><td>Everything, on 2026-09-02. Answers Q7, Q42 and Q51, and confirms repository and tooling access for the whole roster. Outside the 99</td><td>Proposed</td></tr>
<tr><td>Mock-to-real contract drift guard</td><td>Backend and QA lanes</td><td class="num">0.5</td><td>The mock contract is built in Sprint 0 and the real API in sprint 1 by the same engineer, so what stops them diverging after iOS and QA have already coded against the mock?</td><td>A contract conformance check that runs when E01-F4 lands</td><td>E03-F2, E06-F4, the sprint 1 QA execution day</td><td>Derived</td></tr>
<tr><td>Close the Aurora gate</td><td>Backend lane</td><td class="num">0.5</td><td>The schema is drafted in Sprint 0, but the ADR register still lists Aurora against DynamoDB as confirm-before-build, so is it closed or not?</td><td>One page closing or amending the gate</td><td>The E01-F3 applied day, E01-F4, E02-F1</td><td>Derived</td></tr>
<tr><td>Channel model</td><td>Product with the architect</td><td class="num">1</td><td>Four fixed channels, or channels users can create?</td><td>Written scope decision</td><td>E05 in full. A second of the four decisions the ADR register marks as blocking the build</td><td>Derived</td></tr>
<tr><td>Moderation fail policy</td><td>Product with the architect</td><td class="num">1</td><td>When the moderation service is unavailable, does submission fail open or fail safe?</td><td>Written policy decision</td><td>E09. A third of the four blocking decisions</td><td>Derived</td></tr>
<tr><td>Distribution path to testers</td><td>Delivery</td><td class="num">1</td><td>How does a signed build reach Scribl's testers, and how many testers are there?</td><td>Written distribution process, and the account request tracked to closure</td><td>The sprint 1 TestFlight day, and whether the week-four demo runs on a real device. Answers Q45, Q46, Q47 and Q56, and chases Q5. Outside the 99</td><td>Derived</td></tr>
<tr><td>Device and OS matrix</td><td>iOS lane</td><td class="num">1</td><td>Which iOS versions and models, and is iPad in scope?</td><td>Written recommendation to Scribl</td><td>The E04-F6 size, which is flagged in section 5, and real-device QA. Answers Q44 and Q51</td><td>Derived</td></tr>
</tbody></table>

<h4>Three spikes are already funded, and are not counted twice</h4>
<p>The automation framework choice is E06-F2, four QA-days already inside the seven, and it has a row above because it is also a decision. AWS accounts and environments is E01-F1, two architect-days, and the data model and API contract is E01-F5 plus the drafting half of E01-F3, five backend-days. Both are already listed in the discovery allocation earlier in this section, so they get no second row here and no line in the cost below. Naming them as spikes is a labelling change, not new work.</p>

<h4>What Sprint 0 costs the build</h4>
<p>Fourteen lane-days of the fifteen spikes are new work inside the three build lanes. Five more sit outside the 99, three on the harness and Arc and two on delivery, so they do not compete with feature work.</p>
<table class="tbl">
<thead><tr><th>Lane</th><th>Available</th><th>Green demand before Sprint 0</th><th>New Sprint 0 days</th><th>Green demand after</th><th>Load</th></tr></thead>
<tbody>
<tr><td>iOS</td><td class="num">30</td><td class="num">41</td><td class="num">4</td><td class="num">45</td><td class="num">150</td></tr>
<tr><td>Backend and AWS</td><td class="num">39</td><td class="num">53</td><td class="num">9.5</td><td class="num">62.5</td><td class="num">160</td></tr>
<tr><td>QA</td><td class="num">30</td><td class="num">24</td><td class="num">0.5</td><td class="num">24.5</td><td class="num">82</td></tr>
<tr><td><strong>Three build lanes</strong></td><td class="num"><strong>99</strong></td><td class="num"><strong>118</strong></td><td class="num"><strong>14</strong></td><td class="num"><strong>132</strong></td><td class="num"><strong>133</strong></td></tr>
</tbody></table>
<p>Green was 118 against 99 before any of this. With Sprint 0 it is 132 against 99. The overrun goes from 19 lane-days to 33, and it lands in the two lanes that were already underwater while QA keeps the slack that cannot convert.</p>
<p><strong>Fourteen lane-days of committed green work have to come out to pay for these spikes, and this document does not choose which.</strong> The cut table earlier in this section is where that conversation starts. Sprint 0 is not free and pretending otherwise would put the discovery in week five instead of this week.</p>
<p>The alternative is worse arithmetic rather than better. Sprint 1 is committed at 33 lane-days against 33 available, so it has no slack to absorb an unmade decision. Every spike skipped here is rework priced at more than the spike, taken in the sprint where there is nowhere to put it.</p>

<h4>What cannot start on 2026-09-02 without its spike</h4>
<p>Hard-blocked means the work cannot begin, not that it carries risk.</p>
<ul>
<li><strong>E01-F2 deploy, the E01-F3 applied day, E01-F7 and E01-F8.</strong> All four need AWS accounts that exist. Q17 and Q49 are the gate, and the sprint 1 queue already says that if they are open on 2026-09-02 the backend lane spends the sprint authoring against a mock and the week-four demo has no hosted back end.</li>
<li><strong>The first signed build and TestFlight upload.</strong> Needs an Apple Developer account. Q5 is the gate and there is no engineering workaround.</li>
<li><strong>E06-F3 and E06-F6.</strong> Both are already recorded as blocked. Neither can be priced or written until the automation framework is chosen.</li>
<li><strong>E05 and E09 feature work.</strong> The channel model and the moderation fail policy are structural. Building either before the decision means building it twice.</li>
</ul>
<p>Everything else in the sprint 1 queue can start against a mock, a stub or a partial artifact, which is what the mock-first sequencing above was built to allow.</p>

<h4>Four decisions block the build and none of them has a question number</h4>
<p>The architecture decision register lists four decisions as blocking the build until resolved: under-13 and COPPA scope, the channel model, the moderation fail policy, and whether agentic follow-up is in the minimum lovable product or after launch. None of the four appears in the open-questions register and none has a Q ID. They are tracked in the one place the team does not read daily, which is why three of them reach this page as spikes and the fourth sits outside these eight weeks. Give all four a Q ID at sprint 1 planning.</p>
"""

# ---- E00, the Sprint 0 spikes, rendered as an epic in the same card format ----
# Every field here restates section 4's spike table in the epics view. The table
# is the summary and this is the detail, so nothing new is asserted below.
SPIKES = [
 ("E00-F1", "Lay down the Claude Code harness in the new repo", "Delivery", "Rob Forshier", "2 days",
  "none", "Named",
  "What harness configuration, skills and guardrails does this team adopt, rather than the ones Rob runs alone?",
  "A working Claude Code harness committed to <code>hs2studio/scribl-mobile</code>, plus a one-page standard for using it.",
  "No sprint 1 item is hard-blocked by this. Every lane inherits the harness on day one, and the two days sit outside the 99 build-lane days, so it competes with nothing.",
  "The harness Rob runs alone is tuned to one person working without review. A team harness needs the review points, the commit conventions and the guardrails that a shared repository implies. Doing it before the repository fills up is cheaper than retrofitting it."),
 ("E00-F2", "Arc in the delivery flow", "Delivery", "Rob Forshier", "1 day",
  "none", "Named",
  "Where does Arc sit in the delivery flow, and who uses it for what?",
  "A written flow with its entry and exit points named.",
  "No sprint 1 item is hard-blocked. Outside the 99.",
  "Arc without a named place in the flow becomes a tool two people use and nobody else knows about. One page saying who opens it, at what point, and what comes out is the whole deliverable."),
 ("E00-F3", "Automation framework choice, with the reasoning", "QA", "QA lane", "4 QA-days",
  "Q48, Q53", "Named",
  "Which automation framework, and why that one rather than the alternatives?",
  "A tooling recommendation with the alternatives written down and the reasoning for the choice.",
  "E06-F3 (3 QA-days) and E06-F6 (2 QA-days), both already recorded as blocked, and the sprint 1 test-execution day.",
  "This is E06-F2, four QA-days already inside Sprint 0, so it costs nothing new. It appears here because it is a decision rather than a build task. The deliverable is the choice and the reasoning, not a survey of the market. Three different coverage answers were given in one hour on 2026-08-20, which is what Q48 exists to settle."),
 ("E00-F4", "Backend architecture, signed", "Backend", "Backend and AWS lane", "2 backend-days",
  "Q50", "Named",
  "Is serverless-first Lambda the committed compute tier for this phase, and what user base, concurrency and regions is it sized for?",
  "A signed architecture decision, plus a sizing memo the cost estimate can read.",
  "E01-F4 (5 backend-days), E01-F7 and E01-F8.",
  "ADR-0002, ADR-0003, ADR-0005 and ADR-0010 already exist, so most of this is done. Two things are not. The decision register still carries an unresolved divergence between the Lambda MVP and an EKS target, and no sizing input exists at all, which is Q50. An architecture nobody has sized is an architecture nobody can cost."),
 ("E00-F5", "Client architecture, and how it stays portable", "iOS", "iOS lane with the architect", "3 iOS-days",
  "none", "Named",
  "iOS ships first and Android is a fast follow, so which layers are written once and which are deliberately per-platform?",
  "A client architecture ADR naming the shared layer and the platform boundary.",
  "E02-F2, E03-F2 and E04-F1.",
  "iOS is the only client lane in these eight weeks and there is no Android engineer in the 99. That makes this a decision about what the fast follow costs later, taken now while the codebase is small. Drawing the boundary after three sprints of iOS-shaped code makes Android a rewrite rather than a port."),
 ("E00-F6", "Dev environment", "Platform", "Architect", "2 days",
  "none", "Named",
  "What does a developer have working on day one, and how long does it take to get there?",
  "Documented setup, plus a repository bootstrap that runs end to end.",
  "Every lane, on day one. Repository access, toolchain and a running local build are each a way this fails before any feature work starts.",
  "Day one spent on environment setup is day one not spent on the sprint, and it repeats per person. The test for this spike is that someone who has never seen the repository can reach a running build by following the document, without asking anyone."),
 ("E00-F7", "Design token handoff", "Product", "Design, into the iOS lane", "1 day",
  "Q1, Q2, Q3, Q4", "Proposed",
  "What are the final canvas surface, ink row, splash and muted-text tokens?",
  "A token sheet that the theme pass and the ink palette both read from.",
  "The E04-F1 ink palette and the E01-F9 theme pass.",
  "These are answers the design lead gives rather than artifacts the build lanes produce, so the day is coordination rather than effort. Working sessions are already booked for 2026-08-26 and 2026-08-27, which makes this a dated dependency. If those slip, the theme half of E01-F9 slips into sprint 1 and two iOS-days come back onto a queue that is already full."),
 ("E00-F8", "Security and privacy review", "AWS", "Architect", "2 days",
  "none", "Proposed",
  "What do family sharing, invites and under-13 accounts require before a single one of them is built?",
  "A written scope decision covering under-13 handling and data retention.",
  "E02, E05 and E14.",
  "Family sharing and invites put minors' content in scope, and the decision register marks under-13 and COPPA scope as blocking the build. Retrofitting an age gate onto shipped invite and sharing flows is more expensive than deciding the scope first, and it may be a harder path through App Review."),
 ("E00-F9", "Team readiness", "Delivery", "Delivery", "1 day",
  "Q7, Q42, Q51", "Proposed",
  "Can every person on the roster build and run on day one, and which calendar days are they actually available?",
  "A confirmed access checklist and a published holiday calendar.",
  "Everything, on 2026-09-02. Outside the 99.",
  "Sprint 1's own start date is still an open question, and so is the release day inside it. The roster's holiday calendar is not published, and one regional holiday would land on the last two days of sprint 1 immediately before the week-four demo. None of that is caught by a spike about architecture."),
 ("E00-F10", "Mock-to-real contract drift guard", "Backend", "Backend and QA lanes", "0.5 days",
  "none", "Derived",
  "The mock contract is built in Sprint 0 and the real API in sprint 1 by the same engineer, so what stops them diverging after iOS and QA have already coded against the mock?",
  "A contract conformance check that runs when E01-F4 lands.",
  "E03-F2, E06-F4 and the sprint 1 QA execution day.",
  "The whole mock-first sequencing exists so the iOS and QA lanes do not idle behind the backend lane. That only works while the mock and the real API agree, and nothing in the plan currently checks that they do. The drift would surface as rework in the two lanes the sequencing was meant to protect."),
 ("E00-F11", "Close the Aurora gate", "Backend", "Backend lane", "0.5 days",
  "none", "Derived",
  "The schema is drafted in Sprint 0, but the decision register still lists Aurora against DynamoDB as confirm-before-build, so is it closed or not?",
  "One page closing or amending the gate.",
  "The E01-F3 applied day, E01-F4 and E02-F1.",
  "ADR-0004 reads as settled, with Aurora the default and DynamoDB the forward-scale option, while the register's own gating list still names it. Five backend-days of API surface get built on this answer in sprint 1. Half a day to confirm it is cheap against rebuilding them."),
 ("E00-F12", "Channel model", "Product", "Product with the architect", "1 day",
  "none", "Derived",
  "Four fixed channels, or channels that users can create?",
  "A written scope decision.",
  "E05 in full.",
  "This is structural rather than a feature toggle. Fixed channels and user-created channels differ in the data model, the authorization rules and the moderation surface. The decision register marks it as blocking the build and it has no question number, so nobody is chasing it."),
 ("E00-F13", "Moderation fail policy", "Product", "Product with the architect", "1 day",
  "none", "Derived",
  "When the moderation service is unavailable, does submission fail open or fail safe?",
  "A written policy decision.",
  "E09.",
  "The epic is named fail-safe and the register left fail-open against fail-safe per content type as an open gate, so the epic title is currently ahead of the decision. With minors' content in scope this is a policy call before it is an engineering one, and it is not one the build team should make alone."),
 ("E00-F14", "Distribution path to testers", "Delivery", "Delivery", "1 day",
  "Q45, Q46, Q47, Q56", "Derived",
  "How does a signed build reach Scribl's testers, and how many testers are there?",
  "A written distribution process, and the developer account request tracked to closure.",
  "The sprint 1 TestFlight day, and whether the week-four demo runs on a real device. Outside the 99.",
  "Three Wednesday demos need a build reaching a human being who is not on the project. The developer account itself is Q5, the single question that blocks more of this plan than any other, and it has no engineering workaround. This spike owns chasing it as well as writing the process."),
 ("E00-F15", "Device and OS matrix", "iOS", "iOS lane", "1 iOS-day",
  "Q44, Q51", "Derived",
  "Which iOS versions and models, and is iPad in scope?",
  "A written recommendation to Scribl.",
  "The E04-F6 size, which section 5 already flags as disputed, and real-device QA.",
  "E04-F6 is sized at 2 iOS-days and that holds only while iPad stays out of scope. By its own description, iPad in scope turns it into a layout pass across every screen in E02 and E05. This spike decides which of those two features the plan is carrying, and it also sizes the physical device request."),
]

_DMAP = {"iOS": "disc-ios", "Backend": "disc-backend", "AWS": "disc-aws", "QA": "disc-qa",
         "Platform": "disc-platform", "Product": "disc-product", "Delivery": "disc-delivery"}

def _spike_card(s):
    fid, title, disc, owner, days, answers, source, question, artifact, unblocks, why = s
    return (
      '<div class="feature card" data-band="SPRINT0" data-disciplines="%s">\n'
      '<div class="fhead">\n<span class="fid">%s</span>\n<span class="ftitle">%s</span>\n'
      '<span class="chip band band-SPRINT0">SPRINT 0</span>\n'
      '<span class="chip disc %s" data-disc="%s">%s</span>\n</div>\n'
      '<div class="metarow"><span class="kv"><span class="k">parent</span><span class="v">E00</span></span>'
      '<span class="kv"><span class="k">owner</span><span class="v">%s</span></span>'
      '<span class="kv"><span class="k">timebox</span><span class="v">%s</span></span>'
      '<span class="kv"><span class="k">answers</span><span class="v">%s</span></span>'
      '<span class="kv"><span class="k">status</span><span class="v">Not started</span></span>'
      '<span class="kv"><span class="k">source</span><span class="v">%s</span></span></div>\n'
      '<div class="fbody"><p><strong>Question.</strong> %s</p>\n'
      '<p><strong>Artifact.</strong> %s</p>\n'
      '<p><strong>Unblocks.</strong> %s</p>\n<p>%s</p></div>\n</div>'
      % (disc, fid, title, _DMAP[disc], disc, disc, owner, days, answers, source,
         question, artifact, unblocks, why))

E00 = (
 '<section class="band-section" data-band="SPRINT0">\n'
 '<h3 class="band-heading">SPRINT 0 band. Seven days of spikes, each producing a decision</h3>\n'
 '<details class="epic" data-band="SPRINT0" open>\n<summary>\n'
 '<span class="eid">E00</span> \n<span class="ename">Sprint 0 spikes</span> \n'
 '<span class="chip band band-SPRINT0">SPRINT 0</span>\n'
 '<span class="fcount">15 spikes</span>\n</summary>\n'
 '<div class="epic-body">\n'
 '<div class="epic-sub"><span class="k">window</span> 2026-08-24 to 2026-09-01, seven working days</div>\n'
 '<div class="epic-desc"><p>The Shape window, named as a sprint. Sprint 1 presumes fifteen decisions '
 'that nobody has made, and this epic is those decisions with an owner and a timebox against each. '
 'Sprint 1 keeps its 2026-09-02 start and all four demo dates hold.</p>\n'
 '<p>Six of the fifteen carry <code>source: Derived</code>, meaning they came out of a feature-by-feature '
 'pass over all 76 features below asking what decision each sprint 1 item presumes, rather than off '
 'anybody\'s list. Section 4 has the day cost per lane, the not-startable list, and the three spikes '
 'that Sprint 0 already funds.</p>\n'
 '<p>These are spikes rather than features, so they carry no band colour from the kickoff board and no '
 'size in lane-days against a feature estimate. A spike is done when its artifact exists, not when its '
 'timebox runs out.</p></div>\n'
 + "\n".join(_spike_card(s) for s in SPIKES)
 + '\n</div>\n</details>\n</section>')
assert E00.count('class="feature card"') == 15

S5_HEAD = r"""
<h2 id="s5">5. The epics and features</h2>
<p>15 epics and 76 features. The timeline below is the first thing to read, because it says which epics have dates and which do not, and then the epics themselves expand into their features. Filter by band or by discipline with the controls, and use expand all before printing.</p>
<h3>The epic timeline</h3>
"""

S5_MID = r"""
<h3>All 15 epics, expandable</h3>
"""

S6_HEAD = r"""
<h2 id="s6">6. Reference</h2>
<p>Everything from here to the end is reference rather than narrative: the board mapping, the Jira import fields, the risks, and the sources.</p>
"""

S6_JIRA = r"""
<h3>Future home</h3>
<p>This backlog migrates to Jira project SCRIBL, board 13809: <a href="https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog">https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809/backlog</a>. Nothing has been created there. Every item carries a metadata header with the fields the import needs, so the migration is a mapping exercise and not a re-authoring one. Epic maps to a SCRIBL Epic named <code>E&lt;nn&gt; &lt;epic name&gt;</code>. Feature maps to a SCRIBL Story or Task under that epic, keyed <code>E&lt;nn&gt;-F&lt;n&gt;</code>, with <code>band</code> and <code>discipline</code> as labels and <code>status</code> as the board column. Jira sharing with Scribl is unresolved (Q52), so backlog visibility for the client runs off this document until it is.</p>
<h3>What this supersedes</h3>
<p><code>tracking/production-sprint-backlog.md</code> and its rendered HTML are the pre-kickoff story-level plan, dated 2026-07-27. Four things it assumes are now wrong: four sprints rather than seven Shape days plus three build sprints, four generic roles rather than the named roster, a 16-color palette and a multi-brush canvas rather than the six inks the client's own frames show, and challenges as a future epic rather than a capability already built and flagged off. This document supersedes it at the epic and feature level. That file stays in place unedited and keeps its value as the story-level dataset and the Fibonacci sizing history. Where the two disagree, this document wins.</p>
<p><code>tracking/production-backlog.md</code> (EPIC-01 to EPIC-10) and <code>tracking/expo-rebuild-epics.md</code> (RE-01 to RE-14, RE-F1 to RE-F9) stay as the long-horizon inventory beyond these eight weeks. Feature rows cite the RE epic they carry forward from, so nothing already thought through gets re-derived.</p>
"""

S6_RISKS_HEAD = r"""
<h3>Risks and things I would change</h3>
<p><strong>The green band does not fit, and neither lane has the slack to absorb it.</strong> 118 lane-days of green work against 99 available, 154 against 99 once the orange band is included. iOS is 11 days over on green and backend is 14 days over, so this is not a problem one extra engineer solves. The arithmetic and the three options are in section 4. My recommendation is to plan the green band only, let the four client-blocked features slip out of the three sprints, and request the two extra engineers in parallel rather than instead.</p>
"""

S7 = r"""
<h2 id="s7">7. Before this goes to the client</h2>
<p>This document is the internal-complete version. Every number, every named risk and every priced option is in it, which is what makes it useful in a Bounteous room and wrong in front of Scribl. A client copy is a delete-only edit. Work down this list, delete what it names, change nothing else, and remove the INTERNAL banner and this section last.</p>

<div class="cutlist">
<table class="tbl">
<thead><tr><th>Cut</th><th>Where it is</th><th>Why, and what reaches the client instead</th></tr></thead>
<tbody>
<tr>
<td><span class="chip cutme">Cut</span>The roster table</td>
<td>Section 4, the person-weeks table and the two supply derivations that follow the charts</td>
<td>Section 4 is written at lane level throughout, so this is the only place a person is named against a number. Cutting the table leaves every lane figure standing, because the lane rows do not depend on it</td>
</tr>
<tr>
<td><span class="chip cutme">Cut</span>The 0.6 architect allocation, and Q26</td>
<td>Section 4, the roster table, the backend lane supply derivation, and the architect paragraph in the sprint 1 queue</td>
<td>A part-time architect split across accounts is an internal resourcing fact and Q26 asks whether it should change. State the backend lane as 39 days without decomposing it</td>
</tr>
<tr>
<td><span class="chip cutme">Cut</span>The QA execution budget stated raw</td>
<td>Section 4, the QA lane paragraph in the discovery allocation</td>
<td>The sentence that names the 13 QA-days as the whole test-execution budget reaches a client properly as E06-F3, the priced coverage commitment, in section 5. Let E06-F3 carry it</td>
</tr>
<tr>
<td><span class="chip cutme">Cut</span>Staffing options 2 and 3, and their cost multipliers</td>
<td>Section 4, the two paragraphs after the option 1 cut table, and the recommendation paragraph that follows them</td>
<td>David Lawton owns the conversation about adding people and cost, and he has not framed it. A client copy keeps option 1, the honest floor, and says the team is preparing a resourcing recommendation. Do not hand over "57 percent more team cost" before he has</td>
</tr>
<tr>
<td><span class="chip cutme">Cut</span>The two Bounteous-internal Sprint 0 spikes</td>
<td>Section 4, the Sprint 0 table, the harness row and the Arc row. Section 5, the E00-F1 and E00-F2 cards, which carry the same two spikes and name their owner</td>
<td>How Bounteous tools its own delivery is not a Scribl deliverable. Both sit outside the 99, so removing them changes no arithmetic in the table below. The dev-environment and team-readiness rows stay, and neither names a person or an unmet access request</td>
</tr>
<tr>
<td><span class="chip cutme">Cut</span>The INTERNAL banner and this section</td>
<td>The top of the document, and section 7</td>
<td>Last, so the marker is present for every intermediate save</td>
</tr>
</tbody></table>
</div>

<h3>Two things to keep, against the instinct to soften them</h3>
<p><strong>Keep the not-yet-true column in section 3 exactly as it is.</strong> It is the reason the document is worth sending. A client copy that trims it back to a footnote recreates the problem this document exists to prevent, which is Scribl discovering in week four that submit does not persist.</p>
<p><strong>Keep the two gates on M1.</strong> Q5, the Apple Developer account, and Q17 with Q49, whose AWS account and whose money. Both are client-side decisions and both take most of the M1 "true" column away on their own. The client is the only party who can close them, so the client is the party who needs to read them.</p>
<p class="note">One sentence must not appear in any copy of this document, internal or client. An earlier draft of E03 claimed a runtime prompt-generation pipeline was built, tried and disabled at Scribl's request. No prompt-generation code ever existed. Prompts have always been an admin-curated seeded set resolved by date. The pipeline that was built and disabled is the AI background enhancement behind the <code>EXPO_PUBLIC_AI_ENABLED</code> flag, off by default. E03 in section 5 carries the corrected wording. On the one topic Eric Rice was emphatic about, the false version is the worst available error.</p>
"""

FOOT = r"""
<footer>
scribl, the eight-week plan. Bounteous internal. 15 epics, 76 features, 99 build-lane days of supply. Sources: the kickoff board of 2026-08-19, the kickoff and walkthrough transcripts of 2026-08-19 and 2026-08-20, the confirmed meeting schedule plan of 2026-08-20, the open-questions register, the eleven architecture decision records, and the reviewed capacity arithmetic. Numbers are transcribed from the reviewed figures rather than re-derived, and every percentage divides by 99. Production stories move to Jira project SCRIBL, board 13809. Self-contained: this file loads nothing.
</footer>
</div>
<script>
"""

# Mid-sentence colons. A colon before a list or a literal label stays. A colon
# joining two independent clauses becomes a full stop. Each anchor is the text
# immediately before the colon and must be unique across the reused blocks.
COLON_FIX = [
 "which is also where its blockers resolve",
 "the first run at the week-four demo is bare",
 "and it is not a later question",
 "Two things are unknown and neither is ours to decide",
 "what makes the staging environment real",
 "The join table is not a detail",
 "rather than because contracts are tidy",
 "One theme, not four",
 "cheap to change later and expensive to change everywhere",
 "the difference is worth naming",
 "The POC stubbed this and the rebuild cannot",
 "so it is their order rather than our inference. Two gaps",
 "The kickoff two hours earlier decided the opposite",
 "and the states are the whole feature",
 "The constraint is the feature",
 "Two open items are cheap now and expensive later",
 "Record is the gated half",
 "Reactions are the entire social currency of this product",
 "is the right one",
 "the coverage bar is genuinely undecided",
 "and it is the right one. Two limits",
 "the invariants rather than the screens",
 "today none of it exists",
 "exists as a one-day local-notification bridge",
 "Blocked on capacity",
 "it is not ours to make alone",
 "the cheapest orange item on the board",
 "ships green and empty rather than waiting",
 "Named here as the release valve for this epic",
 "a real commitment with an unreal number attached",
 "with one caveat worth saying to Scribl plainly",
 "Challenges are gone from the product surface",
 "a themed or timed wall after launch",
 "shovel-ready, which is the point",
 "worth preserving whatever happens to it",
 "Four things it assumes are now wrong",
 "the argument for it is in its description",
 "which this backlog therefore does not assume",
]

_BLOCKS = ["BANDS", "SPRINT1", "DISCOVERY", "T_MS", "T_OVERRUN", "CAP_IOS",
           "CAP_BACK", "CUTTABLE", "SERIAL", "BOARDMAP", "RISKS_TAIL", "T_EPICTL",
           "S1", "S2_MID", "S4_SUPPLY", "S6_JIRA", "S6_RISKS_HEAD", "S7", "SPRINT0"]
_colon_hits = 0
for _anchor in COLON_FIX:
    _found = 0
    for _bn in _BLOCKS:
        _b = globals()[_bn]
        _pat = re.compile(re.escape(_anchor) + r": ([a-z])")
        _n = len(_pat.findall(_b))
        if _n:
            _found += _n
            globals()[_bn] = _pat.sub(
                lambda m: _anchor + ". " + m.group(1).upper(), _b)
    assert _found == 1, ("colon anchor not unique or missing", _anchor, _found)
    _colon_hits += _found
assert _colon_hits == len(COLON_FIX), (_colon_hits, len(COLON_FIX))


parts = [
    HEAD,
    S1,
    S2_HEAD, T_CAL, T_PHASES, S2_MID, T_HOL,
    S3_HEAD, T_MS,
    "<p class=\"note\">The eight weeks end 2026-10-16, two working days after the M3 demo. There is no hardening sprint.</p>",
    S4_HEAD, CAP_PEOPLE, SIZERULE, S4_SUPPLY,
    "<h3>The overrun, per lane</h3>", T_OVERRUN, S4_OVERRUN_NOTE,
    CAP_IOS, CAP_BACK,
    "<h4>What I would do, with the numbers</h4>", S4_OPT1, CUTTABLE, S4_OPT1_TAIL, OPT23,
    SERIAL,
    DISCOVERY, S4_DISC_BUYS,
    SPRINT0,
    SPRINT1,
    S5_HEAD, T_EPICTL,
    S5_MID, CONTROLS, E00, BANDS,
    S6_HEAD, BOARDMAP, S6_JIRA, METAFIELDS,
    S6_RISKS_HEAD, RISKS_TAIL, SOURCES,
    S7,
    FOOT, SCRIPT, "</script>\n</body>\n</html>\n",
]

doc = "\n".join(p.strip("\n") for p in parts) + "\n"
OUT.write_text(doc)
print("wrote", OUT, len(doc.split("\n")), "lines")
