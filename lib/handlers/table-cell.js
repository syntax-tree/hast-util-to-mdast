/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').TableCell} TableCell
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {TableCell}
 *   mdast node.
 */
export function tableCell(state, node) {
  /** @type {TableCell} */
  // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
  const result = {type: 'tableCell', children: state.all(node)}
  state.patch(node, result)

  if (node.properties) {
    const rowSpan = node.properties.rowSpan
    const colSpan = node.properties.colSpan

    if (rowSpan || colSpan) {
      const data = result.data || (result.data = {})
      if (rowSpan) data.hastUtilToMdastTemporaryRowSpan = rowSpan
      if (colSpan) data.hastUtilToMdastTemporaryColSpan = colSpan
    }
  }

  return result
}
