/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function inlineCode(h, node) {
  return h(node, 'inlineCode', wrapText(h, toText(node)))
}
