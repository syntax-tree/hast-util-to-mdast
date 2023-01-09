/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Comment} Comment
 * @typedef {import('../types.js').MdastNode} Content
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Comment} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function comment(h, node) {
  return h(node, 'html', '<!--' + wrapText(h, node.value) + '-->')
}
