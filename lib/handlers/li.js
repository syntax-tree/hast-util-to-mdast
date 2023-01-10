/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('../types.js').H} H
 */

import {wrapChildren} from '../util/wrap-children.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {ListItem}
 *   mdast node.
 */
export function li(h, node) {
  const head = node.children[0]
  /** @type {boolean | null} */
  let checked = null
  /** @type {Element | undefined} */
  let clone

  // Check if this node starts with a checkbox.
  if (head && head.type === 'element' && head.tagName === 'p') {
    const checkbox = head.children[0]

    if (
      checkbox &&
      checkbox.type === 'element' &&
      checkbox.tagName === 'input' &&
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

  /** @type {ListItem} */
  const result = {
    type: 'listItem',
    spread: content.length > 1,
    checked,
    children: content
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
