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
export function heading(h, node) {
  // `else` shouldn’t happen, of course…
  /* c8 ignore next */
  const depth = Number(node.tagName.charAt(1)) || 1
  const wrap = h.wrapText

  h.wrapText = false
  const result = h(node, 'heading', {depth}, all(h, node))
  h.wrapText = wrap

  return result
}
