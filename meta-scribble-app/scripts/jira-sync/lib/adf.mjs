// adf.mjs -- minimal markdown -> Atlassian Document Format mapping.
//
// Deliberately small: only what the field-mapping table needs to file a
// description. Bold/italic markers pass through as literal text (documented
// limit in README); this is not a full markdown renderer.

const MAX_BLOCKS = 2000

function textNode(text) {
  return { type: 'paragraph', content: text.length ? [{ type: 'text', text }] : [] }
}

export function mdToAdf(markdown) {
  if (typeof markdown !== 'string') {
    throw new TypeError('mdToAdf: markdown must be a string')
  }
  const lines = markdown.split('\n')
  const content = []
  let para = []
  let list = null // { type: 'bulletList'|'taskList', items: [...] }

  function flushPara() {
    if (para.length > 0) {
      content.push(textNode(para.join(' ')))
      para = []
    }
  }
  function flushList() {
    if (list) {
      content.push(list)
      list = null
    }
  }

  let i = 0
  const cap = Math.min(lines.length, 10000)
  while (i < cap) {
    const line = lines[i]
    i += 1
    if (content.length + (list ? 1 : 0) > MAX_BLOCKS) break

    const headingMatch = line.match(/^(#{2,4})\s+(.*)$/)
    const taskMatch = line.match(/^\s*-\s+\[( |x|X)\]\s+(.*)$/)
    const bulletMatch = line.match(/^\s*-\s+(.*)$/)

    if (line.trim() === '') {
      flushPara()
      flushList()
      continue
    }
    if (headingMatch) {
      flushPara()
      flushList()
      const level = headingMatch[1].length
      content.push({
        type: 'heading',
        attrs: { level },
        content: [{ type: 'text', text: headingMatch[2] }],
      })
      continue
    }
    if (taskMatch) {
      flushPara()
      const state = taskMatch[1].toLowerCase() === 'x' ? 'DONE' : 'TODO'
      if (!list || list.type !== 'taskList') {
        flushList()
        list = { type: 'taskList', content: [] }
      }
      list.content.push({
        type: 'taskItem',
        attrs: { state },
        content: [{ type: 'text', text: taskMatch[2] }],
      })
      continue
    }
    if (bulletMatch) {
      flushPara()
      if (!list || list.type !== 'bulletList') {
        flushList()
        list = { type: 'bulletList', content: [] }
      }
      list.content.push({
        type: 'listItem',
        content: [textNode(bulletMatch[1])],
      })
      continue
    }
    flushList()
    para.push(line.trim())
  }
  flushPara()
  flushList()

  const bounded = content.slice(0, MAX_BLOCKS)
  return { type: 'doc', version: 1, content: bounded }
}
