/**
 * @typedef {import('./types.js').H} H
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').MdastNode} MdastNode
 */

import {one} from './one.js'

/**
 * @param {H} h
 * @param {Node} parent
 * @returns {Array.<MdastNode>}
 */
export function all(h, parent) {
  /** @type {Array.<Node>} */
  // @ts-expect-error Assume `parent` is a parent.
  const nodes = parent.children || []
  /** @type {Array.<MdastNode>} */
  const values = []
  let index = -1
  let length = nodes.length
  let child = nodes[index + 1]

  // Trim initial and final `<br>`s.
  // They’re not semantic per HTML, and they can’t be made in markdown things
  // like paragraphs or headings.
  while (child && child.type === 'element' && child.tagName === 'br') {
    index++
    child = nodes[index + 1]
  }

  child = nodes[length - 1]

  while (
    length - 1 > index &&
    child &&
    child.type === 'element' &&
    child.tagName === 'br'
  ) {
    length--
    child = nodes[length - 1]
  }

  while (++index < length) {
    // @ts-expect-error assume `parent` is a parent.
    const result = one(h, nodes[index], parent)

    if (Array.isArray(result)) {
      values.push(...result)
    } else if (result) {
      values.push(result)
    }
  }

  return values
}
