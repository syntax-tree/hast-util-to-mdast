/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {all} from '../all.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function em(h, node) {
  return h(node, 'emphasis', all(h, node))
}
