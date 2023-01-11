/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Strong} Strong
 * @typedef {import('../types.js').State} State
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
  const result = {
    type: 'strong',
    // @ts-expect-error: assume valid children.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
