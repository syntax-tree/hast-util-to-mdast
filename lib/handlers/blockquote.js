/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../types.js').State} State
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
  const result = {
    type: 'blockquote',
    children: wrapChildren(state, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
