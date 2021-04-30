/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Comment} Comment
 */
import {wrapText} from '../util/wrap-text.js'

/**
 * @type {Handle}
 * @param {Comment} node
 */
export function comment(h, node) {
  return h(node, 'html', '<!--' + wrapText(h, node.value) + '-->')
}
