/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').MdastNode} Content
 */

import {convertElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'
import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

const ol = convertElement('ol')

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function list(h, node) {
  const ordered = ol(node)
  const children = wrapListItems(h, node)
  /** @type {number|null} */
  let start = null

  if (ordered) {
    start = hasProperty(node, 'start')
      ? // @ts-expect-error: `props` exist.
        Number.parseInt(String(node.properties.start), 10)
      : 1
  }

  return h(
    node,
    'list',
    {ordered, start, spread: listItemsSpread(children)},
    children
  )
}
