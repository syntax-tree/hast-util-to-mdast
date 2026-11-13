/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {PhrasingContent, TableCell} from 'mdast'
 */

/**
 * Turn a hast `td` or `th` element into an mdast table cell.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {TableCell}
 *   mdast node.
 */
export function tableCell(state, node) {
  // Allow potentially “invalid” nodes, they might be unknown.
  // We also support straddling later.
  const children = /** @type {Array<PhrasingContent>} */ (state.all(node))

  /** @type {TableCell} */
  const result = {type: 'tableCell', children}
  state.patch(node, result)

  if (node.properties) {
    const {rowSpan, colSpan} = node.properties

    if (rowSpan || colSpan) {
      const data = /** @type {Record<string, unknown>} */ (
        result.data || (result.data = {})
      )
      if (rowSpan) data.hastUtilToMdastTemporaryRowSpan = rowSpan
      if (colSpan) data.hastUtilToMdastTemporaryColSpan = colSpan
    }
  }

  return result
}
