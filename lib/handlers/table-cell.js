/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').TableCell} TableCell
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {TableCell}
 *   mdast node.
 */
export function tableCell(state, node) {
  const children = all(state, node)

  /** @type {TableCell} */
  const result = {
    type: 'tableCell',
    // @ts-expect-error: assume valid children.
    children
  }
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
