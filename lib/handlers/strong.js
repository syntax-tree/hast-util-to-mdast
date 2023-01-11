/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Strong}
 *   mdast node.
 */
export function strong(state, node) {
  /** @type {Strong} */
  // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
  const result = {type: 'strong', children: state.all(node)}
  state.patch(node, result)
  return result
}
