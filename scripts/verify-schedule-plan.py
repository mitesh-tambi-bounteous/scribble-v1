#!/usr/bin/env python3
"""Gate checks for docs/meetings/schedule-plan.html.

Checks, in order: prose bytes, self-containment, anchor and id integrity,
weekday labels against the real 2026 calendar, timezone quadruples, and a
collision grid over required attendees from 2026-08-21 to 2026-10-15.

Bounded loops, asserted invariants, no network, no writes.
"""
import datetime
import re
import sys

PAGE = "docs/meetings/schedule-plan.html"
# Escapes, not literals. This repo forbids the em dash and en dash bytes in any
# committed file, including the script that checks for them.
EM_DASH = "\u2014"
EN_DASH = "\u2013"
ARROW = "\u2192"
GRID_START = datetime.date(2026, 8, 21)
GRID_END = datetime.date(2026, 10, 15)
MAX_DAYS = 120

fails = []


def check(cond, label, detail=""):
    print(("PASS  " if cond else "FAIL  ") + label + (" " + detail if detail else ""))
    if not cond:
        fails.append(label)


text = open(PAGE, encoding="utf-8").read()

# 1. prose bytes
check(text.count(EM_DASH) == 0, "no em dash", "count=%d" % text.count(EM_DASH))
check(text.count(EN_DASH) == 0, "no en dash", "count=%d" % text.count(EN_DASH))
check(text.count(ARROW) == 0, "no unicode arrow")
non_ascii = sorted(set(c for c in text if ord(c) > 127))
check(not non_ascii, "ascii only", repr(non_ascii))

# 2. self-contained, no remote resource load
loads = re.findall(r'(?:src|href)="(http[^"]*)"', text)
loads += re.findall(r'@import[^;]*http', text)
loads += re.findall(r'url\(\s*[\'"]?http', text)
check(not loads, "no remote resource load", repr(loads))

# 3. anchors and ids
ids = re.findall(r'\sid="([^"]+)"', text)
check(len(ids) == len(set(ids)), "ids unique",
      repr([i for i in set(ids) if ids.count(i) > 1]))
anchors = re.findall(r'href="#([^"]+)"', text)
missing = [a for a in anchors if a not in ids]
check(not missing, "every in-page anchor resolves", repr(missing))
targets = re.findall(r'data-target="([^"]+)"', text)
check(all(x in ids for x in targets), "every copy button target exists",
      repr([x for x in targets if x not in ids]))
row_ids = re.findall(r'data-row-id="([^"]+)"', text)
box_ids = re.findall(r'class="send-check" data-id="([^"]+)"', text)
check(row_ids == box_ids, "checklist row ids match checkbox ids")
check(all(r in ids for r in row_ids), "every checklist row links to a live block",
      repr([r for r in row_ids if r not in ids]))
retired = re.search(r'RETIRED_IDS = \[([^\]]*)\]', text)
check(retired is not None, "retired key list present")
if retired:
    dead = re.findall(r'"([^"]+)"', retired.group(1))
    check(not set(dead) & set(row_ids), "no retired key collides with a live row",
          repr(sorted(set(dead) & set(row_ids))))

# 4. every weekday label in the page matches the real 2026 calendar
DAYS = ("Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday")
labelled = re.findall(r'(%s)\s+(2026-\d\d-\d\d)' % "|".join(DAYS), text)
check(len(labelled) > 30, "found weekday labels to check", "n=%d" % len(labelled))
bad = [(d, iso) for d, iso in labelled
       if datetime.date.fromisoformat(iso).strftime("%A") != d]
check(not bad, "every weekday label matches the 2026 calendar", repr(bad))

# 5. timezone quadruples. CDT is UTC-5, IST UTC+5:30, PT is PDT UTC-7 for every
#    date in this window, US DST ends 2026-11-01.
OFFSETS = {"UTC": 5 * 60, "IST": 10 * 60 + 30, "PT": -2 * 60}
quads = re.findall(
    r'(\d\d):(\d\d) to (\d\d):(\d\d) CDT \((\d\d):(\d\d) to (\d\d):(\d\d) UTC, '
    r'(\d\d):(\d\d) to (\d\d):(\d\d) IST, (\d\d):(\d\d) to (\d\d):(\d\d) PT\)', text)
singles = re.findall(
    r'(\d\d):(\d\d) to (\d\d):(\d\d) CDT \((\d\d):(\d\d) UTC, (\d\d):(\d\d) IST, '
    r'(\d\d):(\d\d) PT\)', text)
check(len(quads) + len(singles) > 8, "found timezone quadruples",
      "ranges=%d starts=%d" % (len(quads), len(singles)))


def mins(h, m):
    return int(h) * 60 + int(m)


tz_bad = []
for q in quads:
    start = mins(q[0], q[1])
    end = mins(q[2], q[3])
    pairs = (("UTC", mins(q[4], q[5]), mins(q[6], q[7])),
             ("IST", mins(q[8], q[9]), mins(q[10], q[11])),
             ("PT", mins(q[12], q[13]), mins(q[14], q[15])))
    for zone, zs, ze in pairs:
        if zs != (start + OFFSETS[zone]) % 1440 or ze != (end + OFFSETS[zone]) % 1440:
            tz_bad.append((q, zone))
