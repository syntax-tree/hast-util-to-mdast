/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').ListItem} ListItem
 *
 * @typedef {import('../state.js').State} State
 */

import {phrasing} from 'hast-util-phrasing'

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {ListItem}
 *   mdast node.
 */
export function li(state, node) {
  // If the list item starts with a checkbox, remove the checkbox and mark the
  // list item as a GFM task list item.
  const {cleanNode, checkbox} = extractLeadingCheckbox(node)
  const checked = checkbox && Boolean(checkbox.properties.checked)

  const spread = spreadout(cleanNode)
  const children = state.toFlow(state.all(cleanNode))

  /** @type {ListItem} */
  const result = {type: 'listItem', spread, checked, children}
  state.patch(cleanNode, result)
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
 * @param {Readonly<Element>} node
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

/**
 * If the first bit of content in an element is a checkbox, create a copy of
 * the element that does not include the checkbox and return the cleaned up
 * copy alongside the checkbox that was removed. If there was no leading
 * checkbox, this returns the original element unaltered (not a copy).
 *
 * This detects trees like:
 *   `<li><input type="checkbox">Text</li>`
 * And returns a tree like:
 *   `<li>Text</li>`
 *
 * Or with nesting:
 *   `<li><p><input type="checkbox">Text</p></li>`
 * Which returns a tree like:
 *   `<li><p>Text</p></li>`
 *
 * @param {Readonly<Element>} node
 * @returns {{cleanNode: Element, checkbox: Element | null}}
 */
function extractLeadingCheckbox(node) {
  /** @type {Element | null} */
  let checkbox = null
  let cleanNode = node
  let candidate = node.children[0]

  // The checkbox may be nested in another container element, so keep track of
  // what node actually contains the potential checkbox.
  //
  // NOTE: this only handles nesting in `<p>` elements, which is most common.
  // It's possible a leading checkbox might be nested in other types of flow or
  // phrasing elements (and *deeply* nested, which is not possible with `<p>`).
  // Limiting things to `<p>` elements keeps it simpler for now.
  let checkboxParent = node
  if (candidate && candidate.type === 'element' && candidate.tagName === 'p') {
    checkboxParent = candidate
    candidate = candidate.children[0]
  }

  if (
    candidate &&
    candidate.type === 'element' &&
    candidate.tagName === 'input' &&
    candidate.properties &&
    (candidate.properties.type === 'checkbox' ||
      candidate.properties.type === 'radio')
  ) {
    checkbox = candidate

    // The checkbox is a direct child of `node`.
    if (checkboxParent === node) {
      cleanNode = {...node, children: node.children.slice(1)}
    }
    // The checkbox is nested in another child (which is `checkboxParent`).
    else {
      cleanNode = {
        ...node,
        children: [
          {...checkboxParent, children: checkboxParent.children.slice(1)},
          ...node.children.slice(1)
        ]
      }
    }
  }

  return {cleanNode, checkbox}
}
