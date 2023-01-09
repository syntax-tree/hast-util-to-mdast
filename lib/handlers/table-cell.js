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
export function tableCell(h, node) {
  const wrap = h.wrapText

  h.wrapText = false

  const result = h(node, 'tableCell', all(h, node))

  if (node.properties && (node.properties.rowSpan || node.properties.colSpan)) {
    const data = result.data || (result.data = {})
    if (node.properties.rowSpan) data.rowSpan = node.properties.rowSpan
    if (node.properties.colSpan) data.colSpan = node.properties.colSpan
  }

  h.wrapText = wrap

  return result
}