for s in singles:
    start = mins(s[0], s[1])
    pairs = (("UTC", mins(s[4], s[5])), ("IST", mins(s[6], s[7])),
             ("PT", mins(s[8], s[9])))
    for zone, zs in pairs:
        if zs != (start + OFFSETS[zone]) % 1440:
            tz_bad.append((s, zone))
check(not tz_bad, "every timezone quadruple is arithmetically right", repr(tz_bad))

# 6. collision grid over required attendees
ROB, PANKAJ, NITISH = "Rob", "Pankaj", "Nitish"
NEELESH, KARUNA, PRAMOD = "Neelesh", "Karuna", "Pramod"
DAVID, JOHN, ANGIE, MARTY = "David", "John", "Angie", "Marty"
ERIC, MATT, CHRISTINA = "Eric", "Matt", "Christina"
TEAM = [ROB, PANKAJ, NITISH, NEELESH, KARUNA, PRAMOD]

# id, start, end, required, list of dates
SCHEDULE = [
    ("R1", "08:30", "08:45", TEAM, "weekdays 2026-08-24..2026-10-13"),
    ("R2", "13:00", "13:30", [CHRISTINA, ERIC, ROB], "tuesdays 2026-08-25..2026-10-13"),
    ("R3", "10:00", "10:20", [ERIC, ROB], "mondays 2026-08-24..2026-10-12 skip 2026-09-07"),
    ("R4", "09:30", "10:45", [ERIC, ROB, DAVID, NEELESH, PANKAJ],
     "2026-09-02 2026-09-16 2026-09-30 2026-10-14"),
    ("R6", "08:00", "08:30", TEAM, "2026-09-16 2026-09-30 2026-10-14"),
    ("R7", "09:00", "10:15", TEAM, "2026-09-03 2026-09-17 2026-10-01 2026-10-15"),
    ("R8", "09:00", "09:30", [DAVID, ROB, PRAMOD, JOHN, ANGIE, MARTY],
     "mondays 2026-08-31..2026-10-12"),
    ("O1", "10:00", "11:00", [ROB, DAVID, ERIC], "2026-08-21"),
    ("O2", "09:00", "10:00", TEAM, "2026-08-24"),
    ("O3", "13:00", "13:30", [PRAMOD, PANKAJ, NITISH, ROB, ERIC], "2026-08-24"),
    ("O4", "10:00", "11:30", [ERIC, ROB, DAVID, PANKAJ, NEELESH], "2026-08-25"),
    ("O5", "11:00", "12:00", [CHRISTINA, ROB, ERIC], "2026-08-26"),
    ("O6", "09:00", "09:30", TEAM, "2026-08-27"),
    ("O7", "09:00", "10:30", TEAM, "2026-09-01"),
    ("O9", "11:00", "12:30", [ERIC, MATT, DAVID, ROB, ANGIE], "2026-09-30"),
    ("O11", "12:00", "13:00", [ERIC, MATT, ROB, MARTY], "2026-08-25"),
]


def expand(spec):
    """Turn a date spec into a bounded list of dates."""
    out = []
    m = re.match(r'(weekdays|tuesdays|mondays) (\S+)\.\.(\S+)(?: skip (\S+))?$', spec)
    if m:
        kind, first, last, skip = m.groups()
        want = {"weekdays": (0, 1, 2, 3, 4), "tuesdays": (1,), "mondays": (0,)}[kind]
        day = datetime.date.fromisoformat(first)
        stop = datetime.date.fromisoformat(last)
        guard = 0
        while day <= stop and guard < MAX_DAYS:
            if day.weekday() in want and (skip is None or day.isoformat() != skip):
                out.append(day)
            day += datetime.timedelta(days=1)
            guard += 1
        assert guard < MAX_DAYS, "unbounded expansion for " + spec
        return out
    for token in spec.split():
        out.append(datetime.date.fromisoformat(token))
    return out


by_day = {}
for mid, start, end, people, spec in SCHEDULE:
    for day in expand(spec):
        if not (GRID_START <= day <= GRID_END):
            continue
        s = mins(*start.split(":"))
        e = mins(*end.split(":"))
        by_day.setdefault(day, []).append((s, e, mid, people))

clashes = []
for day in sorted(by_day):
    slots = sorted(by_day[day])
    for i in range(len(slots)):
        for j in range(i + 1, len(slots)):
            a, b = slots[i], slots[j]
            if a[1] > b[0]:  # touching end to start is not an overlap
                shared = sorted(set(a[3]) & set(b[3]))
                if shared:
                    clashes.append((day.isoformat(), a[2], b[2], shared))
check(not clashes, "no required attendee double booked, 2026-08-21 to 2026-10-15",
      repr(clashes))
print("      grid covered %d days, %d meeting instances"
      % (len(by_day), sum(len(v) for v in by_day.values())))

