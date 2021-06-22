/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {all} from '../all.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function p(h, node) {
  const nodes = all(h, node)

  if (nodes.length > 0) {
    return h(node, 'paragraph', nodes)
  }
}
