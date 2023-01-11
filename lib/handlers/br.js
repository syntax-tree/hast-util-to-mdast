/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Break} Break
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Break}
 *   mdast node.
 */
export function br(state, node) {
  /** @type {Break} */
  const result = {type: 'break'}
  state.patch(node, result)
  return result
}
