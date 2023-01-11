/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../state.js').State} State
 */

import {wrapChildren} from '../util/wrap-children.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Blockquote}
 *   mdast node.
 */
export function blockquote(state, node) {
  /** @type {Blockquote} */
  const result = {type: 'blockquote', children: wrapChildren(state, node)}
  state.patch(node, result)
  return result
}
