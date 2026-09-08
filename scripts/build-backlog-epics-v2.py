#!/usr/bin/env python3
"""Build the single-file Scribl backlog-against-the-prototype artifact.

One self-contained HTML file, no CDN, no fonts, no network, no relative image
paths. Tabbed: an overview, a coverage cross-reference, one tab per epic E00
through E18, and an unmapped tab when anything failed to find a home.

What this artifact answers, which neither source answers alone: for every screen
the POC app has, does the ratified backlog already cover it, does it cover it
only partly, or is it a gap. Features backed by a screen carry that screen's
capture tile, labeled with its route and source filename so a refreshed capture
is a one-file drop-in.

Sources, all read at build time:

  tracking/backlog-epics.md        E01 to E18, 112 features, read-only
  scripts/data/e00-spikes.json     E00's 15 spikes
  tracking/sprint-zero.md          E00's framing
  tracking/epic-board-mapping.md   band, Jira key and filed count per epic
  scripts/data/screen-backlog-map.json  the authored screen-to-feature mapping
  product/prototype/screens/*.md   route, router file, flows, tile, planning notes
  product/prototype/workflows/f*.md  flow id and title
  docs/public/assets/prototype/*.png  the capture tiles, inlined as WebP

The judgement lives in screen-backlog-map.json, not in this script. This script
renders it and refuses to render it wrong: every route must have a map entry,
every cited feature id must resolve, every tile must exist on disk.

Brand tokens, layout CSS and the tab script are imported from
build-workshop-artifact.py rather than copied, so the two artifacts cannot drift
into looking like different products.

Power-of-10 in spirit: bounded loops, asserted invariants, checked returns,
small functions.
"""
import base64
import importlib.util
import io
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "scribl-backlog-epics-v2.html"
SCREEN_DIR = ROOT / "product" / "prototype" / "screens"
FLOW_DIR = ROOT / "product" / "prototype" / "workflows"
TILE_DIR = ROOT / "docs" / "public" / "assets" / "prototype"
MAP_PATH = ROOT / "scripts" / "data" / "screen-backlog-map.json"
DETAIL_PATH = ROOT / "scripts" / "data" / "screen-detail.json"


def die(msg):
    print("build-backlog-epics-v2: " + msg, file=sys.stderr)
    sys.exit(1)


# The wiki pages live in this repo. The artifact opens from a file:// URL with
# no checkout beside it, so the trace-back link has to point at the remote.
# The remote host, org/repo slug and URL path form (Bitbucket's "src/main",
# GitHub's "blob/main") all come from project.json, so moving the brain repo
# to a new host is a config change here, not a code edit.
def _screens_wiki_base():
    config_path = ROOT / "project.json"
    try:
        config = json.loads(config_path.read_text())
    except (OSError, json.JSONDecodeError) as exc:
        die("cannot read project.json for brain_repo config: %s" % exc)
    brain_repo = config.get("brain_repo")
    if not isinstance(brain_repo, dict):
        die("project.json missing brain_repo config")
    slug = brain_repo.get("slug")
    host = brain_repo.get("host")
    path_form = brain_repo.get("path_form")
    if not slug or not host or not path_form:
        die("project.json brain_repo must set slug, host and path_form")
    if host == "github.com":
        base = "https://github.com/%s/%s/" % (slug, path_form)
    elif host == "bitbucket.org":
        base = "https://bitbucket.org/%s/src/main/" % slug
    else:
        die("unrecognised brain_repo host in project.json: %s" % host)
    return base + "product/prototype/screens/"


WIKI_BASE = _screens_wiki_base()

# Provenance, stated on the page because a screenshot with no run behind it is
# not evidence. Both come from the Prototype section's own provenance blocks.
APP_COMMIT = "c1b3c2d"
TILE_COMMIT = "72c3ab8"
TILE_DATE = "2026-08-31"

# Feature ids that existed and were retired. They are never reissued, so a
# reader who meets E18-F1 in an old note or a Jira comment does not find it
# pointing at unrelated work. Retiring an id costs one line here; reusing one
# costs somebody an afternoon of confusion.
RETIRED_IDS = {
    "E18-F1": "Full drawing tool set behind the flag, retired 2026-09-01",
    "E18-F2": "Challenges, retired 2026-09-01, became prompt packs",
    "E18-F5": "AI enhancement pipeline, retired 2026-09-01",
}

MAX_EPICS = 32
MAX_FEATURES = 256
MAX_SCREENS = 64
MAX_LINES = 20000
MAX_CALLS = 16

WEBP_QUALITY = 80
VERDICTS = ("maps", "extends", "gap", "unmapped")
VERDICT_LABEL = {
    "maps": "Covered",
    "extends": "Extends",
    "gap": "Gap",
    "unmapped": "Unmapped",
}
BANDS = ("GREEN", "ORANGE", "GRAY")
STATUSES = ("Now", "Next", "Blocked")
DISCIPLINES = ("iOS", "Backend", "AWS", "QA", "Platform", "Product", "Design")


def _load_workshop():
    """Import the sibling generator for its brand CSS, tab JS and md parsers."""
    path = ROOT / "scripts" / "build-workshop-artifact.py"
    if not path.is_file():
        die("missing scripts/build-workshop-artifact.py, the source of the shared look")
    spec = importlib.util.spec_from_file_location("workshop_artifact", path)
    mod = importlib.util.module_from_spec(spec)
    # Importing by path would drop a scripts/__pycache__ into the working tree,
    # which is not this script's business to leave behind.
    prior = sys.dont_write_bytecode
    sys.dont_write_bytecode = True
    try:
        spec.loader.exec_module(mod)
    finally:
        sys.dont_write_bytecode = prior
    for attr in ("CSS", "JS", "esc", "md", "parse_backlog", "parse_sprint_zero",
                 "render_meta", "disc_class", "BAND_LABEL", "BAND_ORDER"):
        if not hasattr(mod, attr):
            die("build-workshop-artifact.py no longer exports %s" % attr)
    if not mod.CSS.strip() or not mod.JS.strip():
        die("build-workshop-artifact.py exports an empty CSS or JS block")
    return mod


def assert_parse_shape(epics):
    """Check the imported parser still returns the dict shape this script reads.

    hasattr proves a name survived, not that its contract did. If parse_backlog
    renames a key, every read here would raise a bare KeyError from inside a
    render function instead of saying what actually broke.
    """
    if not epics:
        die("parse_backlog returned nothing")
    for key in ("id", "title", "band", "meta", "body", "features"):
        if key not in epics[0]:
            die("parse_backlog no longer returns an epic %r key, so its contract moved"
                % key)
    feats = [f for e in epics for f in e["features"]]
    if not feats:
        die("parse_backlog returned epics with no features at all")
    for key in ("id", "title", "meta", "body"):
        if key not in feats[0]:
            die("parse_backlog no longer returns a feature %r key, so its contract moved"
                % key)
    # The shared parser joins wrapped lines into one paragraph, which silently
    # flattens a markdown bullet list into a run-on sentence. Rather than render
    # that badly, refuse it and say so, because the author cannot see the damage
    # from the source file.
    for owner in epics + feats:
        for para in owner["body"]:
            if para.startswith("- ") or para.startswith("* "):
                die("%s has a bullet list in its body, which this renderer flattens. "
                    "Write it as prose in the source." % owner["id"])


