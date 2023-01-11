/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Heading}
 *   mdast node.
 */
export function heading(state, node) {
  /* c8 ignore next */
  const depth = Number(node.tagName.charAt(1)) || 1
  const wrap = state.wrapText

  // To do: next major.
  // To do: `mdast-util-to-markdown` should support breaks currently.
  state.wrapText = false
  const children = all(state, node)
  state.wrapText = wrap

  /** @type {Heading} */
  const result = {
    type: 'heading',
    // @ts-expect-error: fine.
    depth,
    // @ts-expect-error: assume valid children.
    children
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
