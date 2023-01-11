/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').TableRow} TableRow
 * @typedef {import('../types.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {TableRow}
 *   mdast node.
 */
export function tableRow(state, node) {
  /** @type {TableRow} */
  const result = {
    type: 'tableRow',
    // @ts-expect-error: assume valid children.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
