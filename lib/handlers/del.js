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
    // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
