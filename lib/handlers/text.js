/**
 * @typedef {import('hast').Text} HastText
 * @typedef {import('mdast').Text} MdastText
 * @typedef {import('../types.js').State} State
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {HastText} node
 *   hast element to transform.
 * @returns {MdastText}
 *   mdast node.
 */
export function text(state, node) {
  /** @type {MdastText} */
  const result = {type: 'text', value: wrapText(state, node.value)}
  state.patch(node, result)
  return result
}
