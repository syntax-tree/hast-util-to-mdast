/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 * @typedef {import('../types.js').MdastNode} MdastNode
 * @typedef {import('../types.js').MdastListContent} MdastListContent
 * @typedef {import('../types.js').MdastBlockContent} MdastBlockContent
 * @typedef {import('../types.js').MdastDefinitionContent} MdastDefinitionContent
 *
 * @typedef Group
 * @property {Array<Element>} titles
 * @property {Array<ElementChild>} definitions
 */

import {convertElement} from 'hast-util-is-element'
import {listItemsSpread} from '../util/list-items-spread.js'
import {wrapListItems} from '../util/wrap-list-items.js'

const div = convertElement('div')
const dt = convertElement('dt')
const dd = convertElement('dd')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function dl(h, node) {
  const children = node.children
  let index = -1
  /** @type {Array<ElementChild>} */
  let clean = []
  /** @type {Array<Group>} */
  const groups = []
  /** @type {Group} */
  let group = {titles: [], definitions: []}
  /** @type {ElementChild} */
  let child
  /** @type {Array<MdastBlockContent|MdastDefinitionContent>} */
  let result

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
  /** @type {Array<MdastListContent>} */
  const content = []

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
 * @param {Array<ElementChild>} children
 * @returns {Array<MdastBlockContent|MdastDefinitionContent>}
 */
function handle(h, children) {
  const nodes = wrapListItems(h, {type: 'element', tagName: 'x', children})

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
