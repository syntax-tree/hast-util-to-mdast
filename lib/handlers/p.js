/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Paragraph | void}
 *   mdast node.
 */
export function p(state, node) {
  const nodes = all(state, node)

  if (nodes.length > 0) {
    /** @type {Paragraph} */
    const result = {
      type: 'paragraph',
      // @ts-expect-error Assume phrasing content.
      children: nodes
    }
    state.patch(node, result)
    return result
  }
}
