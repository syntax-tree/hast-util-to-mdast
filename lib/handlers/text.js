/**
 * @typedef {import('hast').Text} HastText
 * @typedef {import('mdast').Text} MdastText
 * @typedef {import('../types.js').H} H
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {HastText} node
 *   hast element to transform.
 * @returns {MdastText}
 *   mdast node.
 */
export function text(h, node) {
  /** @type {MdastText} */
  const result = {type: 'text', value: wrapText(h, node.value)}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
