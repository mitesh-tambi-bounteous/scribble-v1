// config.mjs -- loads Jira write-capability config from a file and/or env.
//
// Returns null (never throws) when required fields are missing: callers treat
// null as "no write capability" and must not attempt network calls.
// The token is redacted from describeConfig() on purpose: this object gets
// logged and must never leak a credential into a report or a decision log.

import { readFileSync } from 'node:fs'

const REQUIRED = ['baseUrl', 'email', 'token', 'projectKey']

export function loadConfig({ env = process.env, configPath = null } = {}) {
  let fromFile = {}
  if (configPath !== null) {
    let raw
    try {
      raw = readFileSync(configPath, 'utf8')
    } catch (err) {
      throw new Error(`loadConfig: cannot read config file ${configPath}: ${err.message}`)
    }
    try {
      fromFile = JSON.parse(raw)
    } catch (err) {
      throw new Error(`loadConfig: invalid JSON in ${configPath}: ${err.message}`)
    }
  }

  const config = {
    baseUrl: env.JIRA_BASE_URL ?? fromFile.baseUrl ?? null,
    email: env.JIRA_EMAIL ?? fromFile.email ?? null,
    token: env.JIRA_API_TOKEN ?? fromFile.token ?? null,
    projectKey: env.JIRA_PROJECT_KEY ?? fromFile.projectKey ?? null,
    storyPointsField: env.JIRA_STORY_POINTS_FIELD ?? fromFile.storyPointsField ?? null,
    epicIssueType: env.JIRA_EPIC_ISSUE_TYPE ?? fromFile.epicIssueType ?? 'Epic',
    storyIssueType: env.JIRA_STORY_ISSUE_TYPE ?? fromFile.storyIssueType ?? 'Story',
  }

  for (const key of REQUIRED) {
    if (config[key] === null || config[key] === undefined || config[key] === '') {
      return null
    }
  }
  return config
}

export function describeConfig(config) {
  if (!config) return 'no config (write capability: none)'
  let host = config.baseUrl
  try {
    host = new URL(config.baseUrl).host
  } catch {
    // keep raw value if not a valid URL; still never print the token
  }
  const hasToken = typeof config.token === 'string' && config.token.length > 0
  return `jira config: host=${host} project=${config.projectKey} token=${hasToken ? 'present' : 'MISSING'}`
}
