/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').List} List
 * @typedef {import('../types.js').H} H
 */

import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {List}
 *   mdast node.
 */
export function list(h, node) {
  const ordered = node.tagName === 'ol'
  const children = wrapListItems(h, node)
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

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
