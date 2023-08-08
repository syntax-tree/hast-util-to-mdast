/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').InlineCode} InlineCode
 *
 * @typedef {import('../state.js').State} State
 */

import {toText} from 'hast-util-to-text'

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {InlineCode}
 *   mdast node.
 */
export function inlineCode(state, node) {
  /** @type {InlineCode} */
  const result = {type: 'inlineCode', value: toText(node)}
  state.patch(node, result)
  return result
}