WK = _load_workshop()
esc = WK.esc
render_meta = WK.render_meta

RE_MD_BOLD = re.compile(r"\*\*(.+?)\*\*", re.S)
RE_RAW_CODE = re.compile(r"</?code>")


def md(s):
    """The shared inline renderer, plus bold, on markdown-normalized input.

    Two gaps in WK.md. It handles links and code spans only, so a bold lead
    ("**Contradiction with Eric's feedback.**") renders as literal asterisks.
    And scripts/data/e00-spikes.json was authored with literal <code> tags in
    its prose, which escape into visible markup, so those are normalized to
    backticks first and rendered as code spans like every other source.
    """
    return RE_MD_BOLD.sub(lambda m: "<b>%s</b>" % m.group(1),
                          WK.md(RE_RAW_CODE.sub("`", s)))

disc_class = WK.disc_class
BAND_LABEL = WK.BAND_LABEL
BAND_ORDER = WK.BAND_ORDER


def read(rel):
    p = ROOT / rel
    if not p.is_file():
        die("missing source " + str(rel))
    return p.read_text()


# --------------------------------------------------------------------------
# Tiles. Inlined as WebP data URIs so the file works from a file:// URL with
# no repo checkout, which is the artifacts/ contract.
# --------------------------------------------------------------------------

_TILE_CACHE = {}
TILE_WIDTH = 480  # twice the largest display size, which is 240px


def tile_css_class(name):
    """Stable CSS class for one tile filename."""
    return "t-" + re.sub(r"[^a-z0-9]+", "-", name.lower().replace(".png", ""))


def tile_data_uri(name):
    """PNG on disk -> data:image/webp;base64 string. Encoded once per filename.

    Registering here rather than emitting at each placement is what keeps the
    file small: 29 tiles appear in 126 places, so inlining per placement would
    embed the same bytes four times over.
    """
    if name in _TILE_CACHE:
        return _TILE_CACHE[name]
    if "/" in name or "\\" in name:
        die("tile %r must be a bare filename" % name)
    src = TILE_DIR / name
    if not src.is_file():
        die("tile %s is referenced but not on disk under %s"
            % (name, TILE_DIR.relative_to(ROOT)))
    try:
        from PIL import Image
    except ImportError:
        die("Pillow is required to inline the tiles. pip install Pillow")
    with Image.open(src) as im:
        im = im.convert("RGB")
        if im.width > TILE_WIDTH:
            h = max(1, round(im.height * TILE_WIDTH / im.width))
            im = im.resize((TILE_WIDTH, h), Image.LANCZOS)
        buf = io.BytesIO()
        im.save(buf, format="WEBP", quality=WEBP_QUALITY, method=6)
    raw = buf.getvalue()
    if not raw:
        die("tile %s re-encoded to zero bytes" % name)
    uri = "data:image/webp;base64," + base64.b64encode(raw).decode("ascii")
    _TILE_CACHE[name] = uri
    return uri


def tile_css():
    """One background rule per tile actually used, emitted into the stylesheet."""
    if not _TILE_CACHE:
        die("no tiles were registered, so no capture would render")
    # Scoped to .tileimg so this rule outranks the base .tileimg box rule. A
    # bare .t-xx class loses on specificity and every capture renders blank,
    # which is a silent visual failure the offline gate now catches.
    return "\n".join(
        ".tileimg.%s { background-image: url(%s); }" % (tile_css_class(n), _TILE_CACHE[n])
        for n in sorted(_TILE_CACHE))


def render_tile(name, route, screen_name):
    """One labeled capture. The label is the swap instruction for the next run.

    The image is a div with role="img" rather than an <img>, so the bytes live
    once in the stylesheet and every placement is a class reference.
    """
    tile_data_uri(name)
    return (
        '<figure class="tile">'
        '<div class="tileimg %s" role="img" aria-label="The %s screen of the Scribl POC app">'
        "</div>"
        '<figcaption><span class="troute">%s</span>'
        '<span class="tfile">%s</span>'
        '<span class="tsrc">capture-board at scribl-app %s, %s</span>'
        "</figcaption></figure>"
        % (tile_css_class(name), esc(screen_name), esc(route), esc(name),
           esc(TILE_COMMIT), esc(TILE_DATE)))


# --------------------------------------------------------------------------
# Parsing the Prototype section
# --------------------------------------------------------------------------

RE_IMG = re.compile(r'<img src="/assets/prototype/([A-Za-z0-9._-]+\.png)"')
RE_GLANCE_ROW = re.compile(r"^\|\s*([^|]+?)\s*\|\s*(.+?)\s*\|\s*$")


RE_ENDPOINT = re.compile(r"^(GET|POST|PUT|PATCH|DELETE) /\S*$")
# Rows that say outright that the screen calls nothing. They are prose in a
# table, not a call, and must not render as an endpoint.
NO_CALL_CELLS = ("--", "-", "none", "n/a")


def split_row(line):
    """Cells of one markdown table row, or None if the line is not a row.

    Cells split on the pipe first and lose their backticks after, because a
    cell can hold more than one backticked span. Doing it the other way round
    drops the whole row, which is how /settings first rendered as calling
    nothing while its page named a PATCH.
    """
    s = line.strip()
    if not s.startswith("|") or not s.endswith("|"):
        return None
    return [c.replace("`", "").strip() for c in s[1:-1].split("|")]


CALL_HEADER = ("client method", "endpoint", "handler")


def parse_data_calls(page, lines):
    """(client method, endpoint) pairs out of a page's Data calls table.

    Three ways this refuses to guess. A header in a different order or with a
    different column count fails, because the columns are read by position. A
    row whose endpoint cell is neither an endpoint nor an explicit "no call"
    placeholder fails. A table that yields nothing at all fails, because a
    screen that genuinely calls nothing says so in prose, never in an empty
    table, and a silent zero here reads on the page as a verified zero.
    """
    calls = []
    saw_table = False
    declared_none = False
    for ln in lines:
        cells = split_row(ln)
        if cells is None:
            continue
        lowered = [c.lower() for c in cells]
        if lowered[:3] == list(CALL_HEADER):
            if len(cells) != 3:
                die("%s has a data-call table with %d columns" % (page, len(cells)))
            saw_table = True
            continue
        if all(set(c) <= set("- ") for c in cells):
            continue
        if not saw_table:
            die("%s has a data-call table whose header is not %s"
                % (page, ", ".join(CALL_HEADER)))
        if len(cells) != 3:
            die("%s has a data-call row with %d cells" % (page, len(cells)))
        method, endpoint = cells[0], cells[1]
        if set(endpoint) <= set("- ") or lowered[0].startswith("none"):
            declared_none = True
            continue
        if not RE_ENDPOINT.match(endpoint):
            die("%s has a data-call row this parser cannot read: %s"
                % (page, ln.strip()))
        pair = (method, endpoint)
        if pair not in calls:
            calls.append(pair)
    if saw_table and not calls and not declared_none:
        die("%s has a data-call table that yielded no endpoint" % page)
    if len(calls) > MAX_CALLS:
        die("%s lists more data calls than the bound allows" % page)
    return calls


