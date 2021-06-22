/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

/**
 * @type {Handle}
 * @param {Element} node
 */
export function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseUrl =
      String((node.properties && node.properties.href) || '') || null
    h.baseFound = true
  }
}
