/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {void}
 *   Nothing.
 */
export function base(state, node) {
  if (!state.baseFound) {
    state.frozenBaseUrl =
      String((node.properties && node.properties.href) || '') || undefined
    state.baseFound = true
  }
}