def parse_screen_page(path):
    """route, router file, flows and tile filenames out of one screen page.

    The route and router file come from the page's own "At a glance" table and
    the tiles from the <img src> in "The capture". Nothing is inferred from the
    filename or from tile numbering order.
    """
    text = path.read_text()
    lines = text.split("\n")
    if len(lines) > MAX_LINES:
        die("%s is longer than the bounded read" % path.name)
    glance = {}
    section = None
    capture_lines = []
    notes = []
    call_lines = []
    for ln in lines:
        if ln.startswith("## "):
            section = ln[3:].strip()
            continue
        if section == "At a glance":
            m = RE_GLANCE_ROW.match(ln)
            if m:
                key = m.group(1).strip().strip("`")
                if key not in ("Property", "----------"):
                    glance.setdefault(key, m.group(2).strip())
        elif section == "The capture":
            capture_lines.append(ln)
        elif section == "Data calls":
            call_lines.append(ln)
        elif section == "Notes for planning":
            notes.append(ln)
    route = glance.get("Route", "").strip("`")
    if not route.startswith("/"):
        die("%s has no usable Route in its At a glance table" % path.name)
    tiles = RE_IMG.findall("\n".join(capture_lines))
    if not tiles:
        die("%s has no tile in its capture section" % path.name)
    flows = re.findall(r"\bF\d\b", glance.get("Flows", ""))
    if not flows:
        die("%s lists no flow" % path.name)
    return {
        "route": route,
        "page": path.name,
        "calls": parse_data_calls(path.name, call_lines),
        "router_file": glance.get("Router file", "").strip("`"),
        "flows": flows,
        "tiles": tiles,
        "has_notes": bool([n for n in notes if n.strip()]),
    }


RE_FLOW_H1 = re.compile(r"^# (F\d) (.+?)\s*$")


def parse_flow_page(path):
    for ln in path.read_text().split("\n")[:40]:
        m = RE_FLOW_H1.match(ln)
        if m:
            return {"id": m.group(1), "title": m.group(2)}
    die("%s has no '# Fn Title' heading" % path.name)


def load_prototype():
    pages = sorted(p for p in SCREEN_DIR.glob("*.md") if p.name != "index.md")
    if not pages:
        die("no screen pages under %s" % SCREEN_DIR.relative_to(ROOT))
    if len(pages) > MAX_SCREENS:
        die("more screen pages than the bound allows")
    screens = {}
    for p in pages:
        s = parse_screen_page(p)
        if s["route"] in screens:
            die("two screen pages claim route %s" % s["route"])
        screens[s["route"]] = s
    flows = {}
    for p in sorted(FLOW_DIR.glob("f*.md")):
        if p.name == "index.md":
            continue
        f = parse_flow_page(p)
        flows[f["id"]] = f["title"]
    if not flows:
        die("no flow pages parsed")
    # A screen citing a flow with no page would render its own id as its title,
    # which reads on the page as a real flow name. Fail instead.
    for route, s in sorted(screens.items()):
        unknown = [f for f in s["flows"] if f not in flows]
        if unknown:
            die("%s cites flow %s, which has no page under %s"
                % (route, ", ".join(unknown), FLOW_DIR.relative_to(ROOT)))
    return screens, flows


# --------------------------------------------------------------------------
# The backlog baseline. E01 to E18 from the markdown, E00 from the spike data.
# --------------------------------------------------------------------------

E00_FIELDS = ("id", "title", "discipline", "owner", "timebox",
              "question", "artifact", "unblocks")


def build_e00():
    spikes = json.loads(read("scripts/data/e00-spikes.json"))
    if not spikes:
        die("scripts/data/e00-spikes.json is empty, so E00 would render hollow")
    if len(spikes) > MAX_FEATURES:
        die("more E00 spikes than the bound allows")
    for i, s in enumerate(spikes):
        missing = [k for k in E00_FIELDS if not str(s.get(k) or "").strip()]
        if missing:
            die("E00 spike %d (%s) is missing %s"
                % (i + 1, s.get("id", "no id"), ", ".join(missing)))
    epic = {
        "id": "E00",
        "title": "Sprint 0, the Shape window",
        "band": "SPRINT0",
        "meta": [("id", "E00"), ("band", "SPRINT 0"),
                 ("window", "2026-08-24 to 2026-09-01, seven working days"),
                 ("discipline", "All lanes")],
        "body": WK.parse_sprint_zero(read("tracking/sprint-zero.md")),
        "features": [],
    }
    for s in spikes:
        epic["features"].append({
            "id": s["id"],
            "title": s["title"],
            "meta": [("parent", "E00"), ("discipline", s["discipline"]),
                     ("owner", s["owner"]), ("timebox", s["timebox"])],
            "body": ["The question. " + s["question"],
                     "The artifact. " + s["artifact"],
                     "What it unblocks. " + s["unblocks"]],
        })
    return epic


RE_MAP_ROW = re.compile(
    r"^\|\s*(E\d\d)[^|]*\|\s*(SPRINT0|GREEN|ORANGE|GRAY)\s*\|\s*([^|]+?)\s*\|")


def parse_epic_jira(text):
    """epic id -> Jira key or None, from epic-board-mapping.md's own table."""
    out = {}
    for ln in text.split("\n")[:MAX_LINES]:
        m = RE_MAP_ROW.match(ln)
        if m:
            key = m.group(3).strip()
            out[m.group(1)] = None if key.lower().startswith("not filed") else key
    if not out:
        die("parsed no epic rows out of tracking/epic-board-mapping.md")
    expected = {"E%02d" % n for n in range(0, 19)}
    missing = sorted(expected - set(out))
    if missing:
        # Without this, a reformatted table silently renders "not yet filed in
        # Jira" for an epic that is filed, which is a wrong claim, not a gap.
        die("no band-and-key row parsed for %s in tracking/epic-board-mapping.md"
            % ", ".join(missing))
    return out


RE_RAW_FEATURE = re.compile(r"^\*\*(E\d\d-F\d+) (.+?)\*\*\s*$", re.M)
RE_RAW_EPIC = re.compile(r"^## (E\d\d) (.+?)\s*$", re.M)


