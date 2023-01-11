/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Delete}
 *   mdast node.
 */
export function del(state, node) {
  /** @type {Delete} */
  const result = {
    type: 'delete',
    // @ts-expect-error: assume valid children.
    children: all(state, node)
  }
  state.patch(node, result)
  return result
}
