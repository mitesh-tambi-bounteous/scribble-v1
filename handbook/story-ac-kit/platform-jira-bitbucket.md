# Platform Notes: Jira + Bitbucket

The kit's contract and skills are tracker-agnostic; this file is the platform-specific layer
for a Jira board and Bitbucket repos. It replaces section 7 of `backlog-management.md` when
you are on this stack.

## Where the contract lives

The four sections go in the Jira issue **description** as markdown-style headings. Jira's
wiki renderer shows them as headings either way; what matters is that an agent reading the
description over the API sees the literal heading text. Install the skeleton from
`template-issue-work-item.md` as the project's description template or as an Automation
rule ("when issue created, if description empty, set description to `<skeleton>`").

## Field conventions

| Kit concept | Jira home | Notes |
|---|---|---|
| Module | **Component** | The collision check reads components; keep one component per module |
| Status | Board column: `Backlog` / `Ready` / `Active` / `In Review` / `Done` | "Ready" is still the body test, never the column alone |
| Work type (Feature / Foundation / Fix batch) | Label | Labels are flat and cheap to query |
| Size | Story points or a `size` label | Whichever the team already uses |
| Blocked by / Blocks | Issue links (`is blocked by` / `blocks`) | Also written in the Dependencies section so agents see them in the body |

## Jira facts worth knowing (the agent-safety table)

| Fact | Consequence |
|---|---|
| A description update over the REST API **replaces the whole description** | This is the silent-corruption hazard: a model retyping the body can mangle the contract sections. Prefer a comment for findings, status notes, and evidence. When you do edit a description, read the current body first and send it back whole with your change applied, never a retype from memory |
| Comments append and are immutable-ish | Safe for agents. The findings log and session reports are comments |
| The API speaks ADF (v3) or wiki markup (v2), not GitHub markdown | Headings survive, checkboxes may render differently; verify the `- [ ]` lines round-trip in your instance before relying on checkbox state. The AC-lock table lives in the repo (`.agent/ac-lock.md`), not in Jira, so rendering quirks do not weaken the gate |
| JQL is the cheap query | Ready set: `project = <KEY> AND status = Ready AND issueLinkType != "is blocked by" ORDER BY rank`. Collision set: `status = Active` grouped by component |
| Transitions are id-based, not name-based | Moving an issue needs the transition id for that workflow; `getTransitionsForJiraIssue` is how you find it. A session that cannot resolve or run a transition says so rather than claiming the move happened |
| Access | Prefer the Atlassian MCP server or `acli` if provisioned; otherwise REST with an API token. A worker session needs comment, edit-issue, create-issue, transition-issue, and read; `getAccessibleAtlassianResources` reports the scopes actually granted, so a session checks rather than guesses. Never let an agent hold admin scopes |

## The findings log

GitHub's "never-closing findings issue" becomes a designated Jira issue (e.g. `<KEY>-FINDINGS`,
a Task that never closes) or a Confluence page. Agents append **comments** to it, because a
comment is cheap and reversible while a half-formed issue is not. A genuine new work item does
not have to wait in the findings log first: an agent can create it directly, paired with its
story file in the repo in the same session. Findings-log comments are Jira writes like any
other, so each one gets its row in `tracking/jira-mirror.md`; the findings log is not a
lighter-weight path.

## Bitbucket pull requests

PR mechanics in the skills (open the PR, findings in the PR description, pre-PR diff audit)
carry over unchanged; only the tooling differs.

| Fact | Consequence |
|---|---|
| No `gh` CLI; use the Bitbucket REST API, the Atlassian MCP server, or the repo's pipeline bot | The session brief should name which is available so the agent does not guess |
| Branch → issue linking is by branch name (`<KEY>-123-slug`) | Name worktree branches with the Jira key so the PR auto-links to the issue and the smart-commit hooks fire |
| Smart commits (`<KEY>-123 #comment ...`) can comment and transition from commit messages | Both are allowed, but a transition buried in a commit message is invisible to anyone reading the board and easy to fire by accident on a rebase or an amended message; make the move explicitly (a real transition call) instead of relying on `#transition`. A `#comment` or a smart-commit transition is still a Jira write and still needs its row in `tracking/jira-mirror.md` |
| Default reviewers and merge checks are repo settings | Put the human gate there: minimum 1 approval, no self-merge. The gate then holds even if a session ignores its brief |

## Worktrees

Nothing changes: Bitbucket is just the remote. One worktree per work item, branch named with
the Jira key, PR back to the default branch.