def scan_sources():
    """Independent id-and-title scan of the raw sources.

    Deliberately does not go through parse_backlog. The whole "no epic or
    feature is dropped or silently renamed" criterion rests on the parser being
    right, so checking the parser against itself would prove nothing. This
    second, dumber read is what the parse gets compared to.
    """
    text = read("tracking/backlog-epics.md")
    epics = dict(RE_RAW_EPIC.findall(text))
    feats = dict(RE_RAW_FEATURE.findall(text))
    spikes = json.loads(read("scripts/data/e00-spikes.json"))
    epics["E00"] = "Sprint 0, the Shape window"
    for s in spikes:
        feats[s["id"]] = s["title"]
    if not epics or not feats:
        die("the independent source scan found nothing, so it cannot verify anything")
    return epics, feats


def load_baseline():
    parsed = WK.parse_backlog(read("tracking/backlog-epics.md"))
    assert_parse_shape(parsed)
    epics = [build_e00()] + parsed
    epics.sort(key=lambda e: (BAND_ORDER.index(e["band"]), e["id"]))
    ids = sorted(e["id"] for e in epics)
    expected = ["E%02d" % n for n in range(0, 19)]
    if ids != expected:
        die("epic set is %s, expected E00 to E18. An epic would be dropped." % ids)
    if len(epics) > MAX_EPICS:
        die("more epics than the bound allows")
    for e in epics:
        if len(e["features"]) > MAX_FEATURES:
            die("epic %s exceeds the feature bound" % e["id"])

    # Reconcile the parse against the independent scan, both ways.
    raw_epics, raw_feats = scan_sources()
    got_epics = {e["id"]: e["title"] for e in epics}
    if set(got_epics) != set(raw_epics):
        die("epic ids parsed %s, sources say %s"
            % (sorted(got_epics), sorted(raw_epics)))
    for eid, title in sorted(raw_epics.items()):
        if got_epics[eid] != title:
            die("epic %s is titled %r in the source and %r on the page"
                % (eid, title, got_epics[eid]))
    got_feats = {f["id"]: f["title"] for e in epics for f in e["features"]}
    dropped = sorted(set(raw_feats) - set(got_feats))
    if dropped:
        die("these features are in the sources but not in the parse: %s"
            % ", ".join(dropped))
    invented = sorted(set(got_feats) - set(raw_feats))
    if invented:
        die("these features are in the parse but not in any source: %s"
            % ", ".join(invented))
    for fid, title in sorted(raw_feats.items()):
        if got_feats[fid] != title:
            die("feature %s is titled %r in the source and %r on the page"
                % (fid, title, got_feats[fid]))
    # A retired id reappearing in the sources means somebody un-retired it in one
    # place and not the other, which is worse than either decision on its own.
    back = sorted(set(RETIRED_IDS) & set(got_feats))
    if back:
        die("%s is retired in RETIRED_IDS but present in the backlog sources"
            % ", ".join(back))
    return epics


# --------------------------------------------------------------------------
# The map, and central id allocation for the net-new features
# --------------------------------------------------------------------------

def load_map(screens, baseline_ids, epic_ids):
    if not MAP_PATH.is_file():
        die("missing %s, the authored screen-to-feature mapping"
            % MAP_PATH.relative_to(ROOT))
    def no_dupes(pairs):
        seen = {}
        for k, v in pairs:
            if k in seen:
                die("%s lists route %s twice, so one verdict would be lost silently"
                    % (MAP_PATH.relative_to(ROOT), k))
            seen[k] = v
        return seen

    data = json.loads(MAP_PATH.read_text(), object_pairs_hook=no_dupes)
    missing = sorted(set(screens) - set(data))
    if missing:
        die("no map entry for these routes: %s" % ", ".join(missing))
    stray = sorted(set(data) - set(screens))
    if stray:
        die("map entries for routes with no screen page: %s" % ", ".join(stray))
    for route, ent in sorted(data.items()):
        if ent.get("verdict") not in VERDICTS:
            die("%s has verdict %r, expected one of %s"
                % (route, ent.get("verdict"), ", ".join(VERDICTS)))
        for fid in ent.get("features", []):
            if fid not in baseline_ids:
                die("%s cites %s, which is not a feature in the backlog" % (route, fid))
        if ent["verdict"] in ("maps", "extends") and not ent.get("features"):
            die("%s is %r but cites no existing feature" % (route, ent["verdict"]))
        if not (ent.get("note") or "").strip():
            die("%s has no note, and the note is what a human reads" % route)
        page_tiles = screens[route]["tiles"]
        declared = [ent.get("tile")] + list(ent.get("extra_tiles") or [])
        for t in declared:
            if t not in page_tiles:
                die("%s maps tile %r, but its page shows %s"
                    % (route, t, ", ".join(page_tiles)))
        for nf in ent.get("new_features", []):
            if "id" in nf:
                die("%s pre-assigns a new-feature id. Ids are allocated here." % route)
            if nf.get("parent") not in epic_ids:
                die("%s proposes a feature under %r, which is not an epic"
                    % (route, nf.get("parent")))
            if nf.get("band") not in BANDS:
                die("%s proposes band %r for %r" % (route, nf.get("band"), nf.get("title")))
            if nf.get("status") not in STATUSES:
                die("%s proposes status %r" % (route, nf.get("status")))
            if nf.get("discipline") not in DISCIPLINES:
                die("%s proposes discipline %r" % (route, nf.get("discipline")))
            for field in ("title", "rationale", "evidence"):
                if not (nf.get(field) or "").strip():
                    die("%s proposes a feature with no %s" % (route, field))
    return data


QE_KINDS = ("happy", "edge")
MAX_QE_CASES = 3


def load_detail(screens):
    """The authored per-screen record of what has to exist behind the screen.

    Endpoints are read out of each wiki page's table, not from here. This
    file carries the judgements a table cannot make: what the frontend has
    to build, what the backend is for, what the screen reads and writes
    around it, and a short set of draft QE cases for the discipline to
    react to.
    """
    if not DETAIL_PATH.exists():
        die("missing %s, the authored per-screen backend and state record"
            % DETAIL_PATH.relative_to(ROOT))
    data = json.loads(DETAIL_PATH.read_text())
    missing = sorted(set(screens) - set(data))
    if missing:
        die("no detail entry for: %s" % ", ".join(missing))
    stray = sorted(set(data) - set(screens))
    if stray:
        die("detail entries for routes with no screen page: %s" % ", ".join(stray))
    for route, ent in sorted(data.items()):
        for field in ("page", "backend", "state", "frontend"):
            if not str(ent.get(field, "")).strip():
                die("detail entry %s has no %s" % (route, field))
        if ent["page"] != screens[route]["page"]:
            die("detail entry %s names page %s, the screen page is %s"
                % (route, ent["page"], screens[route]["page"]))
        cases = ent.get("qe")
        if not isinstance(cases, list) or not cases:
            die("detail entry %s has no qe cases" % route)
        if len(cases) > MAX_QE_CASES:
            die("detail entry %s has more than %d qe cases" % (route, MAX_QE_CASES))
        happy_n = 0
        for case in cases:
            if not isinstance(case, dict) or not str(case.get("text", "")).strip():
                die("detail entry %s has a qe case with no text" % route)
            if case.get("kind") not in QE_KINDS:
                die("detail entry %s has a qe case with bad kind %r"
                    % (route, case.get("kind")))
            if case["kind"] == "happy":
                happy_n += 1
        if happy_n != 1:
            die("detail entry %s must have exactly one happy-path qe case, has %d"
                % (route, happy_n))
    return data


