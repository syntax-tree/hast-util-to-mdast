import {convertElement} from 'hast-util-is-element'
import {hasProperty} from 'hast-util-has-property'
import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

var ol = convertElement('ol')

export function list(h, node) {
  var ordered = ol(node)
  var children = wrapListItems(h, node)
  var start = null

  if (ordered) {
    start = hasProperty(node, 'start') ? node.properties.start : 1
  }

  return h(
    node,
    'list',
    {ordered, start, spread: listItemsSpread(children)},
    children
  )
}
