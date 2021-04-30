/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

/**
 * @type {Handle}
 * @param {Element} node
 */
export function hr(h, node) {
  return h(node, 'thematicBreak')
}
