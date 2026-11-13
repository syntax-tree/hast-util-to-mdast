/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {ListItem, List} from 'mdast'
 */

import {listItemsSpread} from '../util/list-items-spread.js'

/**
 * Turn a hast `ol` or `ul` (or `dir`) element into an mdast list.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {List}
 *   mdast node.
 */
export function list(state, node) {
  const properties = node.properties || {}
  const ordered = node.tagName === 'ol'
  const children = state.toSpecificContent(state.all(node), create)
  /** @type {number | null} */
  let start = null

  if (ordered) {
    start = Number.parseInt(String(properties.start), 10)
    if (Number.isNaN(start)) start = 1
  }

  /** @type {List} */
  const result = {
    type: 'list',
    ordered,
    start,
    spread: listItemsSpread(children),
    children
  }
  state.patch(node, result)
  return result
}

/**
 * Create an empty list item.
 *
 * @returns {ListItem}
 *   List item.
 */
function create() {
  return {type: 'listItem', spread: false, checked: null, children: []}
}
