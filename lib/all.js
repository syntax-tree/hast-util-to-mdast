/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').State} State
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 */

import {one} from './one.js'

/**
 * @param {State} state
 *   State.
 * @param {Parent} parent
 *   Parent to transform.
 * @returns {Array<MdastContent>}
 *   mdast nodes.
 */
export function all(state, parent) {
  const children = parent.children || []
  /** @type {Array<MdastContent>} */
  const results = []
  let index = -1

  while (++index < children.length) {
    const child = children[index]
    const result = one(state, child, parent)

    if (Array.isArray(result)) {
      // @ts-expect-error: assume no `root`.
      results.push(...result)
    } else if (result) {
      // @ts-expect-error: assume no `root`.
      results.push(result)
    }
  }

  let start = 0
  let end = results.length

  while (start < end && results[start].type === 'break') {
    start++
  }

  while (end > start && results[end - 1].type === 'break') {
    end--
  }

  return start === 0 && end === results.length
    ? results
    : results.slice(start, end)
}
