// context-excludes.mjs -- the one list of pages under product/context/ that are
// internal and never reach the rendered site.
//
// Two scripts need it and they must not disagree. docs-sync.mjs uses it to skip
// those pages when rendering product/context into docs/context. context-ingest.mjs
// uses it so the "Project Information" index it generates does not link to a page
// docs-sync will not render, which is a dead link and fails `npm run docs:build`.
//
// Before this list was shared, the two disagreed and the index was corrected by
// hand after each run. A hand correction to a generated file is undone by the next
// run, so the fix belongs here.
//
// Paths are relative to product/context/. A trailing slash excludes the subtree.

export const CONTEXT_EXCLUDES = [
  'pages/README.md',
  'pages/reference/poc/project-dna/',
  'pages/reference/discussions/',
  'pages/reference/arc-ideation-readme.md',
  'pages/reference/scribl-team-model.md',
  'documents/scribl-poc-handover-v2.md',
  'documents/scribl-bounteous-sow-mobile-app-development.md',
  'data/'
]
