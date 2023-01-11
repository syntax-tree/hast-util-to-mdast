/**
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').State} State
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {InlineCode}
 *   mdast node.
 */
export function inlineCode(state, node) {
  /** @type {InlineCode} */
  const result = {type: 'inlineCode', value: wrapText(state, toText(node))}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
