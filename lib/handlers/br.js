/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

/**
 * @type {Handle}
 * @param {Element} node
 */
export function br(h, node) {
  return h.wrapText ? h(node, 'break') : h(node, 'text', ' ')
}
