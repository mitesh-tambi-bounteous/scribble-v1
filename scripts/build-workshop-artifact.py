#!/usr/bin/env python3
"""Build the single-file Scribl Shape kickoff artifact.

One self-contained HTML file, no CDN, no fonts, no network. Tabbed: an overview
tab that frames the whole engagement, then one tab per epic, E00 through E18.

Sources, all read at build time so the file can be regenerated when Jira moves:

  tracking/backlog-epics.md   epic and feature content, read-only
  tracking/sprint-zero.md     the E00 window
  tracking/stories/S-*.md     POC acceptance criteria, where one maps
  scripts/data/e00-spikes.json  the fifteen E00 spikes
  scripts/data/jira-scribl.json a snapshot of `project = SCRIBL ORDER BY key ASC`

Output is artifacts/scribl-workshop-artifact.html, committed so the handed-over
file is the file in the repo. Git history is the archive of earlier versions.

Refreshing the Jira snapshot is the one manual step. Re-run the JQL with fields
summary, issuetype, status, parent and write the same shape back to
scripts/data/jira-scribl.json, then run this script.

Correlation is by the `Enn-Fn` code that leads every SCRIBL issue summary, never
by prose title. A feature matching two keys is a defect and aborts the build.

Power-of-10 in spirit: bounded loops, asserted invariants, checked returns,
small functions.
"""
import html
import json
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
OUT = ROOT / "artifacts" / "scribl-workshop-artifact.html"
JIRA_BROWSE = "https://bounteous.jira.com/browse/"
JIRA_BOARD = ("https://bounteous.jira.com/jira/software/projects/SCRIBL/boards/13809"
              "/backlog")
# The Lucid board is where the team adds questions between standups. The link
# carries an invitation token, so it grants access to whoever opens this file.
LUCID_BOARD = ("https://lucid.app/lucidspark/426638c8-86d9-4d76-b270-494a3b2e6665/edit"
               "?viewport_loc=23980%2C6160%2C9347%2C4953%2Cpage1"
               "&invitationId=inv_5e144bcb-442b-46ef-9d8f-d7665e2090ff")

MAX_EPICS = 32
MAX_FEATURES = 256

# --------------------------------------------------------------------------
# Authored constants. Every one is traceable to a named source and every one
# is client-safe. Nothing from reviews/, knowledge/team/, the SOW, the fee or
# the per-person capacity arithmetic appears anywhere in this file.
# --------------------------------------------------------------------------

# Decisions taken in the 2026-08-19 kickoff, from
# knowledge/meetings/2026-08-19-kickoff.md, "Decisions". These are the client's
# own calls and they are the constraints the backlog is built inside, so they
# sit above the epic list rather than under it.
KICKOFF_RULES = [
    ("Scope", "Roughly a third of the original scope, delivered in an eight-week phase."),
    ("Shape", "A discovery window first, then three build sprints."),
    ("Platform", "iOS only in this phase. Android is a fast follow, not a parallel lane."),
    ("Daily prompts", "Prompts stay curated by Scribl's own program team. Claude drafts "
                      "suggestions for editorial review and validates them against the curated "
                      "set. It does not generate the prompt a child reads."),
    ("Reactions, not comments", "Reactions ship. Open commenting is deferred past the MVP and, "
                                "if it is built, it is a per-wall toggle rather than always on."),
    ("Monetization", "Not freemium forever. The paywall hooks are in the infrastructure for the "
                     "store release even if nothing is switched on at launch."),
    ("Demos", "Wednesday mornings, US time, to keep the overlap with the India team. Demo and "
              "move on, not slide decks."),
    ("Board", "Jira is the shared board."),
    ("Repository", "Code starts in a Bounteous-owned repository and migrates to Scribl's later."),
    ("File sharing", "Google Drive."),
]

# Work Scribl's own designs imply that no epic funds. Verbatim source:
# s2d/design/poc-realignment-plan.md, closing paragraph of section 5, "Work the
# designs imply that no backlog covers, in one place." The "where it stands"
# column is the position that section already records for each item.
UNPLACED = [
    {"item": "The hosted invite landing page, screen 0",
     "where": "The invite link has to land somewhere on the web before the app is installed. "
              "Nothing in the backlog funds a hosted page. E02-F3 covers the token, not the "
              "page it resolves on, and it is itself gated on funding."},
    {"item": "Deep-linking into invite redemption",
     "where": "Only needed if Scribl expects a tapped invite to open straight into the right "
              "wall with no typing. The current plan falls back to a typed invite code. "
              "Deferred by default, so if zero friction is the requirement, say so here."},
    {"item": "The voice-note record and replay pipeline",
     "where": "The frames put Record on two screens. The board cut voice memos from the "
              "minimum product. E18-F3 holds the design end to end, parked, not funded. "
              "This is a client call, not an engineering one."},
    {"item": "Artifacts, the keepsake composition",
     "where": "In the prototype flow and parked to Beta by Scribl's own key decision 6. "
              "E18-F4 records it. Ownership against the earlier keepsake work is unresolved, "
              "so it is not sized."},
    {"item": "The content of the stats dashboard",
     "where": "E05-F5 builds the card. What goes in it leans on analytics, which is the "
              "orange band. The shell can ship with nothing meaningful behind it unless the "
              "numbers are decided."},
    {"item": "The “Get Inspired” examples gallery",
     "where": "A branch off screen 3 with no frame drawn and no epic behind it. Undesigned "
              "and unfunded, so it either gets a frame and a slot or it comes out of the flow."},
]

# The kickoff board of 2026-08-19, transcribed sticky by sticky from the board
# itself. Eighteen stickies, not the twelve the mapping table in
# tracking/backlog-epics.md carries: the table predates the board's later
# additions and is stale on the green and gray bands. Text is the board's own,
# with its unicode arrows written as "->" per the repo's prose rules and its
# strike-through on "(Claude)" preserved, because that correction is the whole
# story of E03. `epic` is None where no epic covers the sticky, which is a fact
# the session needs rather than a gap to paper over.
BOARD_FRAMES = {
    "GREEN": "FIRST, carries the daily loop",
    "ORANGE": "NEXT, the real conversation. What earns a sprint slot?",
    "GRAY": "OUTSIDE THESE 8 WEEKS, each has a later home, none are dropped",
}
BOARD_STICKIES = [
    ("GREEN", "Drawing + submit, with submit-to-unlock", "E04", ""),
    ("GREEN", "Daily prompt - curated <s>(Claude)</s>", "E03",
     "The board struck Claude out itself. Prompts stay curated."),
    ("GREEN", "Auth", "E02", ""),
    ("GREEN", "Walls + channels", "E05", ""),
    ("GREEN", "Cloud foundation (AWS, CI/CD, data model)", "E01", ""),
    ("GREEN", "Onboarding + Invited/New user", "E02",
     "E02-F4 and E02-F5. Green on the board, and the single largest client-side item in it."),
    ("GREEN", "Analytics instrumentation (instrument now, report later)", "E08",
     "Green, per the board. The backlog page had it orange; the board wins, so it is E09, "
     "the last epic in the green band. Jira still files it as E08."),
    ("ORANGE", "Push notifications (the daily nudge)", "E09", ""),
    ("ORANGE", "Moderation (fail-safe)", "E10", ""),
    ("ORANGE", "Streaks + progression", "E11", ""),
    ("ORANGE", "Sharing personal", "E12",
     "E12, opened 2026-08-25. Share one response as a document, or select many and compose "
     "one. What may leave a private wall is still an open client question."),
    ("ORANGE", "Reactions", "E05",
     "E05-F6, post-unlock only. The backlog puts it inside the green band with the walls."),
    ("GRAY", "Monitization", "E17",
     "E17, opened 2026-08-25. Gray, because the hooks ship and the selling comes later. "
     "What is sold is not decided."),
    ("GRAY", "App Store readiness + compliance -> release phase", "E14", ""),
    ("GRAY", "re:Invent event wall -> its own scope + funding call", "E15", ""),
    ("GRAY", "Under-13 / COPPA Family edition -> after launch planning", "E16", ""),
    ("GRAY", "picking multiple pictures and grouping them", "E12",
     "E12-F2. The same feature as sharing one response with the count raised, deferred "
     "because composing several into one file is a larger rendering job."),
    ("GRAY", "comments? - Add toggles for Wall Creators, possible ai moderation of comments",
     "E13",
     "E13, opened 2026-08-25. The wall's creator moderates their own wall, and the AI check "
     "runs before publication rather than after."),
]

