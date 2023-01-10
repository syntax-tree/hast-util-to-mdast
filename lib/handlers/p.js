/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Paragraph | void}
 *   mdast node.
 */
export function p(h, node) {
  const nodes = all(h, node)

  if (nodes.length > 0) {
    /** @type {Paragraph} */
    const result = {
      type: 'paragraph',
      // @ts-expect-error Assume phrasing content.
      children: nodes
    }

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }
}
