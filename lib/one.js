/**
 * @typedef {import('./types.js').H} H
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Parent} Parent
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').MdastNode} MdastNode
 */

import {all} from './all.js'
import {own} from './util/own.js'
import {wrapText} from './util/wrap-text.js'

/**
 * @param {H} h
 * @param {Node} node
 * @param {Parent|undefined} parent
 * @returns {MdastNode|Array.<MdastNode>|void}
 */
export function one(h, node, parent) {
  /** @type {Handle|undefined} */
  let fn

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(h.handlers, node.tagName)) {
      fn = h.handlers[node.tagName]
    }
  } else if (own.call(h.handlers, node.type)) {
    fn = h.handlers[node.type]
  }

  if (typeof fn === 'function') {
    return fn(h, node, parent)
  }

  return unknown(h, node)
}

/**
 * @type {Handle}
 * @param {Node} node
 */
function unknown(h, node) {
  // @ts-expect-error: Looks like a literal.
  if (typeof node.value === 'string') {
    // @ts-expect-error: Looks like a literal.
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
