/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} Content
 * @typedef {import('../types.js').ElementChild} ElementChild
 */

import {convertElement} from 'hast-util-is-element'
import {wrapChildren} from '../util/wrap-children.js'

const p = convertElement('p')
const input = convertElement('input')

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function li(h, node) {
  const head = node.children[0]
  /** @type {boolean | null} */
  let checked = null
  /** @type {ElementChild} */
  let checkbox
  /** @type {Element|undefined} */
  let clone

  // Check if this node starts with a checkbox.
  if (p(head)) {
    checkbox = head.children[0]

    if (
      input(checkbox) &&
      checkbox.properties &&
      (checkbox.properties.type === 'checkbox' ||
        checkbox.properties.type === 'radio')
    ) {
      checked = Boolean(checkbox.properties.checked)
      clone = {
        ...node,
        children: [
          {...head, children: head.children.slice(1)},
          ...node.children.slice(1)
        ]
      }
    }
  }

  const content = wrapChildren(h, clone || node)

  return h(node, 'listItem', {spread: content.length > 1, checked}, content)
}