# The people on the engagement. Roles from knowledge/team/roster.md, allocation
# from the per-sprint lane table in tracking/backlog-epics.md. Emails are left
# out on purpose. The open seats are stated as seats, not as circumstances.
ROSTER_BOUNTEOUS = [
    ("Rob Forshier II", "Engagement lead, design and product", "0.5 of a sprint"),
    ("Pankaj Aggarwal", "Engineering lead and architect, AWS", "0.6 of a sprint"),
    ("Nitish Goyal", "Backend and AWS", "Full time"),
    ("Neelesh Aggarwal", "iOS", "30 percent"),
    ("Shubhankar Bhavsar", "iOS", "Full time from onboarding, targeted 2026-08-26"),
    ("Karuna Arshakota", "QA", "Full time"),
    ("Pramod Kumar", "Delivery management", "0.4 of a sprint"),
    ("David Lawton", "SVP, Agentic Systems", "Outside the build lanes"),
    ("John Kilgore", "VP, Client Partner Services", "Outside the build lanes"),
    ("Martin Young", "Head of AI", "Outside the build lanes"),
    ("Angie Yap", "Workshop and AWS funding relationship", "Outside the build lanes"),
]
ROSTER_OPEN = [
    ("Project manager", "Delivery", "Not assigned. Delivery management runs at 0.4 in the "
     "meantime"),
    ("Product owner on the Scribl side", "Product", "Not named on paper. Decisions currently "
     "come through Eric Rice within two business days, which works and is not written down"),
]
ROSTER_SCRIBL = [
    ("Matthew Kaplan", "CEO"),
    ("Jeffrey Sparr", "CRO and co-founder"),
    ("Eric Rice", "CCO and game design. Backlog owner in practice"),
    ("Helen Leffers", "Chief of staff"),
    ("Abbie Knapton", "Customer experience lead"),
    ("Christina", "Designer. Owns the highest-priority screens"),
]

# The cadence, and the dated sessions it produces. Two-week blocks from Monday
# 2026-08-24, demos on the second Friday of each block, 12:00 to 13:00 Central.
MEETINGS_CADENCE = [
    ("Standup", "Every weekday morning, 30 minutes",
     "The whole delivery team. Scribl is welcome and Matthew Kaplan opted in at kickoff."),
    ("Sprint demo", "Second Friday of each two-week block, 12:00 to 13:00 Central",
     "Working software on a device, not slides. Demo and move on, which is the format the "
     "kickoff asked for."),
    ("Design sync", "Weekly, 30 minutes, time to be confirmed",
     "Rob Forshier and Christina, on the screens she owns. Required for her, per the kickoff."),
    ("Backlog check-in", "Weekly, Monday",
     "Order and readiness for the next block. This is where a sticky becomes a scoped item."),
]
MEETINGS_DATES = [
    ("2026-09-04", "Friday", "Backlog review, end of Shape",
     "Not a demo. Shape produces the locked backlog, so the session is the backlog itself: "
     "what is in, what is out, and what each answer cost."),
    ("2026-09-18", "Friday", "Demo 1, weeks three and four",
     "The first build demo, and the first one that needs a signed build on a real device. "
     "Blocked on the Apple Developer account, Q5."),
    ("2026-10-02", "Friday", "Demo 2, weeks five and six",
     "Falls on Gandhi Jayanti, an India national holiday, in the block that already carries "
     "the least slack. Either the demo moves or the week loses days it does not have."),
    ("2026-10-16", "Friday", "Demo 3, weeks seven and eight",
     "The last session inside the eight weeks. Whatever is not shown here is not in this "
     "phase."),
]

# The open questions, as they stand on the board on 2026-08-25. Transcribed
# from the board table verbatim, typos and casing included, because Rob reads
# these back to the client as their own words. Do not tidy them.
TEAM_QUESTIONS = [
    ("Does scribl have an AWS env they want us to deploy too?",
     "E01-F1, and every feature queued behind it",
     "Accounts and environments are the first thing in the green band, and nothing in the "
     "cloud epic starts until this is answered."),
    ("Do you have an apple account or should we create our own license?",
     "E07-F1, E07-F3, E07-F4, E17-F2",
     "No developer account means no signing identity, no TestFlight and no build on a "
     "tester's device. It blocks the first demo, and there is no engineering workaround."),
    ("Which IOS versions, which IPhone models, and is IPad in scope? Nothing has been "
     "targeted",
     "E00-F15, E04-F6, E06-F7",
     "iPad in scope turns canvas performance work into a layout pass across every screen in "
     "auth, onboarding and walls. It also sizes the physical test-device request."),
    ("Test management software they use for their existing system?",
     "E06-F2",
     "The tooling recommendation is due in the Shape window. Matching what Scribl already "
     "runs beats introducing a second system nobody reads."),
    ("QA would require a walk through of application and also all the business use "
     "cases/work flows to be covered",
     "E06-F3, E06-F4",
     "Coverage cannot be committed against a product nobody has described. This is the input "
     "the priced coverage commitment and the traceability work both read from."),
    ("What kind of AWS environment we are looking at to start with? Do we need all 3 in "
     "this phase?",
     "E01-F1, E01-F2, E01-F7",
     "Three environments cost three times one to stand up, to deploy to and to run. Starting "
     "with one changes the CDK stack, the deploy automation and the monthly bill."),
    ("Is there any use case where a user can edit images what they generated? Because this "
     "would require storing everything as vector strokes so that edits can be done.",
     "E04-F1, E04-F2, E05-F4",
     "This one is an architecture decision, not an answer to collect. Editable art means "
     "storing vector strokes rather than a flattened image, and that cannot be added later "
     "to art that has already been submitted."),
    ("Do we have any account or planf or Crashlytics? it would also require a seperate "
     "account with either Sentry or firebase etc?",
     "E07-F5",
     "Crash reporting needs an account before the first TestFlight build ships symbols with "
     "it. Without one, a crash on a tester's phone arrives as unreadable addresses."),
    ("Where are we going to Store code? Better to decide first because moving it later "
     "would require significant effort?",
     "E07-F2, E07-F3",
     "Every build runs out of the repository. The kickoff decided code starts in a "
     "Bounteous-owned repository and moves to Scribl's later, so what is open is when that "
     "move happens and who pays for it."),
    ("Do you want to support webapp?",
     "Nothing in the backlog funds one",
     "iOS only is this phase's decision. A web client is a second client against the same "
     "API, so it is a scope conversation rather than a task."),
]

BAND_ORDER = ["SPRINT0", "GREEN", "ORANGE", "GRAY", "PARKED"]
BAND_LABEL = {
    "SPRINT0": "SPRINT 0",
    "GREEN": "GREEN",
    "ORANGE": "ORANGE",
    "GRAY": "GRAY",
    "PARKED": "PARKED",
}
BAND_BLURB = {
    "SPRINT0": "The Shape window. Seven working days of spikes, each one producing a decision "
               "the build cannot start without.",
    "GREEN": "First, carries the daily loop.",
    "ORANGE": "Next, the real conversation. What earns a sprint slot.",
    "GRAY": "Outside these eight weeks. Each has a later home, none are dropped.",
    "PARKED": "Built and switched off, not deleted.",
}

