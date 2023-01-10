/**
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../types.js').H} H
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Comment} node
 *   hast element to transform.
 * @returns {HTML}
 *   mdast node.
 */
export function comment(h, node) {
  /** @type {HTML} */
  const result = {type: 'html', value: '<!--' + wrapText(h, node.value) + '-->'}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
