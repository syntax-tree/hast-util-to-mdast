/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {wrapChildren} from '../util/wrap-children.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function blockquote(h, node) {
  return h(node, 'blockquote', wrapChildren(h, node))
}