# POC stories that cover a feature's behaviour. Hand-checked, one line each,
# because the story files carry no Enn-Fn code and matching on title would be a
# guess. A story here is POC precedent, not production progress.
STORY_MAP = {
    "E03-F1": ["S-001"],
    "E03-F2": ["S-001"],
    "E04-F1": ["S-002"],
    "E04-F2": ["S-002"],
    "E04-F3": ["S-012"],
    "E04-F5": ["S-003"],
    "E05-F1": ["S-004"],
    "E05-F2": ["S-004"],
    "E05-F3": ["S-004"],
    "E05-F4": ["S-016", "S-017"],
    "E05-F5": ["S-014"],
    "E05-F6": ["S-005"],
    "E02-F4": ["S-011"],
    "E02-F5": ["S-022"],
    "E11-F1": ["S-006"],
    "E18-F2": ["S-020"],
}


# tracking/backlog-epics.md carries the final numbers, so nothing is remapped on
# the way in. The hook stays as an identity for the next time the numbers move.
RENUMBER = {}
RE_RENUM = re.compile(r"\bE(0[89]|1[0-5])\b")


def renumber(text):
    """Rewrite epic codes when the source files and this page disagree."""
    if not RENUMBER:
        return text
    return RE_RENUM.sub(lambda m: RENUMBER.get("E" + m.group(1), "E" + m.group(1)), text)


def renumber_all(obj):
    if isinstance(obj, str):
        return renumber(obj)
    if isinstance(obj, list):
        return [renumber_all(i) for i in obj]
    if isinstance(obj, tuple):
        return tuple(renumber_all(i) for i in obj)
    if isinstance(obj, dict):
        return {k: renumber_all(v) for k, v in obj.items()}
    return obj


STORY_MAP = {renumber(k): v for k, v in STORY_MAP.items()}


def die(msg):
    print("build-workshop-artifact: " + msg, file=sys.stderr)
    sys.exit(1)


def read(rel):
    p = ROOT / rel
    if not p.is_file():
        die("missing source " + rel)
    return p.read_text()


def linkout(label, url, note):
    return ('<p class="linkout"><a href="%s" target="_blank" rel="noopener">%s</a>'
            '<span class="lnote">%s</span></p>' % (url, esc(label), esc(note)))


def esc(s):
    return html.escape(s, quote=True)


RE_MD_LINK = re.compile(r"\[([^\]]+)\]\(([^)]+)\)")
RE_MD_CODE = re.compile(r"`([^`]+)`")


def md(s):
    """Escape, then render the two inline markdown forms the sources use."""
    out = esc(s)
    out = RE_MD_LINK.sub(lambda m: "%s (%s)" % (m.group(1), m.group(2)), out)
    out = RE_MD_CODE.sub(lambda m: "<code>%s</code>" % m.group(1), out)
    return out


# --------------------------------------------------------------------------
# Parsing tracking/backlog-epics.md
# --------------------------------------------------------------------------

RE_BAND = re.compile(r"^# (GREEN|ORANGE|GRAY|PARKED)\b.*$")
RE_EPIC = re.compile(r"^## (E\d{2}) (.+?)\s*$")
RE_FEATURE = re.compile(r"^\*\*(E\d{2}-F\d+) (.+?)\*\*\s*$")
RE_META = re.compile(r"^`(.+)`\s*$")


def parse_meta(line):
    """`k: v | k: v` -> ordered list of (key, value). Returns [] if not a meta line."""
    m = RE_META.match(line)
    if not m:
        return []
    out = []
    for part in m.group(1).split(" | "):
        if ": " not in part:
            return []
        k, v = part.split(": ", 1)
        out.append((k.strip(), v.strip()))
    return out


def paragraphs(lines):
    """Join wrapped markdown lines into paragraphs, dropping blanks."""
    out, buf = [], []
    for ln in lines:
        if ln.strip():
            buf.append(ln.strip())
        elif buf:
            out.append(" ".join(buf))
            buf = []
    if buf:
        out.append(" ".join(buf))
    return out


def parse_backlog(text):
    """Return a list of epic dicts in document order, each with its features."""
    lines = text.split("\n")
    epics, band = [], None
    epic = None
    feature = None
    buf = []

    def flush():
        nonlocal buf, feature
        if feature is not None:
            feature["body"] = paragraphs(buf)
        elif epic is not None:
            epic["body"] = paragraphs(buf)
        buf = []

    for i, ln in enumerate(lines):
        if i > 20000:
            die("backlog-epics.md is longer than the bounded read")
        if ln.startswith("# Risks and things I would change"):
            flush()
            break
        mb = RE_BAND.match(ln)
        if mb:
            flush()
            feature = None
            epic = None
            band = mb.group(1)
            continue
        if band is None:
            continue
        me = RE_EPIC.match(ln)
        if me:
            flush()
            feature = None
            epic = {"id": me.group(1), "title": me.group(2), "band": band,
                    "meta": [], "body": [], "features": []}
            epics.append(epic)
            if len(epics) > MAX_EPICS:
                die("more epics than the bound allows")
            continue
        mf = RE_FEATURE.match(ln)
        if mf:
            flush()
            if epic is None:
                die("feature %s before any epic heading" % mf.group(1))
            feature = {"id": mf.group(1), "title": mf.group(2), "meta": [], "body": []}
            epic["features"].append(feature)
            continue
        meta = parse_meta(ln)
        if meta:
            target = feature if feature is not None else epic
            # An epic's metaline sits after a blank line, a feature's does not,
            # so blank-only buffer still counts as "nothing said yet".
            if target is not None and not target["meta"] and not any(b.strip() for b in buf):
                target["meta"] = meta
                buf = []
                continue
        if epic is not None:
            buf.append(ln)
    flush()
    if not epics:
        die("parsed no epics")
    for e in epics:
        if not e["meta"]:
            die("epic %s parsed without its metaline" % e["id"])
        for f in e["features"]:
            if not f["meta"]:
                die("feature %s parsed without its metaline" % f["id"])
    return epics


def parse_board_mapping(text):
    """The 'Board mapping, all twelve items' table, verbatim."""
    rows = []
    in_table = False
    for ln in text.split("\n"):
        if ln.startswith("## Board mapping"):
            in_table = True
            continue
        if in_table:
            if ln.startswith("## ") and rows:
                break
            if not ln.startswith("|"):
                continue
            cells = [c.strip() for c in ln.strip().strip("|").split("|")]
            if len(cells) != 4 or cells[0] in ("Board band", "---"):
                continue
            if set(cells[0]) <= set("-: "):
                continue
            rows.append({"band": cells[0], "item": cells[1], "epic": cells[2], "note": cells[3]})
    off_board = [r for r in rows if r["item"] == "--"]
    if len(rows) < 18 or len(off_board) != 3:
        die("board mapping table has %d rows and %d off-board rows; expected at least "
            "18 and exactly 3" % (len(rows), len(off_board)))
    return rows


def parse_calendar(text):
    """The confirmed phase table and the demo dates, from 'The calendar'."""
    rows, demos, in_sec = [], "", False
    for ln in text.split("\n"):
        if ln.startswith("## The calendar"):
            in_sec = True
            continue
        if in_sec and ln.startswith("## "):
            break
        if not in_sec:
            continue
        if ln.startswith("Demo Wednesdays:"):
            demos = ln.strip()
        if not ln.startswith("|"):
            continue
        cells = [c.strip() for c in ln.strip().strip("|").split("|")]
        if len(cells) != 3 or cells[0] == "Phase" or set(cells[0]) <= set("-: "):
            continue
        rows.append(cells)
    if len(rows) != 4 or not demos:
        die("calendar section parsed %d rows and demos %r" % (len(rows), demos))
    return rows, demos