# 7. counts quoted in the page hold
client_rows = len(re.findall(r'data-row-id="[^"]+"[^\n]*?tag-client', text))
internal_rows = len(re.findall(r'data-row-id="[^"]+"[^\n]*?tag-internal', text))
check(client_rows + internal_rows == len(row_ids), "every row is tagged client or internal")
check(len(row_ids) == 17, "17 invites on the checklist", "n=%d" % len(row_ids))
check(client_rows == 9, "9 client-facing series", "n=%d" % client_rows)

# 8. India column, at-a-glance table. IST is UTC+5:30 year round, CDT is
#    UTC-5 for every date in this window (US DST ends 2026-11-01, after the
#    last row here), so the CDT to IST offset is a constant 10 hours 30
#    minutes for this schedule. Recomputed independently per row, day label
#    included, from the CDT value already checked above, not assumed.
IST_OFFSET_MIN = 10 * 60 + 30
DAY_ABBR = {"Monday": "Mon", "Tuesday": "Tue", "Wednesday": "Wed",
            "Thursday": "Thu", "Friday": "Fri", "Saturday": "Sat", "Sunday": "Sun"}


def shift_ist(hhmm):
    total = mins(*hhmm.split(":")) + IST_OFFSET_MIN
    return total // 1440, "%02d:%02d" % ((total % 1440) // 60, (total % 1440) % 60)


def weekday_after(name, day_delta):
    idx = (DAYS.index(name) + day_delta) % 7
    return DAY_ABBR[DAYS[idx]]


def date_after(iso, day_delta):
    return (datetime.date.fromisoformat(iso) + datetime.timedelta(days=day_delta)).isoformat()


# id, cdt start, cdt end (or None for a deadline-only row), day kind, day value
INDIA_ROWS = [
    ("R1", "08:30", "08:45", "weekdays", None),
    ("R2", "13:00", "13:30", "weekday", "Tuesday"),
    ("R3", "10:00", "10:20", "weekday", "Monday"),
    ("R4", "09:30", "10:45", "weekday", "Wednesday"),
    ("R6", "08:00", "08:30", "weekday", "Wednesday"),
    ("R7", "09:00", "10:15", "weekday", "Thursday"),
    ("R8", "09:00", "09:30", "weekday", "Monday"),
    ("R9", "16:00", None, "weekday", "Friday"),
    ("O1", "10:00", "11:00", "date", "2026-08-21"),
    ("O2", "09:00", "10:00", "date", "2026-08-24"),
    ("O3", "13:00", "13:30", "date", "2026-08-24"),
    ("O4", "10:00", "11:30", "date", "2026-08-25"),
    ("O5", "11:00", "12:00", "date", "2026-08-26"),
    ("O6", "09:00", "09:30", "date", "2026-08-27"),
    ("O7", "09:00", "10:30", "date", "2026-09-01"),
    ("O9", "11:00", "12:30", "date", "2026-09-30"),
    ("O11", "12:00", "13:00", "date", "2026-08-25"),
]
check(len(INDIA_ROWS) == 17, "17 India rows to check", "n=%d" % len(INDIA_ROWS))

rows_html = re.findall(r'<tr data-row-id="([^"]+)">(.*?)</tr>', text, re.S)
rows_by_id = dict(rows_html)

india_bad = []
for rid, cdt_start, cdt_end, kind, dayval in INDIA_ROWS:
    row_html = rows_by_id.get(rid, "")
    cells = re.findall(r'<td[^>]*>(.*?)</td>', row_html, re.S)
    india_cell = cells[6] if len(cells) > 6 else ""

    if cdt_end is None:
        # deadline-only row (R9): a single time rolling to the next day
        d0, t0 = shift_ist(cdt_start)
        if kind == "weekday":
            label0 = weekday_after(dayval, 0)
            label1 = weekday_after(dayval, d0)
        expected = "%s deadline = %s %s IST" % (label0, label1, t0)
    else:
        d0, t0 = shift_ist(cdt_start)
        d1, t1 = shift_ist(cdt_end)
        if kind == "weekdays":
            expected = "Mon-Fri %s to %s IST" % (t0, t1)
        elif kind == "weekday":
            label0 = weekday_after(dayval, d0)
            label1 = weekday_after(dayval, d1)
            if d0 == d1:
                expected = "%s %s to %s IST" % (label0, t0, t1)
            else:
                expected = "%s %s IST to %s %s IST" % (label0, t0, label1, t1)
        elif kind == "date":
            date0 = date_after(dayval, d0)
            date1 = date_after(dayval, d1)
            label0 = DAY_ABBR[datetime.date.fromisoformat(date0).strftime("%A")]
            label1 = DAY_ABBR[datetime.date.fromisoformat(date1).strftime("%A")]
            if date0 == date1:
                expected = "%s %s %s to %s IST" % (label0, date0, t0, t1)
            else:
                expected = "%s %s %s IST to %s %s %s IST" % (label0, date0, t0, label1, date1, t1)

    if expected != india_cell.strip():
        india_bad.append((rid, expected, india_cell.strip()))

check(not india_bad, "every India column value recomputes to match the page",
      repr(india_bad))

print()
if fails:
    print("FAILED: " + ", ".join(fails))
    sys.exit(1)
print("all checks passed")
