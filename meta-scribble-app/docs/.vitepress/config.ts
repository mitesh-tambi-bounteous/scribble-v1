import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vitepress'
import { withMermaid } from 'vitepress-plugin-mermaid'
import {
  buildArchitectureGroup,
  buildClientCallsGroup,
  buildDesignHistoryGroup,
  buildEpicsSidebar,
  buildHandbookGroup,
  buildPrototypeGroups,
  buildStandupsGroup,
  buildStoriesSidebar,
  buildWorkshopsSidebar,
  latestWorkshopLink
} from './sidebar.mts'

const DOCS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..')

// Workshops surface only when at least one workshop retro has been synced, so
// the nav item and sidebar section never point at nothing.
const workshops = buildWorkshopsSidebar()
const workshopLink = latestWorkshopLink()

// The expo-rebuild epics page surfaces only once its tracking source has been
// synced, so the sidebar never links a page that does not exist yet.
const hasExpoEpics = existsSync(join(DOCS_DIR, 'expo-rebuild-epics.md'))

// Production-planning pages surface only once their sources have been synced,
// same guard pattern as the epics page.
const hasSprintBacklog = existsSync(join(DOCS_DIR, 'production-sprint-backlog.md'))
const epicPages = buildEpicsSidebar()
const storyPages = buildStoriesSidebar()
const hasOnboarding = existsSync(join(DOCS_DIR, 'onboarding.md'))

// The open-questions page is hand-authored, not synced. Guarded the same way so
// the nav never points at nothing if it is removed.
const hasOpenQuestions = existsSync(join(DOCS_DIR, 'open-questions.md'))

// The standup log surfaces only once its source has been synced, same guard
// pattern as the other pages above.
const hasStandups = existsSync(join(DOCS_DIR, 'knowledge/meetings/standups.md'))

const standupsGroup = buildStandupsGroup()
const clientCallsGroup = buildClientCallsGroup()
const handbookItems = buildHandbookGroup()
const architectureMediaGroup = buildArchitectureGroup()
const designHistoryGroup = buildDesignHistoryGroup()
const prototypeGroups = buildPrototypeGroups()