def allocate_new_features(mapping, epics):
    """Give every proposed feature the next free id under its parent epic.

    Ids are allocated here, centrally, rather than in the map file, so two
    authors working on different screens cannot both claim E02-F7.
    """
    by_id = {e["id"]: e for e in epics}
    next_n = {}
    for e in epics:
        used = [int(f["id"].rsplit("-F", 1)[1]) for f in e["features"]]
        # Retired ids count as used. E18 lost F1, F2 and F5, so its live maximum
        # is F4; without this, the next feature would be handed E18-F5, the id
        # the retired AI enhancement pipeline held.
        used += [int(r.rsplit("-F", 1)[1]) for r in RETIRED_IDS
                 if r.startswith(e["id"] + "-F")]
        next_n[e["id"]] = (max(used) + 1) if used else 1
    added = []
    for route in sorted(mapping):
        ent = mapping[route]
        ent["allocated"] = []
        for nf in ent.get("new_features", []):
            parent = nf["parent"]
            fid = "%s-F%d" % (parent, next_n[parent])
            if fid in RETIRED_IDS:
                die("allocator reached retired id %s" % fid)
            next_n[parent] += 1
            feature = {
                "id": fid,
                "title": nf["title"],
                "new": True,
                "route": route,
                "meta": [("parent", parent), ("band", nf["band"]),
                         ("discipline", nf["discipline"]),
                         ("status", nf["status"]), ("size", "not sized"),
                         ("found on", route), ("evidence", nf["evidence"])],
                "body": [nf["rationale"]],
            }
            by_id[parent]["features"].append(feature)
            ent["allocated"].append(fid)
            added.append(feature)
    ids = [f["id"] for f in added]
    if len(ids) != len(set(ids)):
        die("allocated a duplicate feature id: %s" % ids)
    for e in epics:
        if len(e["features"]) > MAX_FEATURES:
            die("epic %s exceeds the feature bound after additions" % e["id"])
    return added


def index_by_feature(mapping):
    """feature id -> list of routes that back it, existing and net-new alike."""
    out = {}
    for route in sorted(mapping):
        ent = mapping[route]
        for fid in list(ent.get("features", [])) + list(ent.get("allocated", [])):
            out.setdefault(fid, []).append(route)
    return out


# --------------------------------------------------------------------------
# Render
# --------------------------------------------------------------------------

def vchip(verdict):
    return ('<span class="chip verdict v-%s">%s</span>'
            % (verdict, esc(VERDICT_LABEL[verdict])))


def render_fe_block(d):
    """The Frontend discipline sub-block: what has to be built client-side."""
    return ('<section class="dblock d-fe"><h5><span class="chip dchip dc-fe">FE</span>'
            "Frontend</h5><p>%s</p></section>" % md(d["frontend"]))


def render_be_block(s, d):
    """The Backend discipline sub-block: endpoints, why, and what they carry."""
    if s["calls"]:
        calls = "".join('<li><code>%s</code><span class="cmeth">%s</span></li>'
                        % (esc(ep), esc(meth)) for meth, ep in s["calls"])
        eps = '<h6>Endpoints</h6><ul class="eps">%s</ul>' % calls
    else:
        eps = '<h6>Endpoints</h6><p class="none">No API call from this screen.</p>'
    return ('<section class="dblock d-be"><h5><span class="chip dchip dc-be">BE</span>'
            "Backend</h5>%s<p>%s</p>"
            "<h6>Reads and writes</h6><p>%s</p></section>"
            % (eps, md(d["backend"]), md(d["state"])))


def render_qe_block(d):
    """The QE discipline sub-block: draft cases, not final acceptance criteria."""
    items = "".join(
        '<li><span class="chip qechip qc-%s">%s</span>%s</li>'
        % (case["kind"], "happy path" if case["kind"] == "happy" else "edge case",
           md(case["text"]))
        for case in d["qe"])
    return (
        '<section class="dblock d-qe"><h5><span class="chip dchip dc-qe">QE</span>'
        "Quality engineering</h5>"
        '<p class="qenote">Draft cases for QE to review, not final acceptance criteria.</p>'
        '<ul class="qe">%s</ul></section>' % items)


def render_screen_block(route, mapping, screens, detail):
    """One backing screen: its capture, then what each discipline must build."""
    ent = mapping[route]
    s = screens[route]
    d = detail[route]
    figs = "".join(render_tile(name, route, s["route"])
                   for name in [ent["tile"]] + list(ent.get("extra_tiles") or []))
    blocks = (render_fe_block(d) + render_be_block(s, d) + render_qe_block(d))
    return (
        '<div class="sblock">%s<div class="sfacts">'
        '<div class="disc-blocks">%s</div>'
        '<p class="swiki"><a href="%s%s" target="_blank" rel="noopener">'
        "Screen page, <code>product/prototype/screens/%s</code></a></p>"
        "</div></div>"
        % (figs, blocks, WIKI_BASE, esc(d["page"]), esc(d["page"])))


def render_feature(f, mapping, backing, screens, detail):
    body = "".join("<p>%s</p>" % md(p) for p in f["body"])
    meta = dict(f["meta"])
    disc = meta.get("discipline", "")
    chip = ('<span class="chip disc %s">%s</span>'
            % (disc_class(disc), esc(disc))) if disc else ""
    newchip = '<span class="chip newchip">NEW</span>' if f.get("new") else ""
    tiles = ""
    routes = backing.get(f["id"], [])
    if routes:
        blocks = "".join(render_screen_block(r, mapping, screens, detail) for r in routes)
        tiles = ('<div class="tilerow"><h4>Backed by %d screen%s, and what each one needs'
                 "</h4>%s</div>"
                 % (len(routes), "" if len(routes) == 1 else "s", blocks))
    return (
        '<article class="feature" id="f-%s">'
        '<div class="fhead"><span class="fid">%s</span><span class="ftitle">%s</span>'
        "%s%s</div>%s%s%s</article>"
        % (esc(f["id"]), esc(f["id"]), esc(f["title"]), chip, newchip,
           render_meta(f["meta"]), body, tiles))


