/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Node} Node
 * @typedef {import('../types.js').MdastNode} MdastNode
 */

import {all} from '../all.js'
import {wrap} from './wrap.js'

/**
 * @param {H} h
 * @param {Node} node
 * @returns {Array.<MdastNode>}
 */
export function wrapChildren(h, node) {
  return wrap(all(h, node))
}
