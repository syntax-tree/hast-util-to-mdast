/**
 * @typedef {import('../types.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {string} value
 *   Text.
 * @returns {string}
 *   Wrapped text.
 */
export function wrapText(state, value) {
  return state.wrapText ? value : value.replace(/\r?\n|\r/g, ' ')
}