def render_epic_tab(e, mapping, backing, screens, jira, detail):
    meta = dict(e["meta"])
    band = e["band"]
    disc = meta.get("discipline", "")
    key = jira.get(e["id"])
    jslot = ('<a class="jkey" href="https://bounteous.jira.com/browse/%s" target="_blank"'
             ' rel="noopener">%s</a>' % (esc(key), esc(key))) if key else \
            '<span class="nofile">not yet filed in Jira</span>'
    body = "".join("<p>%s</p>" % md(p) for p in e["body"])
    n_new = len([f for f in e["features"] if f.get("new")])
    added = ('<p class="addnote">%d of these features are net-new from this pass. '
             "Everything else is the backlog as it stands.</p>" % n_new) if n_new else \
            '<p class="addnote quiet">Nothing added to this epic by this pass.</p>'
    gone = sorted(r for r in RETIRED_IDS if r.startswith(e["id"] + "-F"))
    if gone:
        added += ('<div class="retired"><h4>Retired, ids not reused</h4>%s</div>'
                  % "".join('<p><code>%s</code> %s</p>'
                            % (esc(r), esc(RETIRED_IDS[r].split(", retired")[0]))
                            for r in gone))
    feats = "".join(render_feature(f, mapping, backing, screens, detail)
                for f in e["features"])
    return (
        '<section class="tabpanel" id="tab-%s" role="tabpanel" aria-labelledby="btn-%s" hidden>'
        '<div class="epichead"><span class="chip band band-%s">%s</span>'
        '<span class="chip disc %s">%s</span><span class="jslot">%s</span></div>'
        "<h2>%s %s</h2>%s%s"
        '<h3 class="fcount">%d features</h3>%s</section>'
        % (e["id"], e["id"], band, BAND_LABEL[band], disc_class(disc), esc(disc), jslot,
           esc(e["id"]), esc(e["title"]), body, added, len(e["features"]), feats))


def render_coverage(mapping, screens, flows, epics):
    order = sorted(mapping, key=lambda r: (screens[r]["flows"][0], r))
    rows = []
    for route in order:
        ent = mapping[route]
        s = screens[route]
        flow_txt = ", ".join(
            '<span title="%s">%s</span>' % (esc(flows.get(f, f)), esc(f)) for f in s["flows"])
        cited = "".join(
            '<a class="fref" href="#f-%s" data-goto="%s">%s</a>'
            % (esc(fid), esc(fid.split("-")[0]), esc(fid))
            for fid in ent.get("features", []))
        new = "".join(
            '<a class="fref isnew" href="#f-%s" data-goto="%s">%s</a>'
            % (esc(fid), esc(fid.split("-")[0]), esc(fid))
            for fid in ent.get("allocated", []))
        rows.append(
            "<tr>"
            '<td class="croute"><code>%s</code><span class="cfile">%s</span></td>'
            '<td class="cflow">%s</td>'
            '<td class="cverdict">%s</td>'
            '<td class="cfeat">%s%s</td>'
            '<td class="cnote">%s</td>'
            '<td class="ctile">%s</td>'
            "</tr>"
            % (esc(route), esc(s["router_file"]), flow_txt, vchip(ent["verdict"]),
               cited or '<span class="none">none</span>', new, md(ent["note"]),
               render_tile(ent["tile"], route, s["route"])))
    counts = {v: len([1 for e in mapping.values() if e["verdict"] == v]) for v in VERDICTS}
    tally = "".join(
        '<span class="tallycell">%s<b>%d</b></span>' % (vchip(v), counts[v]) for v in VERDICTS)
    return (
        '<section class="tabpanel" id="tab-COVERAGE" role="tabpanel" '
        'aria-labelledby="btn-COVERAGE" hidden>'
        "<h2>Coverage, every screen against the backlog</h2>"
        "<p>One row per route template in the app's router, %d of them, each with the "
        "verdict this pass reached. <b>Covered</b> means an existing feature already "
        "describes what the screen does. <b>Extends</b> means a feature covers it partly "
        "and the note says what is missing. <b>Gap</b> means nothing in the backlog "
        "covered it and this pass proposes a feature. <b>Unmapped</b> means it has no "
        "honest home and forcing one would be worse than saying so.</p>"
        '<div class="tally">%s</div>'
        '<table class="cov"><thead><tr><th>Route</th><th>Flows</th><th>Verdict</th>'
        "<th>Features</th><th>What this pass found</th><th>Capture</th></tr></thead>"
        "<tbody>%s</tbody></table>"
        "</section>"
        % (len(mapping), tally, "".join(rows)))


def render_overview(mapping, screens, flows, epics, added, baseline_count):
    counts = {v: len([1 for e in mapping.values() if e["verdict"] == v]) for v in VERDICTS}
    total_features = sum(len(e["features"]) for e in epics)
    stats = [
        ("Epics", "%d" % len(epics), "E00 through E18, every one carried forward"),
        ("Features in", "%d" % baseline_count, "the ratified backlog before this pass"),
        ("Features added", "%d" % len(added), "net-new, marked NEW on their epic tab"),
        ("Features retired", "%d" % len(RETIRED_IDS), "removed on direction, ids not reused"),
        ("Features out", "%d" % total_features, "nothing dropped without a reason"),
        ("Screens", "%d" % len(screens), "route templates in the app's router"),
        ("Flows", "%d" % len(flows), "named user journeys, F1 to F9"),
    ]
    cells = "".join(
        '<div class="stat"><span class="num">%s</span><span class="slab">%s</span>'
        '<span class="snote">%s</span></div>' % (esc(v), esc(k), esc(n))
        for k, v, n in stats)
    flowlist = "".join(
        "<tr><td><code>%s</code></td><td>%s</td><td>%d screens</td></tr>"
        % (esc(fid), esc(title),
           len([1 for s in screens.values() if fid in s["flows"]]))
        for fid, title in sorted(flows.items()))
    return (
        '<section class="tabpanel" id="tab-OVERVIEW" role="tabpanel" '
        'aria-labelledby="btn-OVERVIEW" hidden>'
        "<h2>The backlog, read against the app that exists</h2>"
        "<p>The team has a ratified backlog of %d epics and %d features. The Prototype "
        "section of the project wiki documents every screen the POC app has, %d of them "
        "across %d named flows, each with its real capture and each capability cited to a "
        "line of source. Until now the two had never met. The screen and flow inventory "
        "listed per-screen feature extraction as out of scope, and the Prototype section "
        "says outright that it generates no backlog items.</p>"
        "<p>This is that pass. For every screen it asks one question, does the backlog "
        "cover this, and records the answer with the screen's capture next to the feature "
        "it backs. Start on <a href=\"#tab-COVERAGE\" data-goto=\"COVERAGE\">Coverage</a>, "
        "which is the cross-reference itself.</p>"
        '<div class="stats">%s</div>'
        "<h3>What this pass is not</h3>"
        "<p>It files nothing. No Jira issue is created, edited or transitioned, and the "
        "backlog source files are untouched. The features marked NEW here are a proposal "
        "for review, and promoting them into <code>tracking/backlog-epics.md</code> is a "
        "separate decision. Screens read <b>Covered</b> where an existing feature already "
        "does the job, and this pass resisted inventing work to look productive: %d of %d "
        "screens needed no change at all.</p>"
        "<h3>The nine flows</h3>"
        "<table class=\"tbl\"><thead><tr><th>Flow</th><th>Journey</th><th>Reach</th>"
        "</tr></thead><tbody>%s</tbody></table>"
        "<h3>Provenance</h3>"
        "<p>Epic and feature text is read at build time from "
        "<code>tracking/backlog-epics.md</code> and <code>scripts/data/e00-spikes.json</code>. "
        "Band and Jira key come from <code>tracking/epic-board-mapping.md</code>. Screen "
        "routes, router files, flow membership and tile filenames are read from the "
        "Prototype pages under <code>product/prototype/</code>, which cite the app at "
        "<code>%s</code>. Tiles are the app's own <code>capture:board</code> output at "
        "<code>%s</code>, captured %s, re-encoded to WebP and inlined so this file works "
        "offline from a <code>file://</code> URL. Every capture is labeled with its source "
        "filename, so refreshing a screenshot means dropping in a new PNG and rebuilding.</p>"
        "<p>The screen-to-feature judgement is the one authored input. It lives in "
        "<code>scripts/data/screen-backlog-map.json</code>, so it can be argued with "
        "directly rather than being buried in a script.</p>"
        "</section>"
        % (len(epics), baseline_count, len(screens), len(flows), cells,
           counts["maps"], len(screens), flowlist, APP_COMMIT, TILE_COMMIT, TILE_DATE))


