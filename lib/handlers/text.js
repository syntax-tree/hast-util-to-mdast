/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Text} Text
 */

import {wrapText} from '../util/wrap-text.js'

/**
 * @type {Handle}
 * @param {Text} node
 */
export function text(h, node) {
  return h(node, 'text', wrapText(h, node.value))
}
