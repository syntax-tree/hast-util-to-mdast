/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Heading}
 *   mdast node.
 */
export function heading(h, node) {
  /* c8 ignore next */
  const depth = Number(node.tagName.charAt(1)) || 1
  const wrap = h.wrapText

  // To do: next major.
  // To do: `mdast-util-to-markdown` should support breaks currently.
  h.wrapText = false
  const children = all(h, node)
  h.wrapText = wrap

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
