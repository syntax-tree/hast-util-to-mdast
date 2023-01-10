/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {void}
 *   Nothing.
 */
export function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseUrl =
      String((node.properties && node.properties.href) || '') || undefined
    h.baseFound = true
  }
}
