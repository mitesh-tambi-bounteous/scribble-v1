// jira.mjs -- thin Jira Cloud REST v3 client. All network I/O for the tool
// lives here so the dry-run and preflight paths can avoid importing this
// module entirely and stay incapable of network I/O.

const MAX_SEARCH_PAGES = 50
const SEARCH_PAGE_SIZE = 100

function basicAuth(email, token) {
  return Buffer.from(`${email}:${token}`).toString('base64')
}

async function readErrorSnippet(res) {
  let body = ''
  try {
    body = await res.text()
  } catch {
    body = '(no body)'
  }
  return body.slice(0, 500)
}

export function makeJiraClient({ config, fetchImpl = globalThis.fetch }) {
  if (!config || typeof config !== 'object') {
    throw new Error('makeJiraClient: config is required')
  }
  if (typeof fetchImpl !== 'function') {
    throw new TypeError('makeJiraClient: fetchImpl must be a function')
  }
  const auth = basicAuth(config.email, config.token)
  const baseUrl = config.baseUrl.replace(/\/+$/, '')

  async function request(method, path, { body, headers = {}, isForm = false } = {}) {
    const res = await fetchImpl(`${baseUrl}${path}`, {
      method,
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        ...(isForm ? {} : { 'Content-Type': 'application/json' }),
        ...headers,
      },
      body: isForm ? body : body !== undefined ? JSON.stringify(body) : undefined,
    })
    if (!res.ok) {
      const snippet = await readErrorSnippet(res)
      throw new Error(`Jira ${method} ${path} failed: status=${res.status} body=${snippet}`)
    }
    if (res.status === 204) return null
    return res.json()
  }

  return {
    async myself() {
      return request('GET', '/rest/api/3/myself')
    },

    async projectMeta(projectKey) {
      if (typeof projectKey !== 'string' || projectKey === '') {
        throw new TypeError('projectMeta: projectKey is required')
      }
      return request('GET', `/rest/api/3/project/${encodeURIComponent(projectKey)}`)
    },

    async searchSummaries(projectKey) {
      if (typeof projectKey !== 'string' || projectKey === '') {
        throw new TypeError('searchSummaries: projectKey is required')
      }
      const summaries = []
      let nextPageToken
      let page = 0
      while (page < MAX_SEARCH_PAGES) {
        page += 1
        const result = await request('POST', '/rest/api/3/search/jql', {
          body: {
            jql: `project = ${projectKey}`,
            fields: ['summary'],
            maxResults: SEARCH_PAGE_SIZE,
            ...(nextPageToken ? { nextPageToken } : {}),
          },
        })
        const issues = Array.isArray(result?.issues) ? result.issues : []
        for (const issue of issues) {
          const summary = issue?.fields?.summary
          if (typeof summary === 'string') summaries.push(summary.toLowerCase())
        }
        nextPageToken = result?.nextPageToken ?? null
        if (!nextPageToken || issues.length === 0) break
      }
      return summaries
    },

    async createIssue(fields) {
      if (!fields || typeof fields !== 'object') {
        throw new TypeError('createIssue: fields is required')
      }
      const result = await request('POST', '/rest/api/3/issue', { body: { fields } })
      if (!result || typeof result.key !== 'string') {
        throw new Error('createIssue: Jira response missing issue key')
      }
      return result.key
    },

    async linkIssues({ inwardKey, outwardKey, type = 'Blocks' }) {
      if (!inwardKey || !outwardKey) {
        throw new TypeError('linkIssues: inwardKey and outwardKey are required')
      }
      await request('POST', '/rest/api/3/issueLink', {
        body: {
          type: { name: type },
          inwardIssue: { key: inwardKey },
          outwardIssue: { key: outwardKey },
        },
      })
      return true
    },

    async attach(issueKey, filePath) {
      if (typeof issueKey !== 'string' || issueKey === '') {
        throw new TypeError('attach: issueKey is required')
      }
      const { readFileSync } = await import('node:fs')
      const { basename } = await import('node:path')
      const data = readFileSync(filePath)
      const form = new FormData()
      form.append('file', new Blob([data]), basename(filePath))
      return request('POST', `/rest/api/3/issue/${encodeURIComponent(issueKey)}/attachments`, {
        body: form,
        headers: { 'X-Atlassian-Token': 'no-check' },
        isForm: true,
      })
    },
  }
}
