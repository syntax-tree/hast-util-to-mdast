/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Break | Text}
 *   mdast node.
 */
export function br(state, node) {
  /** @type {Break | Text} */
  const result = state.wrapText ? {type: 'break'} : {type: 'text', value: ' '}
  state.patch(node, result)
  return result
}
