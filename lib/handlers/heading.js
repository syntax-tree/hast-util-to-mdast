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

  /** @type {Heading} */
  const result = {
    type: 'heading',
    // @ts-expect-error: fine.
    depth,
    // @ts-expect-error: assume valid children.
    children: all(state, node)
  }
  state.patch(node, result)
  return result
}
