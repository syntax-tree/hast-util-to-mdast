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
  h.wrapText = wrap

  return result
}
