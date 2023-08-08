/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').RowContent} RowContent
 * @typedef {import('mdast').TableRow} TableRow
 *
 * @typedef {import('../state.js').State} State
 */

// Fix to let VS Code see references to the above types.
''

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {TableRow}
 *   mdast node.
 */
export function tableRow(state, node) {
  const children = state.toSpecificContent(state.all(node), create)

  /** @type {TableRow} */
  const result = {type: 'tableRow', children}
  state.patch(node, result)
  return result
}

/**
 * @returns {RowContent}
 */
function create() {
  return {type: 'tableCell', children: []}
}