def render_unmapped(mapping, screens):
    rows = [(r, mapping[r]) for r in sorted(mapping) if mapping[r]["verdict"] == "unmapped"]
    if not rows:
        return None
    items = "".join(
        '<article class="feature"><div class="fhead"><span class="fid">%s</span>'
        '<span class="ftitle">%s</span></div><p>%s</p>%s</article>'
        % (esc(r), esc(screens[r]["router_file"]), md(ent["note"]),
           render_tile(ent["tile"], r, screens[r]["route"]))
        for r, ent in rows)
    return (
        '<section class="tabpanel" id="tab-UNMAPPED" role="tabpanel" '
        'aria-labelledby="btn-UNMAPPED" hidden>'
        "<h2>Unmapped, %d screens with no honest home</h2>"
        "<p>These screens fit no existing epic and this pass declined to invent one for "
        "them. Placing them is a product call, not a rendering call.</p>%s</section>"
        % (len(rows), items))


EXTRA_CSS = """
.stats { display: flex; flex-wrap: wrap; gap: 10px; margin: 18px 0 24px; }
.stat { flex: 1 1 150px; background: var(--card); border: 1px solid var(--line);
  border-radius: 10px; padding: 12px 14px; }
.stat .num { display: block; font-size: 26px; font-weight: 700; letter-spacing: -0.02em; }
.stat .slab { display: block; font-size: 12px; text-transform: uppercase;
  letter-spacing: 0.06em; color: var(--muted); margin-top: 2px; }
.stat .snote { display: block; font-size: 12px; color: var(--muted); margin-top: 6px;
  line-height: 1.4; }
.tally { display: flex; flex-wrap: wrap; gap: 14px; margin: 0 0 18px; }
.tallycell { display: inline-flex; align-items: center; gap: 6px; }
.tallycell b { font-size: 17px; }
.chip.verdict { border: 1px solid transparent; }
.v-maps { background: #E4F4EA; color: #1C6B3A; border-color: #A9DCBC; }
.v-extends { background: #FEF2E6; color: #8A4B12; border-color: #F2CFA8; }
.v-gap { background: #FCE4EE; color: #A01050; border-color: #F3B2CE; }
.v-unmapped { background: #EEEEF3; color: #55516B; border-color: #D5D4E0; }
.chip.newchip { background: var(--accent); color: #fff; letter-spacing: 0.06em; }
table.cov { width: 100%; border-collapse: collapse; font-size: 13px; margin: 8px 0 0; }
table.cov th, table.cov td { border-bottom: 1px solid var(--line); padding: 10px 8px;
  text-align: left; vertical-align: top; }
table.cov th { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--muted); background: var(--paper); position: sticky; top: 0; }
td.croute code { font-weight: 600; }
td.croute .cfile { display: block; font-family: var(--mono); font-size: 11px;
  color: var(--muted); margin-top: 3px; }
td.cflow { white-space: nowrap; font-family: var(--mono); font-size: 12px; }
td.cnote { max-width: 30em; }
td.ctile { width: 132px; }
td.ctile .tile { margin: 0; }
td.ctile .tile .tileimg { width: 116px; }
td.ctile figcaption { display: none; }
.fref { display: block; font-family: var(--mono); font-size: 12px; white-space: nowrap; }
.fref.isnew { color: var(--accent); font-weight: 600; }
.fref.isnew::after { content: " NEW"; font-size: 9px; letter-spacing: 0.08em; }
.none { color: var(--muted); font-style: italic; }
.tilerow { margin: 12px 0 4px; }
.tilerow h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--muted); margin: 0 0 8px; }
figure.tile { display: inline-block; margin: 0 12px 12px 0; vertical-align: top; }
figure.tile .tileimg { display: block; width: 240px; aspect-ratio: 660 / 1434;
  background-color: #fff; background-position: center top;
  background-size: 100% auto; background-repeat: no-repeat;
  border: 1px solid var(--line); border-radius: 10px; }
figure.tile figcaption { margin-top: 6px; width: 240px; line-height: 1.4; }
figure.tile .troute { display: block; font-family: var(--mono); font-size: 12px;
  font-weight: 600; }
figure.tile .tfile { display: block; font-family: var(--mono); font-size: 11px;
  color: var(--muted); }
figure.tile .tsrc { display: block; font-size: 10px; color: var(--muted); }
.addnote { font-size: 13px; color: var(--muted); margin: 4px 0 12px; }
.retired { border-left: 3px solid var(--line); padding: 2px 0 2px 12px;
  margin: 0 0 16px; }
.retired h4 { font-size: 11px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--muted); margin: 0 0 4px; }
.retired p { font-size: 13px; color: var(--muted); margin: 0 0 3px; }
.addnote.quiet { font-style: italic; }
.sblock { display: flex; gap: 16px; align-items: flex-start; margin: 0 0 16px;
  padding: 12px; background: var(--paper); border: 1px solid var(--line);
  border-radius: 10px; }
.sblock figure.tile { margin: 0; flex: 0 0 auto; }
.sfacts { flex: 1 1 260px; min-width: 240px; font-size: 13px; }
.sfacts h5 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--muted); margin: 10px 0 3px; display: flex; align-items: center; gap: 6px; }
.sfacts h6 { font-size: 10px; text-transform: uppercase; letter-spacing: 0.06em;
  color: var(--muted); margin: 8px 0 3px; }
.sfacts p { margin: 0; line-height: 1.5; }
ul.eps { list-style: none; margin: 0; padding: 0; }
ul.eps li { margin: 0 0 2px; }
ul.eps code { font-size: 12px; font-weight: 600; }
ul.eps .cmeth { font-family: var(--mono); font-size: 11px; color: var(--muted);
  margin-left: 8px; }
.swiki { margin-top: 10px; font-size: 12px; }
.swiki code { font-size: 11px; }
.disc-blocks { display: flex; flex-direction: column; gap: 10px; margin-top: 4px; }
.dblock { border-radius: 8px; padding: 8px 10px 10px; background: var(--card); }
.dblock:first-child { margin-top: 0; }
.dblock h5:first-child { margin-top: 0; }
.d-fe { border-left: 3px solid var(--eblue); background: color-mix(in srgb, var(--eblue) 8%, var(--card)); }
.d-be { border-left: 3px solid var(--violet); background: color-mix(in srgb, var(--violet) 8%, var(--card)); }
.d-qe { border-left: 3px solid var(--orange); background: color-mix(in srgb, var(--orange) 8%, var(--card)); }
.chip.dchip { font-size: 9px; letter-spacing: 0.04em; padding: 1px 6px; border-radius: 4px;
  color: #fff; }
.chip.dc-fe { background: var(--eblue); }
.chip.dc-be { background: var(--violet); }
.chip.dc-qe { background: var(--orange); }
.qenote { color: var(--muted); font-size: 12px; font-style: italic; margin: 0 0 6px; }
ul.qe { list-style: none; margin: 0; padding: 0; }
ul.qe li { margin: 0 0 4px; line-height: 1.5; }
.chip.qechip { font-size: 9px; letter-spacing: 0.02em; padding: 1px 6px; border-radius: 4px;
  margin-right: 6px; border: 1px solid transparent; }
.chip.qc-happy { background: #E4F4EA; color: #1C6B3A; border-color: #A9DCBC; }
.chip.qc-edge { background: #FEF2E6; color: #8A4B12; border-color: #F2CFA8; }
@media (max-width: 720px) { .sblock { flex-direction: column; } }
"""


