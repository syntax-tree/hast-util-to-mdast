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
 * @param {Parent?} parent
 * @returns {MdastNode|Array.<MdastNode>|void}
 */
export function one(h, node, parent) {
  /** @type {Handle} */
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

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

/** @type {Handle} */
function unknown(h, node) {
  if (typeof node.value === 'string') {
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
