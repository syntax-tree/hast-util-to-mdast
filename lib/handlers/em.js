/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Emphasis}
 *   mdast node.
 */
export function em(state, node) {
  /** @type {Emphasis} */
  const result = {
    type: 'emphasis',
    // @ts-expect-error: assume valid children.
    children: all(state, node)
  }
  state.patch(node, result)
  return result
}
