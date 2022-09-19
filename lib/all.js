/**
 * @typedef {import('./types.js').H} H
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').MdastNode} MdastNode
 */

import {one} from './one.js'

/**
 * @param {H} h
 * @param {Node} parent
 * @returns {Array<MdastNode>}
 */
export function all(h, parent) {
  /** @type {Array<Node>} */
  // @ts-expect-error Assume `parent` is a parent.
  const nodes = parent.children || []
  /** @type {Array<MdastNode>} */
  const values = []
  let index = -1

  while (++index < nodes.length) {
    // @ts-expect-error assume `parent` is a parent.
    const result = one(h, nodes[index], parent)

    if (Array.isArray(result)) {
      values.push(...result)
    } else if (result) {
      values.push(result)
    }
  }

  let start = 0
  let end = values.length

  while (start < end && values[start].type === 'break') {
    start++
  }

  while (end > start && values[end - 1].type === 'break') {
    end--
  }

  return start === 0 && end === values.length
    ? values
    : values.slice(start, end)
}
