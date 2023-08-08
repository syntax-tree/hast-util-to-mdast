/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').List} List
 * @typedef {import('mdast').ListContent} ListContent
 * @typedef {import('mdast').ListItem} ListItem
 *
 * @typedef {import('../state.js').State} State
 */

import {listItemsSpread} from '../util/list-items-spread.js'

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {List}
 *   mdast node.
 */
export function list(state, node) {
  const ordered = node.tagName === 'ol'
  const children = state.toSpecificContent(state.all(node), create)
  /** @type {number | null} */
  let start = null

  if (ordered) {
    start =
      node.properties && node.properties.start
        ? Number.parseInt(String(node.properties.start), 10)
        : 1
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
 * @returns {ListItem}
 */
function create() {
  return {type: 'listItem', spread: false, checked: null, children: []}
}
