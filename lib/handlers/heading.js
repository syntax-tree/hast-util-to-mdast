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
