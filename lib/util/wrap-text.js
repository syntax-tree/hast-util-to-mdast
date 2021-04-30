/**
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 * @param {string} value
 * @returns {string}
 */
export function wrapText(h, value) {
  return h.wrapText ? value : value.replace(/\r?\n|\r/g, ' ')
}
