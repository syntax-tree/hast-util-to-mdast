/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} Content
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function tableRow(h, node) {
  return h(node, 'tableRow', all(h, node))
}