def build():
    screens, flows = load_prototype()
    epics = load_baseline()
    baseline_ids = {f["id"] for e in epics for f in e["features"]}
    baseline_count = len(baseline_ids)
    jira = parse_epic_jira(read("tracking/epic-board-mapping.md"))
    mapping = load_map(screens, baseline_ids, {e["id"] for e in epics})
    detail = load_detail(screens)
    added = allocate_new_features(mapping, epics)
    backing = index_by_feature(mapping)

    # load_baseline already reconciled the parse against an independent scan of
    # the sources. What is left to check is that the additions did not displace
    # anything on the way to the page.
    out_ids = {f["id"] for e in epics for f in e["features"]}
    lost = sorted(baseline_ids - out_ids)
    if lost:
        die("these baseline features never reached the page: %s" % ", ".join(lost))

    def navbtn(tid, label):
        return ('<button role="tab" data-tab="%s" id="btn-%s" aria-selected="false" '
                'aria-controls="tab-%s"><span class="tname">%s</span></button>'
                % (tid, tid, tid, esc(label)))

    unmapped = render_unmapped(mapping, screens)
    tabs = [navbtn("OVERVIEW", "Overview"), navbtn("COVERAGE", "Coverage")]
    panels = [render_overview(mapping, screens, flows, epics, added, baseline_count),
              render_coverage(mapping, screens, flows, epics)]
    if unmapped:
        tabs.append(navbtn("UNMAPPED", "Unmapped"))
        panels.append(unmapped)

    band_seen = None
    for e in epics:
        if e["band"] != band_seen:
            band_seen = e["band"]
            tabs.append('<div class="tgroup">%s</div>' % esc(BAND_LABEL[band_seen]))
        n_new = len([f for f in e["features"] if f.get("new")])
        tabs.append('<button role="tab" data-tab="%s" id="btn-%s" aria-selected="false" '
                    'aria-controls="tab-%s" title="%s %s">'
                    '<span class="bdot b-%s"></span><span class="tcode">%s</span>'
                    '<span class="tname">%s</span>%s</button>'
                    % (e["id"], e["id"], e["id"], esc(e["id"]), esc(e["title"]),
                       e["band"], esc(e["id"]), esc(e["title"]),
                       '<span class="chip newchip">%d</span>' % n_new if n_new else ""))
        panels.append(render_epic_tab(e, mapping, backing, screens, jira, detail))

    total_features = sum(len(e["features"]) for e in epics)
    doc = (
        '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        "<title>Scribl: the backlog, read against the app that exists</title>\n"
        "<style>%s\n%s\n%s</style>\n</head>\n<body>\n"
        '<header class="brandbar"><div class="barrow">'
        '<span class="wordmark">bounteous<span class="dot">.</span></span>'
        '<span class="bardiv"></span><span class="client">Scribl</span>'
        '<span class="barspace"></span>'
        '<span class="barmeta">Backlog against the prototype, %d screens</span>'
        "</div></header>\n"
        '<div class="masthead"></div>\n<div class="wrap">\n'
        '<div class="titleblock">'
        '<p class="eyebrow">Scribl backlog, epics and features</p>'
        "<h1>The backlog, read against the app that exists</h1>"
        '<div class="gradrule"></div></div>\n'
        '<p class="meta-line">%d epics, %d features, %d of them net-new from reading the '
        "%d screens of the POC app. Every feature backed by a screen shows that screen's "
        "capture. Nothing is filed in Jira by this page.</p>\n"
        '<div class="layout">\n<nav class="tabs" role="tablist" aria-label="Epics">%s</nav>\n'
        '<div class="col">%s</div>\n</div>\n'
        '<footer><span class="wordmark fmark">bounteous<span class="dot">.</span></span>'
        " for Scribl. Generated by <code>scripts/build-backlog-epics-v2.py</code>. "
        "One file, no network, no fonts, no analytics.</footer>\n"
        "</div>\n<script>%s</script>\n</body>\n</html>\n"
        % (WK.CSS, EXTRA_CSS, tile_css(), len(screens), len(epics), total_features, len(added),
           len(screens), "".join(tabs), "\n".join(panels), WK.JS))

    # Every feature code the page cites must have a card on the page.
    # A retired id is allowed to be cited. That is the point of retiring it
    # rather than deleting it: the prose explaining why it went away has to be
    # able to name it.
    cards = out_ids | set(RETIRED_IDS)
    cited = set(re.findall(r"\bE\d\d-F\d+\b", doc))
    dangling = sorted(cited - cards)
    if dangling:
        die("the page cites feature codes that do not exist: %s" % ", ".join(dangling))
    if "/assets/prototype/" in doc:
        die("a tile is referenced by path instead of inlined, which breaks file:// use")

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(doc)
    print("wrote %s" % OUT.relative_to(ROOT))
    print("epics %d, features %d (%d baseline + %d new), screens %d, tiles inlined %d"
          % (len(epics), total_features, baseline_count, len(added), len(screens),
             len(_TILE_CACHE)))
    print("size %.2f MB" % (len(doc.encode()) / 1048576.0))


if __name__ == "__main__":
    build()