def parse_sprint_zero(text):
    """The E00 framing paragraphs, minus the embed and the versioning note."""
    keep, section = [], "intro"
    for ln in text.split("\n"):
        if ln.startswith("## "):
            section = ln[3:].strip()
            continue
        if ln.startswith("# "):
            continue
        if section in ("intro", "Why it exists", "What it costs"):
            if "<iframe" in ln or ln.startswith("[Open the plan"):
                continue
            keep.append(ln)
    body = paragraphs(keep)
    if not body:
        die("sprint-zero.md produced no body")
    return body


def parse_story(path):
    text = path.read_text()
    m = re.search(r"^title: (.+)$", text, re.M)
    title = m.group(1).strip() if m else path.stem
    ac = []
    in_ac = False
    for ln in text.split("\n"):
        if ln.startswith("## "):
            in_ac = ln.strip() == "## AC"
            continue
        if in_ac and re.match(r"^- \[[ x]\]", ln):
            ac.append({"done": ln[3] == "x", "text": ln[6:].strip()})
        elif in_ac and ac and ln.startswith("  "):
            ac[-1]["text"] += " " + ln.strip()
    return {"title": title, "ac": ac}


def load_stories():
    out = {}
    for p in sorted((ROOT / "tracking" / "stories").glob("S-*.md")):
        out[p.stem.split("-")[0] + "-" + p.stem.split("-")[1]] = parse_story(p)
    return out


# --------------------------------------------------------------------------
# Jira correlation
# --------------------------------------------------------------------------

RE_CODE = re.compile(r"^(E\d{2}(?:-F\d+)?)\b")


def load_jira():
    data = json.loads(read("scripts/data/jira-scribl.json"))
    issues = data["issues"]
    by_code = {}
    for it in issues:
        m = RE_CODE.match(it["summary"])
        if not m:
            die("issue %s has no leading Enn-Fn code: %s" % (it["key"], it["summary"]))
        # Jira carries the final codes, so no mapping here. Only the markdown
        # sources, which still use the pre-renumber codes, go through renumber().
        code = m.group(1)
        if code in by_code:
            die("code %s matches two issues, %s and %s"
                % (code, by_code[code]["key"], it["key"]))
        by_code[code] = it
    return data, issues, by_code


# --------------------------------------------------------------------------
# Rendering
# --------------------------------------------------------------------------

DISC_CLASS = {"ios": "disc-ios", "backend": "disc-backend", "aws": "disc-aws", "qa": "disc-qa",
              "platform": "disc-platform", "product": "disc-product",
              "delivery": "disc-delivery", "design": "disc-product"}


def disc_class(value):
    v = value.lower()
    for k, cls in DISC_CLASS.items():
        if k in v:
            return cls
    return "disc-product"


def jira_link(code, by_code, seen):
    it = by_code.get(code)
    if it is None:
        return '<span class="nofile">not yet filed in Jira</span>'
    seen.add(it["key"])
    return ('<a class="jkey" href="%s%s" target="_blank" rel="noopener">%s</a>'
            % (JIRA_BROWSE, esc(it["key"]), esc(it["key"])))


def render_meta(meta):
    if not meta:
        return ""
    cells = []
    for k, v in meta:
        cells.append('<span class="kv"><span class="k">%s</span><span class="v">%s</span></span>'
                     % (esc(k), md(v)))
    return '<div class="metarow">%s</div>' % "".join(cells)


def render_story_ac(code, stories):
    ids = STORY_MAP.get(code, [])
    blocks = []
    for sid in ids:
        st = stories.get(sid)
        if st is None:
            die("STORY_MAP points at %s, which has no file" % sid)
        items = "".join(
            '<li class="%s">%s</li>' % ("met" if a["done"] else "open", md(a["text"]))
            for a in st["ac"])
        blocks.append(
            '<details class="ac"><summary>Proven in the prototype: %s, %s</summary>'
            '<ul class="aclist">%s</ul></details>'
            % (esc(sid), esc(st["title"]), items))
    return "".join(blocks)


def render_feature(f, by_code, seen, stories):
    body = "".join("<p>%s</p>" % md(p) for p in f["body"])
    meta = dict(f["meta"])
    disc = meta.get("discipline", "")
    chip = ('<span class="chip disc %s">%s</span>' % (disc_class(disc), esc(disc))) if disc else ""
    return (
        '<article class="feature">'
        '<div class="fhead"><span class="fid">%s</span><span class="ftitle">%s</span>%s'
        '<span class="jslot">%s</span></div>'
        "%s%s%s</article>"
        % (esc(f["id"]), esc(f["title"]), chip, jira_link(f["id"], by_code, seen),
           render_meta(f["meta"]), body, render_story_ac(f["id"], stories)))


def render_epic_tab(e, by_code, seen, stories, board_rows):
    meta = dict(e["meta"])
    band = e["band"]
    disc = meta.get("discipline", "")
    items = stickies_for(e["id"])
    satisfies = ""
    if items:
        satisfies = ('<p class="satisfies">Delivers the board sticky %s</p>'
                     % ", ".join('<b>&ldquo;%s&rdquo;</b>' % esc(i) for i in items))
    elif e["id"] not in ("E00",):
        note = next((r["note"] for r in board_rows if r["epic"] == e["id"]), "")
        satisfies = ('<p class="satisfies addition">Not on the kickoff board. %s</p>'
                     % esc(note))
    epic_link = jira_link(e["id"], by_code, seen)
    body = "".join("<p>%s</p>" % md(p) for p in e["body"])
    feats = "".join(render_feature(f, by_code, seen, stories) for f in e["features"])
    if len(e["features"]) > MAX_FEATURES:
        die("epic %s exceeds the feature bound" % e["id"])
    return (
        '<section class="tabpanel" id="tab-%s" role="tabpanel" aria-labelledby="btn-%s" hidden>'
        '<div class="epichead"><span class="chip band band-%s">%s</span>'
        '<span class="chip disc %s">%s</span><span class="jslot">%s</span></div>'
        "<h2>%s %s</h2>%s%s"
        '<h3 class="fcount">%d features</h3>%s</section>'
        % (e["id"], e["id"], band, BAND_LABEL[band], disc_class(disc), esc(disc), epic_link,
           esc(e["id"]), esc(e["title"]), satisfies, body, len(e["features"]), feats))


def stickies_for(epic_id):
    """The board stickies a given epic delivers, board wording, tags stripped."""
    return [re.sub(r"</?s>", "", text)
            for band, text, epic, note in BOARD_STICKIES if epic == epic_id]


def render_stickies():
    counts = {"GREEN": 7, "ORANGE": 5, "GRAY": 6}
    bands = []
    for band in ("GREEN", "ORANGE", "GRAY"):
        cards = [(t, e, n) for b, t, e, n in BOARD_STICKIES if b == band]
        if len(cards) != counts[band]:
            die("%s band transcribed %d stickies, expected %d"
                % (band, len(cards), counts[band]))
        out = []
        for text, epic, note in cards:
            tag = ('<span class="stag">%s</span>' % esc(epic) if epic
                   else '<span class="stag none">no epic</span>')
            out.append('<div class="sticky s-%s"><div class="stext">%s</div>'
                       '<div class="smeta">%s</div></div>%s'
                       % (band, text, tag,
                          '<div class="snote">%s</div>' % esc(note) if note else ""))
        bands.append(
            '<div class="bandframe f-%s"><div class="bandtitle">%s</div>'
            '<div class="stickywall">%s</div></div>'
            % (band, esc(BOARD_FRAMES[band]),
               "".join('<div class="scell">%s</div>' % c for c in out)))
    return "".join(bands)


