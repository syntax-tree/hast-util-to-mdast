/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Blockquote} Blockquote
 * @typedef {import('../types.js').H} H
 */

import {wrapChildren} from '../util/wrap-children.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Blockquote}
 *   mdast node.
 */
export function blockquote(h, node) {
  /** @type {Blockquote} */
  const result = {
    type: 'blockquote',
    children: wrapChildren(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
