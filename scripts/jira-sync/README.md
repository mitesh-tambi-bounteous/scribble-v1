# jira-sync

The scripts behind the story-ac-kit Jira filing pipeline (see
`handbook/story-ac-kit/` for the pipeline doc and the V3 story template).
They turn a markdown story file into a filed Jira epic with stories, and
attach any local files the stories reference. Every write step is gated by a
dry run; nothing is filed without an explicit `--execute`.

## Commands

```
node scripts/jira-sync/jira-sync.mjs <command> <file> [options]
```

| command | pipeline stage | what it does |
|---|---|---|
| `preflight` | Stage 1 | parses the file and validates every parser and content rule; prints a report; exit 0 iff no errors |
| `dry-run` | Stage 3 | preflight, then builds the creation plan and prints it as readable text; never writes anything, never touches the network |
| `create` | Stage 2 and 4 | without `--execute`, prints the same dry-run plan and exits 2; with `--execute`, files the epic and stories in Jira |
| `attach` | Stage 5 | without `--execute`, lists local files referenced from story descriptions that would be attached; with `--execute`, attaches them to the issues created earlier |

Options:

- `--epic-key KEY` file stories under an existing epic instead of creating one (input mode 2).
- `--existing FILE` a JSON array of existing Jira summaries, for an offline duplicate check when you cannot hit Jira yet.
- `--config FILE` a JSON config file; environment variables still override it.
- `--state FILE` path to the state journal (default: `<file>.sync-state.json`, beside the input).
- `--patterns FILE` internal-content patterns file (default: `internal-patterns.json` next to `lib/`).
- `--execute` actually write to Jira. Only `create` and `attach` accept it.

## Config

`create` and `attach` need write capability, resolved by `lib/config.mjs`
from environment variables (a `--config` JSON file can supply the same keys,
but env always wins):

| variable | meaning |
|---|---|
| `JIRA_BASE_URL` | e.g. `https://yourcompany.atlassian.net` |
| `JIRA_EMAIL` | the account email for basic auth |
| `JIRA_API_TOKEN` | the API token for that account |
| `JIRA_PROJECT_KEY` | the Jira project key to file into |
| `JIRA_STORY_POINTS_FIELD` | the custom field id for story points, e.g. `customfield_10016`. Find it in Jira project settings under the relevant screen's field configuration; there is no standard field for this. |
| `JIRA_EPIC_ISSUE_TYPE` | issue type name for epics, default `Epic` |
| `JIRA_STORY_ISSUE_TYPE` | issue type name for stories, default `Story` |

If any of base URL, email, token, or project key is missing, `loadConfig`
returns null and the tool refuses to write. `preflight` and `dry-run` never
need this config; they never import the Jira client.

## The dry-run-first workflow

1. `preflight <file>` until it reports zero errors.
2. `dry-run <file>` and read the plan. It numbers every issue in creation
   order, indents stories under their epic, shows labels/points/status per
   line, marks anything already filed as `SKIP <key>`, lists the link plan,
   and lists attachment candidates. The plan always ends with
   `DRY RUN. Nothing was sent to Jira.`
3. `create <file> --execute` once the dry run looks right.
4. `attach <file> --execute` once the stories exist, to attach referenced
   local files.

## The state file and the idempotency key

Each create run writes `<file>.sync-state.json` beside the input (or wherever
`--state` points), and rewrites it after every single successful creation.
The key into that file is the stable key: the item id for backlog items
(`E01`, `E01-F1`), or the whitespace-normalized, lowercased summary for V3
stories that have no id. `create` and `attach` both use this file to map
issues to Jira keys; `dry-run` reads it to mark already-filed items as
`SKIP`.

The same file also carries an `attached` map, the attach journal. Its key is
`<stableKey>::<local path>`, one entry per file already attached to an issue.
`attach` rewrites the whole state file after every single successful attach,
the same atomic tmp-write-then-rename as a create.

## When a create run dies partway

Read the printed report: it names every issue already created, the one that
failed and why, and how many remain. Fix the cause (usually a Jira-side
problem: a field name, a permission, a rate limit), then re-run the exact
same command. The state file is a resume journal: everything already
recorded as created gets skipped, and the run picks up from where it
stopped. Never delete the state file after a partial run; deleting it is
the one action that turns a partial failure into duplicate issues.

## When an attach run dies partway

Same shape as a create run dying partway: read the printed report, it names
every file already attached, the one that failed and why, and how many
remain. Fix the cause, then re-run the exact same `attach <file> --execute`
command. The `attached` map in the state file skips whatever is already
recorded as landed, so a resumed run only attaches the remainder.

## Internal-content refusal

Before anything is filed, `preflight` scans every issue's summary and
description against `internal-patterns.json` (markers like "internal only",
and known client-sensitive facts). Any match is a hard error naming the file,
line, and matched pattern; the tool refuses to file that content, it does
not strip or rewrite it. To extend the check, add an entry with a `pattern`
(a valid regex, case-insensitive) and a `why` to the `markers` or `facts`
array in `internal-patterns.json`.

## Dash policy

Both em dash and en dash are accepted on input. Everything the tool would
file is normalized to the ASCII form ` -- ` on the way out; a
`dash-normalized` warning reports how many were replaced. Nothing that reads
this tool's output should ever see a literal em or en dash.

## The V1 refusal

Old-format story files (`**KEY-1: Title**` headings) are detected but not
parsed. The parser reports one error, `legacy-v1`, and tells you to convert
the file to the V3 template
(`handbook/story-ac-kit/templates/story-v3-jira.md`) first. There is no
V1 parser to fall back to; converting is the only path forward.

## Tests

```
node scripts/jira-sync/run-tests.mjs
```

Discovers and runs every `test-*.mjs` in this directory, sequentially, and
reports a final pass/fail tally. Not wired into the repo's `npm test`.