def render_roster():
    team = "".join("<tr><td>%s</td><td>%s</td><td>%s</td></tr>"
                   % (esc(n), esc(r), esc(al)) for n, r, al in ROSTER_BOUNTEOUS)
    seats = "".join("<tr><td>%s</td><td>%s</td><td>%s</td></tr>"
                    % (esc(n), esc(r), esc(al)) for n, r, al in ROSTER_OPEN)
    client = "".join("<tr><td>%s</td><td>%s</td></tr>" % (esc(n), esc(r))
                     for n, r in ROSTER_SCRIBL)
    return (
        "<h3>The delivery team</h3>"
        '<table class="tbl"><thead><tr><th>Person</th><th>Role</th><th>On this engagement</th>'
        "</tr></thead><tbody>%s</tbody></table>"
        "<h3>Open seats</h3>"
        "<p>Named as seats, because each one changes what week eight looks like.</p>"
        '<table class="tbl gap"><thead><tr><th>Seat</th><th>Lane</th><th>Where it stands</th>'
        "</tr></thead><tbody>%s</tbody></table>"
        "<h3>Scribl</h3>"
        '<table class="tbl"><thead><tr><th>Person</th><th>Role</th></tr></thead>'
        "<tbody>%s</tbody></table>" % (team, seats, client))


def render_overview(calendar):
    cal_rows, demos = calendar
    cal = ('<table class="tbl"><thead><tr><th>Phase</th><th>Dates</th>'
           "<th>Working days</th></tr></thead><tbody>%s</tbody></table>"
           % "".join("<tr><td>%s</td><td>%s</td><td class=\"num\">%s</td></tr>"
                     % (esc(a), esc(b), esc(c)) for a, b, c in cal_rows))
    return (
        '<section class="tabpanel" id="tab-OVERVIEW" role="tabpanel" '
        'aria-labelledby="btn-OVERVIEW">'
        "<h2>Who is on this, and the window it runs in</h2>"
        '<p class="lead">An eight-week phase for Scribl, iOS first. The people are below and '
        "the dates are under them. Backlog holds the work and where it came from, Questions "
        "holds what we are waiting on, Meetings holds the cadence.</p>"
        "%s"
        "<h3>The window</h3>"
        "<p>Confirmed, not proposed. Everything is prioritized against these dates.</p>"
        "%s"
        '<p class="note">%s</p>'
        "</section>"
        % (render_roster(), cal, esc(demos)))


def render_backlog(board_rows, epics, by_code, unplaced):
    feature_total = sum(len(e["features"]) for e in epics)
    filed = sum(1 for e in epics if e["id"] in by_code)
    rules = "".join(
        '<div class="rule"><div class="rname">%s</div><div class="rtext">%s</div></div>'
        % (esc(k), esc(v)) for k, v in KICKOFF_RULES)
    unplaced_rows = "".join(
        "<tr><td>%s</td><td>%s</td></tr>" % (esc(u["item"]), esc(u["where"]))
        for u in unplaced)

    groups = []
    for band in BAND_ORDER:
        members = [e for e in epics if e["band"] == band]
        if not members:
            continue
        rows = []
        for e in members:
            items = stickies_for(e["id"])
            if items:
                cover = ", ".join("&ldquo;%s&rdquo;" % esc(i) for i in items)
            else:
                note = next((r["note"] for r in board_rows
                             if renumber(r["epic"]) == e["id"]), "")
                cover = ('<span class="addition">Not on the board. %s</span>'
                         % esc(renumber(note))
                         if note else '<span class="addition">The Shape window, added after '
                                      'the board. Fifteen spikes, each producing a decision.</span>')
            key = ('<a href="%s%s" target="_blank" rel="noopener">%s</a>'
                   % (JIRA_BROWSE, by_code[e["id"]]["key"], by_code[e["id"]]["key"])
                   if e["id"] in by_code else '<span class="nofile">not yet filed</span>')
            rows.append(
                '<tr><td class="num"><a href="#tab-%s" data-goto="%s">%s</a></td>'
                "<td>%s</td><td>%s</td><td class=\"num\">%d</td><td>%s</td></tr>"
                % (e["id"], e["id"], esc(e["id"]), esc(e["title"]), cover,
                   len(e["features"]), key))
        groups.append(
            '<h3><span class="chip band band-%s">%s</span> %s</h3>'
            '<table class="tbl"><thead><tr><th>Epic</th><th>Name</th>'
            "<th>Board sticky it delivers</th><th>Features</th><th>Jira</th></tr></thead>"
            "<tbody>%s</tbody></table>"
            % (band, BAND_LABEL[band], esc(BAND_BLURB[band]), "".join(rows)))

    return (
        '<section class="tabpanel" id="tab-BACKLOG" role="tabpanel" '
        'aria-labelledby="btn-BACKLOG" hidden>'
        "<h2>What is in the backlog, and where it came from</h2>"
        '<p class="lead">%d epics, %d features. %d epics are filed in Jira today and the rest '
        "are on this page only. Open the caret beside Backlog in the rail for any epic's "
        "features, their facts and their Jira links.</p>"
        "%s"
        "<h3>The board, as it was left</h3>"
        "<p>Eighteen stickies in three bands, in the board’s own wording. Every one now has an "
        "epic behind it. Three of them did not before this session.</p>"
        "%s"
        "<h3>The rules that came out of the session</h3>"
        "<p>These are the constraints the backlog is built inside. They are Scribl’s "
        "decisions, recorded on the day.</p>"
        '<div class="rules">%s</div>'
        '<h3 class="danger-head">Six things the designs imply that no epic funds</h3>'
        "<p>Named rather than softened. Separate from the three stickies that just got epics. "
        "Each one needs a decision: fund it, defer it with a date, or drop it out loud.</p>"
        '<table class="tbl gap"><thead><tr><th>The ask</th><th>Where it stands</th></tr>'
        "</thead><tbody>%s</tbody></table>"
        "<h3>The epics</h3>"
        "<p>Grouped by band, and numbered in band order.</p>"
        "%s</section>"
        % (len(epics), feature_total, filed,
           linkout("Open the SCRIBL backlog in Jira", JIRA_BOARD,
                   "Board 13809. The epics filed there are linked from every row below."),
           render_stickies(), rules, unplaced_rows, "".join(groups)))


def render_questions():
    rows = "".join(
        "<tr><td><b>%d</b></td><td>%s</td><td>%s</td><td class=\"num\">%s</td></tr>"
        % (i + 1, esc(q), esc(why), esc(holds))
        for i, (q, holds, why) in enumerate(TEAM_QUESTIONS))
    return (
        '<section class="tabpanel" id="tab-QUESTIONS" role="tabpanel" '
        'aria-labelledby="btn-QUESTIONS" hidden>'
        "<h2>What we are waiting on</h2>"
        '<p class="lead">The open questions as they stand today, in the order they sit on the '
        "board. Each one names the work it holds, so answering it moves something specific. "
        "This list grows after each standup and the board carries the same rows.</p>"
        "%s"
        '<table class="tbl gap"><thead><tr><th>#</th><th>Question</th>'
        "<th>Why it matters</th><th>What it holds</th></tr></thead><tbody>%s</tbody></table>"
        '<p class="note">Ten open, and the first two are the two that gate a working demo '
        "on a real device.</p>"
        "</section>"
        % (linkout("Add a question on the Lucid board", LUCID_BOARD,
                   "This is the live list. Anything added there lands here on the next build."),
           rows))


