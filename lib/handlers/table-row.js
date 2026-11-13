/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {RowContent, TableRow} from 'mdast'
 */

/**
 * Turn a hast `tr` element into an mdast table row.
 *
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
 * Create an empty table cell.
 *
 * @returns {RowContent}
 *   Table cell.
 */
function create() {
  return {type: 'tableCell', children: []}
}
