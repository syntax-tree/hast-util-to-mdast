/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 */

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {void}
 *   Nothing
 */
export function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseUrl =
      String((node.properties && node.properties.href) || '') || null
    h.baseFound = true
  }
}