// Doc site for the scribl project brain. Pages under docs/ are rendered
// from product/, tracking/, handbook/, knowledge/, and reviews/ by
// scripts/docs-sync.mjs; do not hand-edit generated
// pages.
export default withMermaid({
  title: 'scribl',
  description: 'Generated project brain',
  cleanUrls: true,
  lastUpdated: true,
  ignoreDeadLinks: false,

  markdown: {
    lineNumbers: true
  },

  themeConfig: {
    nav: [
      { text: 'Home', link: '/' },
      ...(hasOnboarding ? [{ text: 'Onboarding', link: '/onboarding' }] : []),
      { text: 'The Plan', link: '/roadmap' },
      ...(hasOpenQuestions ? [{ text: 'Open Questions', link: '/open-questions' }] : []),
      ...(hasStandups ? [{ text: 'Standups', link: '/knowledge/meetings/standups' }] : []),
      ...(workshopLink ? [{ text: 'Workshops', link: workshopLink }] : []),
      { text: 'Knowledge', link: '/knowledge/' }
    ],

    sidebar: [
      {
        text: 'Start Here',
        collapsed: false,
        items: [
          { text: 'Home', link: '/' },
          ...(hasOnboarding ? [{ text: 'Onboarding, the reading path', link: '/onboarding' }] : []),
          { text: 'Project Overview', link: '/overview' },
          { text: 'The Story', link: '/story' }
        ]
      },
      {
        text: 'The Product',
        collapsed: false,
        items: [
          { text: 'Full-App Spec', link: '/scribl-full-app-spec' },
          { text: 'POC Realignment Plan', link: '/design/poc-realignment-plan' },
          { text: 'Screen and Flow Inventory', link: '/design/screen-flow-inventory' },
          { text: 'PRFAQ', link: '/context/documents/scribl-d2c-mlp-prfaq' },
          { text: 'MVP Scope', link: '/context/documents/scribl-d2c-mvp-scope' },
          ...(designHistoryGroup ? [designHistoryGroup] : []),
          ...(architectureMediaGroup ? [architectureMediaGroup] : []),
          { text: 'Input Artifacts', link: '/input-artifacts' }
        ]
      },
      ...(prototypeGroups.length > 0
        ? [{
            text: 'Prototype',
            collapsed: true,
            items: [{ text: 'What this section is', link: '/prototype/' }, ...prototypeGroups]
          }]
        : []),
      {
        text: 'The Plan',
        collapsed: false,
        items: [
          { text: 'Roadmap', link: '/roadmap' },
          { text: 'Status', link: '/status' },
          { text: 'Board', link: '/board' },
          { text: 'Sprint 0', link: '/sprint-zero' },
          { text: 'Creating the Backlog', link: '/backlog-epics' },
          ...(epicPages.length > 0
            ? [{ text: 'Epics', collapsed: true, items: [{ text: 'All Epics', link: '/epics/' }, ...epicPages] }]
            : []),
          {
            text: 'Stories',
            collapsed: true,
            items: [{ text: 'All Stories', link: '/stories/' }, ...storyPages]
          },
          { text: 'Timeline and Milestones', link: '/timeline-and-milestones' },
          { text: 'Client Priority to Delivery Week', link: '/client-priority-to-delivery-week' },
          { text: 'Epic to Board Mapping', link: '/epic-board-mapping' },
          { text: 'Jira Board (SCRIBL)', link: '/jira-board' },
          ...(hasOpenQuestions ? [{ text: 'Open Questions', link: '/open-questions' }] : [])
        ]
      },
      {
        text: 'Architecture',
        collapsed: false,
        items: [
          { text: 'Production Backend Plan', link: '/production-backend-plan' },
          { text: 'Target AWS Architecture', link: '/context/pages/reference/poc/architecture/README' },
          { text: 'Cost Model', link: '/context/pages/reference/poc/architecture/cost-model' },
          { text: 'Future Architecture (AWS)', link: '/context/future-architecture-aws' },
          {
            text: 'Enhancement Pipeline (Mission Cloud)',
            link: '/context/pages/reference/poc/architecture/mission-cloud-enhancement-pipeline'
          },
          {
            text: 'Enhancement Pipeline (Ours)',
            link: '/context/pages/reference/poc/architecture/our-enhancement-pipeline'
          },
          { text: 'Future Scale Track', link: '/future-scale-track' },
          { text: 'Technical Implementation Plan', link: '/context/pages/reference/technical-implementation-plan' },
          { text: 'Android Distribution', link: '/android-distribution' },
          { text: 'iOS Distribution', link: '/ios-distribution' }
        ]
      },
      {
        text: 'How We Work',
        collapsed: true,
        items: handbookItems
      },
      {
        text: 'Meetings & Workshops',
        collapsed: false,
        items: [
          ...(standupsGroup ? [standupsGroup] : []),
          ...(clientCallsGroup ? [clientCallsGroup] : []),
          ...(workshops.length > 0 ? [{ text: 'Workshops', collapsed: true, items: workshops }] : []),
          { text: 'Knowledge Index', link: '/knowledge/' }
        ]
      },
      {
        text: 'Archive',
        collapsed: true,
        items: [
          { text: 'Production Starter Backlog', link: '/production-backlog' },
          ...(hasExpoEpics ? [{ text: 'Expo Rebuild Epics', link: '/expo-rebuild-epics' }] : []),
          ...(hasSprintBacklog ? [{ text: 'Production Sprint Backlog', link: '/production-sprint-backlog' }] : []),
          { text: 'Client Summary (June)', link: '/context/pages/reference/client-summary' },
          { text: 'Engagement Approach (June)', link: '/context/pages/reference/engagement-approach' },
          { text: 'Discussion Topics (June)', link: '/context/pages/reference/discussion-topics' },
          { text: 'Architecture Plan', link: '/context/pages/reference/architecture-plan' }
        ]
      }
    ],

    footer: {
      message: 'Generated project brain',
      copyright: 'Internal use only'
    }
  }
})
