/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Strong}
 *   mdast node.
 */
export function strong(h, node) {
  /** @type {Strong} */
  const result = {
    type: 'strong',
    // @ts-expect-error: assume valid children.
    children: all(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
