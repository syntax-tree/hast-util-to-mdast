/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Emphasis} Emphasis
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Emphasis}
 *   mdast node.
 */
export function em(state, node) {
  /** @type {Emphasis} */
  // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
  const result = {type: 'emphasis', children: state.all(node)}
  state.patch(node, result)
  return result
}
