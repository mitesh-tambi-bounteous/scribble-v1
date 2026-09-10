# Work Item Template (the four-section contract)

Jira-primary. Install as the project's Story/Task **description template** (project settings →
issue types, or an Automation rule that seeds new issues with this skeleton). The four section
headings are the contract: the `acceptance-criteria-lock` and `scope-checkpoint` skills bind to
them **literally**, so keep the heading text byte-identical wherever the item lives.

For a repo using GitHub Issues instead, see the GitHub variant note in the source PR's INSTALL.md.

---

## Outcome

One or two sentences describing the change someone outside the team would notice.
If it cannot be described as a noticeable outcome, it is a checklist line inside another
work item, not a work item of its own.

## Acceptance criteria

Every criterion is a checkbox, is independently verifiable, and names the evidence that
proves it. Aim for 3 to 8. Each line follows one of the EARS forms (see the
`ears-acceptance-criteria` skill in `.claude/skills/`).

- [ ] When `<trigger>`, the system shall `<observable response>`.
      Verification: `<exact command>` exits 0
- [ ] If `<invalid condition>`, the system shall `<corrective response>`.
      Verification: `<exact command>` prints `<exact string>`
- [ ] The system shall `<invariant>`.
      Verification: `<exact command>` returns no output

## Scope -- modules and files in play

The files and modules this work item is allowed to touch. Directory globs are fine; be
specific enough that two work items running in parallel can be checked for collisions by
reading these two sections alone. Mirror the module as the Jira **component**.

- `src/<module>/**`
- `tests/<module>/**`
- Component: `<Jira component>`

## Explicitly out of scope

The adjacent, tempting work this item will **not** do. This section exists to be quoted
back at an agent mid-session, so name the specific temptations, not generalities.

- Refactoring `<file>` (tracked separately as `<KEY-n>`)
- Renaming `<thing>`
- Any change to `<shared file everything touches>`

## Dependencies

- Blocked by: `<KEY-n>` (also add the Jira "is blocked by" link)
- Blocks: `<KEY-n>`

## Notes

Decisions already made, links, prior art. Anything that is a **decision still to be made**
belongs here as an explicit "decide before build" line, which holds the item out of Ready.
