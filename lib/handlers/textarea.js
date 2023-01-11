/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').State} State
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text}
 *   mdast node.
 */
export function textarea(state, node) {
  /** @type {Text} */
  const result = {type: 'text', value: wrapText(state, toText(node))}
  state.patch(node, result)
  return result
}
