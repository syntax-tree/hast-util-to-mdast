/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').MdastNode} Content
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content | void}
 *   mdast node.
 */
export function p(h, node) {
  const nodes = all(h, node)

  if (nodes.length > 0) {
    return h(node, 'paragraph', nodes)
  }
}
