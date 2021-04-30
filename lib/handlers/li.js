/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 * @typedef {import('../types.js').MdastNode} MdastNode
 */

import {convertElement} from 'hast-util-is-element'
import {shallow} from '../util/shallow.js'
import {wrapChildren} from '../util/wrap-children.js'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'p'}>} */
var p = convertElement('p')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'input'}>} */
var input = convertElement('input')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function li(h, node) {
  var head = node.children[0]
  /** @type {boolean} */
  var checked = null
  /** @type {Array.<MdastNode>} */
  var content
  /** @type {ElementChild} */
  var checkbox
  /** @type {Element} */
  var clone

  // Check if this node starts with a checkbox.
  if (p(head)) {
    checkbox = head.children[0]

    if (
      input(checkbox) &&
      (checkbox.properties.type === 'checkbox' ||
        checkbox.properties.type === 'radio')
    ) {
      checked = Boolean(checkbox.properties.checked)
      clone = Object.assign(shallow(node), {
        children: [
          Object.assign(shallow(head), {
            children: head.children.slice(1)
          }),
          ...node.children.slice(1)
        ]
      })
    }
  }

  content = wrapChildren(h, clone || node)

  return h(node, 'listItem', {spread: content.length > 1, checked}, content)
}
