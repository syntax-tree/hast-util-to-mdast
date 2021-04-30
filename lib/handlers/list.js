/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {convertElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'
import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'ol'}>} */
var ol = convertElement('ol')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function list(h, node) {
  var ordered = ol(node)
  var children = wrapListItems(h, node)
  /** @type {number} */
  var start = null

  if (ordered) {
    start = hasProperty(node, 'start')
      ? Number.parseInt(String(node.properties.start), 10)
      : 1
  }

  return h(
    node,
    'list',
    {ordered, start, spread: listItemsSpread(children)},
    children
  )
}
