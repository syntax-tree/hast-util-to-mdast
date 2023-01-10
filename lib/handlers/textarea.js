/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').H} H
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text}
 *   mdast node.
 */
export function textarea(h, node) {
  /** @type {Text} */
  const result = {type: 'text', value: wrapText(h, toText(node))}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
