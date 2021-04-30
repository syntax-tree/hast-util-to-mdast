/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

/**
 * @type {Handle}
 * @param {Element} node
 */
export function wbr(h, node) {
  return h(node, 'text', '\u200B')
}
