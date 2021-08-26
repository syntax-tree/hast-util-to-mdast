/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} MdastNode
 */

import {all} from '../all.js'

/**
 * @type {Handle}
 * @param {Element} node
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
