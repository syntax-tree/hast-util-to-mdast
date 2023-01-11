/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {ThematicBreak}
 *   mdast node.
 */
export function hr(state, node) {
  /** @type {ThematicBreak} */
  const result = {type: 'thematicBreak'}
  state.patch(node, result)
  return result
}
