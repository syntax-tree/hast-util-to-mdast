/**
 * @typedef {import('mdast').InlineCode} InlineCode
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').H} H
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {InlineCode}
 *   mdast node.
 */
export function inlineCode(h, node) {
  /** @type {InlineCode} */
  const result = {type: 'inlineCode', value: wrapText(h, toText(node))}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
