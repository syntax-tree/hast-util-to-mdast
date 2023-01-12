/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ListItem} ListItem
 * @typedef {import('../state.js').State} State
 */

import {phrasing} from 'hast-util-phrasing'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {ListItem}
 *   mdast node.
 */
export function li(state, node) {
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

  if (!clone) clone = node

  const spread = spreadout(clone)
  const children = state.toFlow(state.all(clone))

  /** @type {ListItem} */
  const result = {type: 'listItem', spread, checked, children}
  state.patch(clone, result)
  return result
}

/**
 * Check if an element should spread out.
 *
 * The reason to spread out a markdown list item is primarily whether writing
 * the equivalent in markdown, would yield a spread out item.
 *
 * A spread out item results in `<p>` and `</p>` tags.
 * Otherwise, the phrasing would be output directly.
 * We can check for that: if there’s a `<p>` element, spread it out.
 *
 * But what if there are no paragraphs?
 * In that case, we can also assume that if two “block” things were written in
 * an item, that it is spread out, because blocks are typically joined by blank
 * lines, which also means a spread item.
 *
 * Lastly, because in HTML things can be wrapped in a `<div>` or similar, we
 * delve into non-phrasing elements here to figure out if they themselves
 * contain paragraphs or 2 or more flow non-phrasing elements.
 *
 * @param {Element} node
 * @returns {boolean}
 */
function spreadout(node) {
  let index = -1
  let seenFlow = false

  while (++index < node.children.length) {
    const child = node.children[index]

    if (child.type === 'element') {
      if (phrasing(child)) continue

      if (child.tagName === 'p' || seenFlow || spreadout(child)) {
        return true
      }

      seenFlow = true
    }
  }

  return false
}
