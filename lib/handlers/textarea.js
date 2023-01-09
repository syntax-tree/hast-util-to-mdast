/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').MdastNode} Content
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function textarea(h, node) {
  return h(node, 'text', wrapText(h, toText(node)))
}
