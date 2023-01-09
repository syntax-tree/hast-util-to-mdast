/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Text} Text
 * @typedef {import('../types.js').MdastNode} Content
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Text} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function text(h, node) {
  return h(node, 'text', wrapText(h, node.value))
}
