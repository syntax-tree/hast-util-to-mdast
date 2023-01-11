/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Delete}
 *   mdast node.
 */
export function del(state, node) {
  /** @type {Delete} */
  const result = {
    type: 'delete',
    // @ts-expect-error: assume valid children.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
