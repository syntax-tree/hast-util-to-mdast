/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 * @typedef {import('../types.js').MdastNode} MdastNode
 * @typedef {import('../types.js').MdastListContent} MdastListContent
 * @typedef {import('../types.js').MdastBlockContent} MdastBlockContent
 *
 * @typedef Group
 * @property {Array.<Element>} titles
 * @property {Array.<ElementChild>} definitions
 */

import {convertElement} from 'hast-util-is-element'
import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'div'}>} */
var div = convertElement('div')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'dt'}>} */
var dt = convertElement('dt')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'dd'}>} */
var dd = convertElement('dd')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function dl(h, node) {
  var children = node.children
  var index = -1
  /** @type {Array.<ElementChild>} */
  var clean = []
  /** @type {Array.<Group>} */
  var groups = []
  /** @type {Group} */
  var group = {titles: [], definitions: []}
  /** @type {Array.<MdastListContent>} */
  var content
  /** @type {ElementChild} */
  var child
  /** @type {Array.<MdastBlockContent>} */
  var result

  // Unwrap `<div>`s
  while (++index < children.length) {
    child = children[index]
    clean = clean.concat(div(child) ? child.children : child)
  }

  index = -1

  // Group titles and definitions.
  while (++index < clean.length) {
    child = clean[index]

    if (dt(child)) {
      if (dd(clean[index - 1])) {
        groups.push(group)
        group = {titles: [], definitions: []}
      }

      group.titles.push(child)
    } else {
      group.definitions.push(child)
    }
  }

  groups.push(group)

  // Create items.
  index = -1
  content = []

  while (++index < groups.length) {
    result = [
      ...handle(h, groups[index].titles),
      ...handle(h, groups[index].definitions)
    ]

    if (result.length > 0) {
      content.push({
        type: 'listItem',
        spread: result.length > 1,
        checked: null,
        children: result
      })
    }
  }

  // Create a list if there are items.
  if (content.length > 0) {
    return h(
      node,
      'list',
      {ordered: false, start: null, spread: listItemsSpread(content)},
      content
    )
  }
}

/**
 * @param {H} h
 * @param {Array.<ElementChild>} children
 * @returns {Array.<MdastBlockContent>}
 */
function handle(h, children) {
  var nodes = wrapListItems(h, {type: 'element', tagName: 'x', children})

  if (nodes.length === 0) {
    return []
  }

  if (nodes.length === 1) {
    return nodes[0].children
  }

  return [
    {
      type: 'list',
      ordered: false,
      start: null,
      spread: listItemsSpread(nodes),
      children: nodes
    }
  ]
}