def render_meetings():
    cad = "".join("<tr><td>%s</td><td>%s</td><td>%s</td></tr>"
                  % (esc(a), esc(b), esc(c)) for a, b, c in MEETINGS_CADENCE)
    dates = "".join(
        '<tr><td class="num">%s</td><td>%s</td><td><b>%s</b></td><td>%s</td></tr>'
        % (esc(d), esc(w), esc(t), esc(n)) for d, w, t, n in MEETINGS_DATES)
    return (
        '<section class="tabpanel" id="tab-MEETINGS" role="tabpanel" '
        'aria-labelledby="btn-MEETINGS" hidden>'
        "<h2>Meetings</h2>"
        '<p class="lead">The cadence, and the four sessions that carry this phase. Two-week '
        "blocks from Monday 2026-08-24, with the demo on the second Friday of each block.</p>"
        "<h3>The cadence</h3>"
        '<table class="tbl"><thead><tr><th>Meeting</th><th>When</th><th>Who and what for</th>'
        "</tr></thead><tbody>%s</tbody></table>"
        "<h3>The dated sessions</h3>"
        '<table class="tbl"><thead><tr><th>Date</th><th>Day</th><th>Session</th>'
        "<th>What it is</th></tr></thead><tbody>%s</tbody></table>"
        '<p class="note">This Friday demo cadence supersedes the Wednesday readout cadence in '
        "the confirmed calendar on the Overview page. The phase dates themselves have not "
        "moved. Two things to settle: the 2026-10-02 demo falls on an India national holiday, "
        "and the design sync still has no time.</p>"
        "</section>"
        % (cad, dates))


