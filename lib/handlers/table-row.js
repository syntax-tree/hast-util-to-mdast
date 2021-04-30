/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {all} from '../all.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function tableRow(h, node) {
  return h(node, 'tableRow', all(h, node))
}
