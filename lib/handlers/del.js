/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {all} from '../all.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function del(h, node) {
  return h(node, 'delete', all(h, node))
}
