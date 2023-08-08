/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Text} Text
 *
 * @typedef {import('../state.js').State} State
 */

import {toText} from 'hast-util-to-text'

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Text}
 *   mdast node.
 */
export function textarea(state, node) {
  /** @type {Text} */
  const result = {type: 'text', value: toText(node)}
  state.patch(node, result)
  return result
}