CSS = """
:root{--midnight:#0B111C;--indigo:#33139F;--violet:#693AF4;--purple:#853EFF;
--eblue:#34B4FF;--paper:#FAFAFC;--card:#FFFFFF;--gray-50:#F4F5F8;--gray-100:#EAECF2;
--gray-500:#636B82;--gray-700:#2D3344;--danger:#EF4444;--warning:#F59E0B;
--ink:var(--midnight);--accent:var(--violet);--tint:var(--gray-50);--line:var(--gray-100);
--muted:var(--gray-500);
--green:#18864A;--orange:#B4530A;--sprint0:#1F4E9C;--gray:#55606E;--parked:#20145F;
--mono:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace}
*{box-sizing:border-box}html,body{margin:0;padding:0}
body{background:var(--paper);color:var(--ink);font-size:15px;line-height:1.55;
font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif}
.masthead{background:linear-gradient(90deg,var(--eblue) 0%,var(--purple) 100%);height:6px}
.brandbar{background:var(--midnight);color:#fff}
.barrow{display:flex;align-items:center;gap:14px;padding:12px 20px;max-width:1240px;
margin:0 auto}
.wordmark{font-size:19px;font-weight:800;letter-spacing:-.03em;line-height:1}
.wordmark .dot{color:var(--eblue)}
.bardiv{width:1px;height:18px;background:rgba(255,255,255,.28)}
.client{font-size:14px;font-weight:700;letter-spacing:.02em;color:#E7E9F0}
.barspace{flex:1 1 auto}
.barmeta{font-size:12px;color:#AEB5C6;letter-spacing:.02em}
.titleblock{padding:22px 0 4px}
.titleblock h1{margin:0 0 6px}
.eyebrow{font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.1em;
color:var(--violet);margin:0 0 6px}
.gradrule{height:3px;border-radius:2px;margin:14px 0 4px;
background:linear-gradient(90deg,var(--violet) 0%,var(--purple) 45%,var(--eblue) 100%)}
h2{background-image:linear-gradient(90deg,var(--violet),var(--purple));background-repeat:no-repeat;
background-position:0 100%;background-size:64px 3px;border-bottom:1px solid var(--line)}
.wrap{max-width:1240px;margin:0 auto;padding:0 20px 72px}
.layout{display:flex;align-items:flex-start;gap:28px}
.col{flex:1 1 auto;min-width:0}
h1{font-size:30px;margin:22px 0 4px;letter-spacing:-.015em}
h2{font-size:23px;margin:34px 0 14px;padding-bottom:10px}
h3{font-size:18px;margin:30px 0 8px}
p{margin:0 0 12px;max-width:80ch}
a{color:var(--accent)}
a:focus-visible,button:focus-visible,summary:focus-visible{outline:2px solid var(--eblue);outline-offset:2px}
.lead{font-size:17px}
.meta-line{color:var(--muted);font-size:13px;margin:0 0 18px}
.tabs{position:sticky;top:18px;flex:0 0 216px;width:216px;display:flex;flex-direction:column;
gap:3px;max-height:calc(100vh - 36px);overflow-y:auto;padding:8px;background:var(--card);
border:1px solid var(--line);border-radius:12px}
.tabs button{font:inherit;font-size:13px;font-weight:700;cursor:pointer;border-radius:8px;
border:1px solid transparent;background:transparent;color:var(--gray-700);padding:7px 10px;
text-align:left;display:flex;align-items:center;gap:8px;width:100%}
.tabs button:hover{background:var(--tint)}
.tabs button[aria-selected="true"]{background:var(--indigo);color:#fff;border-color:var(--indigo)}
.tabs .tgroup{font-size:10.5px;text-transform:uppercase;letter-spacing:.06em;color:var(--muted);
font-weight:700;padding:12px 10px 4px}
.tabs .tname{flex:1 1 auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tabs .tcode{font-family:var(--mono);font-size:11.5px;opacity:.75}
.tabs button .bdot{display:inline-block;width:8px;height:8px;border-radius:50%;flex:0 0 8px}
.bdot.b-GREEN{background:var(--green)}.bdot.b-ORANGE{background:var(--orange)}
.bdot.b-GRAY{background:var(--gray)}.bdot.b-PARKED{background:var(--parked)}
.bdot.b-SPRINT0{background:var(--sprint0)}
.bdot.b-OVERVIEW{background:var(--accent)}
.bdot.b-QUESTIONS{background:var(--warning)}
.bdot.b-MEETINGS{background:var(--eblue)}
.bdot.b-BACKLOG{background:var(--indigo)}
.navgroup{margin-top:2px}
.grouprow{display:flex;align-items:center;gap:2px}
.grouprow>button[role="tab"]{flex:1 1 auto}
.disclose{flex:0 0 26px;height:28px;border:1px solid transparent;background:transparent;
border-radius:8px;cursor:pointer;display:flex;align-items:center;justify-content:center;padding:0}
.disclose:hover{background:var(--tint)}
.caret{width:0;height:0;border-left:5px solid var(--gray-500);border-top:4px solid transparent;
border-bottom:4px solid transparent;transition:transform .12s ease}
.navgroup.open .caret{transform:rotate(90deg)}
.navkids{display:none;margin:2px 0 0 8px;padding-left:8px;border-left:1px solid var(--line)}
.navgroup.open .navkids{display:block}
.navkids button{font-size:12.5px;padding:5px 8px}
.bandframe{border-radius:12px;padding:12px 14px 14px;margin:0 0 14px;border:1px solid}
.bandframe.f-GREEN{background:#F1FBF4;border-color:#BEE7CC}
.bandframe.f-ORANGE{background:#FFF7EC;border-color:#FFD79A}
.bandframe.f-GRAY{background:#F5F6F8;border-color:#D8DCE4}
.bandtitle{font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:.06em;
margin-bottom:10px}
.f-GREEN .bandtitle{color:#0C5A31}
.f-ORANGE .bandtitle{color:#8A3F06}
.f-GRAY .bandtitle{color:#3B4250}
.stickywall{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px}
.scell{display:flex;flex-direction:column;gap:6px}
.sticky{min-height:112px;padding:11px;border-radius:3px;box-shadow:0 2px 5px rgba(11,17,28,.16);
display:flex;flex-direction:column;justify-content:space-between}
.sticky .stext{font-size:13.5px;font-weight:700;line-height:1.35}
.sticky .stext s{opacity:.6}
.sticky .smeta{margin-top:10px}
.stag{font-family:var(--mono);font-size:10.5px;font-weight:700;letter-spacing:.04em;
background:rgba(11,17,28,.14);border-radius:4px;padding:1px 6px}
.stag.none{background:var(--danger);color:#fff}
.snote{font-size:11.5px;color:var(--gray-700);line-height:1.4}
.s-GREEN{background:#BFF0CE;color:#0C3D22}
.s-ORANGE{background:#FFD9A8;color:#5A2E00}
.s-GRAY{background:#DCDFE6;color:#2B313C}
.rules{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:10px;margin:12px 0 6px}
.rule{background:var(--card);border:1px solid var(--line);border-left:3px solid var(--accent);
border-radius:0 10px 10px 0;padding:10px 12px}
.rname{font-size:11.5px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);font-weight:700}
.rtext{font-size:13.5px}
table.tbl{width:100%;border-collapse:collapse;font-size:13.5px;background:var(--card);
border:1px solid var(--line);margin:10px 0 18px;border-radius:12px;overflow:hidden}
table.tbl th,table.tbl td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--line);vertical-align:top}
table.tbl th{background:var(--tint);font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;color:var(--gray-700)}
table.tbl tr:last-child td{border-bottom:none}
td.num{font-family:var(--mono);white-space:nowrap}
.gap{border-color:var(--danger)}
.linkout{display:flex;flex-wrap:wrap;align-items:baseline;gap:10px;background:var(--card);
border:1px solid var(--line);border-left:3px solid var(--accent);border-radius:0 10px 10px 0;
padding:10px 14px;margin:0 0 18px}
.linkout a{font-weight:700;font-size:14px}
.linkout .lnote{font-size:12.5px;color:var(--muted)}
.danger-head{border-left:4px solid var(--danger);padding-left:10px}
.chip{display:inline-block;font-size:11px;font-weight:700;letter-spacing:.04em;padding:3px 10px;
border-radius:999px;margin-right:6px;text-transform:uppercase;white-space:nowrap}
.chip.band-GREEN{background:var(--green);color:#fff}
.chip.band-ORANGE{background:var(--orange);color:#fff}
.chip.band-GRAY{background:var(--gray);color:#fff}
.chip.band-PARKED{background:var(--parked);color:#fff}
.chip.band-SPRINT0{background:var(--sprint0);color:#fff}
.chip.disc{text-transform:none;font-weight:600;border:1px solid}
.disc-ios{background:#E7F0FF;color:#113B7A;border-color:#B7D0FF}
.disc-backend{background:#EAF7EE;color:#145A32;border-color:#BEE7CC}
.disc-aws{background:#FFF3E0;color:#7A4A00;border-color:#FFD79A}
.disc-qa{background:#F1ECFE;color:#3A1E8A;border-color:#CFC0FB}
.disc-platform{background:#EFEBFF;color:#3B2C82;border-color:#CBBFF7}
.disc-product{background:#E9FBF7;color:#0D6156;border-color:#B4EEE2}
.disc-delivery{background:#FFF9DB;color:#6B5600;border-color:#F3E28C}
.epichead{margin-top:18px}
.jslot{font-size:12.5px}
a.jkey{font-family:var(--mono);font-weight:700;text-decoration:none;border-bottom:1px solid currentColor}
.nofile{font-family:var(--mono);font-size:12px;color:var(--gray-700);background:#FFF7E6;
border:1px solid var(--warning);border-radius:6px;padding:2px 7px}
.satisfies{font-size:13.5px;background:var(--tint);border-left:3px solid var(--accent);
border-radius:0 8px 8px 0;padding:8px 12px}
.satisfies.addition{border-left-color:var(--warning)}
.addition{color:var(--gray-700)}
.fcount{font-size:12px;text-transform:uppercase;letter-spacing:.05em;color:var(--muted);
margin:26px 0 8px;border-top:1px solid var(--line);padding-top:10px}
.feature{background:var(--card);border:1px solid var(--line);border-radius:12px;
padding:14px 16px;margin:0 0 12px}
.fhead{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-bottom:8px}
.fid{font-family:var(--mono);font-weight:700;font-size:12.5px;background:var(--ink);color:#fff;
border-radius:6px;padding:2px 8px}
.ftitle{font-weight:700;font-size:15.5px;flex:1 1 260px}
.metarow{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:10px}
.kv{font-size:11.5px;background:var(--tint);border:1px solid var(--line);border-radius:6px;padding:2px 8px}
.kv .k{color:var(--muted);text-transform:uppercase;letter-spacing:.04em;margin-right:6px}
.kv .v{font-weight:600}
details.ac{margin-top:8px;border-top:1px dashed var(--line);padding-top:8px}
details.ac summary{cursor:pointer;font-size:12.5px;color:var(--gray-700);font-weight:700}
ul.aclist{margin:8px 0 0;padding-left:18px;font-size:13px}
ul.aclist li.met::marker{content:"\\2713  "}
ul.aclist li.open::marker{content:"\\25CB  "}
footer{margin-top:40px;border-top:1px solid var(--line);padding-top:14px;font-size:12.5px;color:var(--muted)}\n.fmark{font-size:13px;color:var(--ink);margin-right:2px}
@media (max-width:900px){
.layout{display:block}
.tabs{position:static;width:auto;flex:none;flex-direction:row;flex-wrap:wrap;max-height:none;
margin-bottom:18px}
.tabs button{width:auto}
.tabs .tgroup{width:100%}
.tabs .tname{display:none}
}
@media print{
.tabs{display:none}
.layout{display:block}
.brandbar{background:#fff;color:#000;border-bottom:2px solid #000}
.barmeta,.client{color:#000}
.wordmark .dot{color:#000}
.tabpanel{display:block!important}
.tabpanel[hidden]{display:block!important}
.feature{break-inside:avoid;box-shadow:none}
.sticky{box-shadow:none;border:1px solid #999}
body{font-size:11pt}
a[href^="http"]::after{content:" (" attr(href) ")";font-size:9pt;color:#444}
h2{break-before:page}
#tab-OVERVIEW h2{break-before:auto}
}
"""

JS = r"""
(function(){
  var btns=[].slice.call(document.querySelectorAll('.tabs button'));
  var panels=[].slice.call(document.querySelectorAll('.tabpanel'));
  function show(id){
    for(var i=0;i<panels.length;i++){panels[i].hidden=(panels[i].id!=='tab-'+id);}
    for(var j=0;j<btns.length;j++){
      btns[j].setAttribute('aria-selected', btns[j].dataset.tab===id?'true':'false');
    }
    if(location.hash!=='#tab-'+id){history.replaceState(null,'','#tab-'+id);}
    var g=document.getElementById('navgroup-backlog');
    if(g&&(id==='BACKLOG'||/^E\d\d$/.test(id))){
      g.classList.add('open');
      var d=g.querySelector('.disclose');
      if(d){d.setAttribute('aria-expanded','true');}
    }
    window.scrollTo(0,0);
  }
  for(var k=0;k<btns.length;k++){
    btns[k].addEventListener('click',function(e){show(e.currentTarget.dataset.tab);});
  }
  document.addEventListener('click',function(e){
    var t=e.target.closest?e.target.closest('[data-goto]'):null;
    if(t){e.preventDefault();show(t.getAttribute('data-goto'));}
  });
  var start=(location.hash||'').replace('#tab-','')||'OVERVIEW';
  if(!document.getElementById('tab-'+start)){start='OVERVIEW';}
  show(start);
  var grp=document.getElementById('navgroup-backlog');
  var disc=grp?grp.querySelector('.disclose'):null;
  function setOpen(open){
    if(!grp){return;}
    grp.classList.toggle('open',open);
    if(disc){disc.setAttribute('aria-expanded',open?'true':'false');}
  }
  if(disc){disc.addEventListener('click',function(){setOpen(!grp.classList.contains('open'));});}
  setOpen(start==='BACKLOG'||/^E\d\d$/.test(start));
})();
"""


