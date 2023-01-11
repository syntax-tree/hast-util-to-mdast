/**
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../types.js').State} State
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {Comment} node
 *   hast element to transform.
 * @returns {HTML}
 *   mdast node.
 */
export function comment(state, node) {
  /** @type {HTML} */
  const result = {
    type: 'html',
    value: '<!--' + wrapText(state, node.value) + '-->'
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
