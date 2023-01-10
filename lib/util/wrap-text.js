/**
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {string} value
 *   Text.
 * @returns {string}
 *   Wrapped text.
 */
export function wrapText(h, value) {
  return h.wrapText ? value : value.replace(/\r?\n|\r/g, ' ')
}