def build():
    backlog = read("tracking/backlog-epics.md")
    epics = renumber_all(parse_backlog(backlog))
    board_rows = parse_board_mapping(backlog)
    stories = renumber_all(load_stories())
    jira, issues, by_code = load_jira()

    # E00 is the Shape window. Its detail lives in scripts/data/e00-spikes.json,
    # lifted verbatim from the earlier one-file build, and its framing comes from
    # tracking/sprint-zero.md.
    spikes = renumber_all(json.loads(read("scripts/data/e00-spikes.json")))
    e00_epic = by_code.get("E00")
    e00 = {
        "id": "E00",
        "title": e00_epic["summary"].split(" ", 1)[1] if e00_epic else "Sprint 0, the Shape window",
        "band": "SPRINT0",
        "meta": [("id", "E00"), ("band", "SPRINT 0"),
                 ("window", "2026-08-24 to 2026-09-01, seven working days"),
                 ("discipline", "All lanes")],
        "body": parse_sprint_zero(read("tracking/sprint-zero.md")),
        "features": [],
    }
    for s in spikes:
        e00["features"].append({
            "id": s["id"],
            "title": s["title"],
            "meta": [("parent", "E00"), ("discipline", s["discipline"]),
                     ("owner", s["owner"]), ("timebox", s["timebox"]),
                     ("answers", s["answers"]), ("source", s["source"])],
            "body": ["The question. " + s["question"],
                     "The artifact. " + s["artifact"],
                     "What it unblocks. " + s["unblocks"],
                     s["why"]],
        })
    epics = [e00] + epics

    # Band first, number second, so each band reads as one block.
    epics.sort(key=lambda e: (BAND_ORDER.index(e["band"]), e["id"]))
    ids = sorted(e["id"] for e in epics)
    expected = ["E%02d" % n for n in range(0, 19)]
    if ids != expected:
        die("epic set is %s, expected %s" % (ids, expected))
    # After the renumber the bands must read in order, which is the whole point.
    seq = [e["band"] for e in epics]
    if seq != sorted(seq, key=BAND_ORDER.index):
        die("bands are not contiguous: %s" % seq)

    seen = set()

    def navbtn(tid, label, extra=""):
        return ('<button role="tab" data-tab="%s" id="btn-%s" aria-selected="false" '
                'aria-controls="tab-%s"%s><span class="bdot b-%s"></span>'
                '<span class="tname">%s</span></button>'
                % (tid, tid, tid, extra, tid, esc(label)))

    tabs = [navbtn("OVERVIEW", "Overview"),
            navbtn("QUESTIONS", "Questions"),
            navbtn("MEETINGS", "Meetings"),
            ('<div class="navgroup" id="navgroup-backlog">'
             '<div class="grouprow">%s'
             '<button class="disclose" type="button" aria-expanded="false" '
             'aria-controls="navkids" aria-label="Show the epics">'
             '<span class="caret"></span></button></div>'
             '<div class="navkids" id="navkids">%%s</div></div>'
             % navbtn("BACKLOG", "Backlog"))]

    panels = [render_overview(parse_calendar(backlog)),
              render_questions(),
              render_meetings(),
              render_backlog(board_rows, epics, by_code, UNPLACED)]

    kids, band_seen = [], None
    for e in epics:
        if e["band"] != band_seen:
            band_seen = e["band"]
            kids.append('<div class="tgroup">%s</div>' % esc(BAND_LABEL[band_seen]))
        kids.append('<button role="tab" data-tab="%s" id="btn-%s" aria-selected="false" '
                    'aria-controls="tab-%s" title="%s %s">'
                    '<span class="bdot b-%s"></span><span class="tcode">%s</span>'
                    '<span class="tname">%s</span></button>'
                    % (e["id"], e["id"], e["id"], esc(e["id"]), esc(e["title"]),
                       e["band"], esc(e["id"]), esc(e["title"])))
        panels.append(render_epic_tab(e, by_code, seen, stories, board_rows))
    tabs[-1] = tabs[-1] % "".join(kids)

    all_keys = set(i["key"] for i in issues)
    missing = sorted(all_keys - seen)
    if missing:
        die("these Jira issues never reached the artifact: %s" % ", ".join(missing))
    if len(seen) != len(all_keys):
        die("rendered %d keys against %d in the snapshot" % (len(seen), len(all_keys)))

    feature_total = sum(len(e["features"]) for e in epics)
    doc = (
        "<!doctype html>\n<html lang=\"en\">\n<head>\n<meta charset=\"utf-8\">\n"
        '<meta name="viewport" content="width=device-width,initial-scale=1">\n'
        "<title>Scribl: the eight-week backlog, by epic</title>\n"
        "<style>%s</style>\n</head>\n<body>\n"
        '<header class="brandbar"><div class="barrow">'
        '<span class="wordmark">bounteous<span class="dot">.</span></span>'
        '<span class="bardiv"></span><span class="client">Scribl</span>'
        '<span class="barspace"></span>'
        '<span class="barmeta">Eight-week phase, 2026-08-24 to 2026-10-16</span>'
        "</div></header>\n"
        '<div class="masthead"></div>\n<div class="wrap">\n'
        '<div class="titleblock">'
        '<p class="eyebrow">Scribl Shape kickoff</p>'
        "<h1>Scribl: the eight-week backlog, by epic</h1>"
        '<div class="gradrule"></div></div>\n'
        '<p class="meta-line">Shape kickoff, 2026-08-25. %d epics, %d features, '
        "%d issues filed in Jira. Built from the working backlog and a snapshot of the Jira "
        "board taken %s. Where the two disagree, the board wins and this page says so.</p>\n"
        '<div class="layout">\n<nav class="tabs" role="tablist" aria-label="Epics">%s</nav>\n'
        '<div class="col">%s</div>\n</div>\n'
        '<footer><span class="wordmark fmark">bounteous<span class="dot">.</span></span>'
        " for Scribl. Generated by <code>scripts/build-workshop-artifact.py</code>. "
        "One file, no network, no fonts, no analytics.</footer>\n"
        "</div>\n<script>%s</script>\n</body>\n</html>\n"
        % (CSS, len(epics), feature_total, len(all_keys), esc(jira["fetched"]),
           "".join(tabs), "\n".join(panels), JS))

    # Every sticky must land on an epic that exists, and every Enn-Fn code the
    # prose cites must have a card. The renumber makes both easy to get wrong.
    live = set(ids)
    for band, text, epic, note in BOARD_STICKIES:
        if epic is not None and epic not in live:
            die("sticky %r points at %s, which is not an epic" % (text, epic))
    cards = set()
    for e in epics:
        for f in e["features"]:
            cards.add(f["id"])
    cited = set(re.findall(r"\bE\d\d-F\d+\b", doc))
    dangling = sorted(cited - cards)
    if dangling:
        die("the page cites feature codes that do not exist: %s" % ", ".join(dangling))

    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(doc)
    print("wrote %s" % OUT)
    print("epics %d, features %d, jira keys rendered %d/%d"
          % (len(epics), feature_total, len(seen), len(all_keys)))


if __name__ == "__main__":
    build()
