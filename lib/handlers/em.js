/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Emphasis}
 *   mdast node.
 */
export function em(h, node) {
  /** @type {Emphasis} */
  const result = {
    type: 'emphasis',
    // @ts-expect-error: assume valid children.
    children: all(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
