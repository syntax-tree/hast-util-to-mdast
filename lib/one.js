/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').H} H
 * @typedef {import('./types.js').Handle} Handle
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 * @typedef {MdastRoot | MdastContent} MdastNode
 */

import {all} from './all.js'
import {wrapText} from './util/wrap-text.js'

export const own = {}.hasOwnProperty

/**
 * @param {H} h
 *   Context.
 * @param {Node} node
 *   hast node to transform.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast results.
 */
export function one(h, node, parent) {
  /** @type {Handle | undefined} */
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
 * @param {H} h
 *   Context.
 * @param {Node} node
 *   hast element to transform.
 * @returns {MdastContent | Array<MdastContent> | void}
 *   mdast results.
 */
function unknown(h, node) {
  if ('value' in node && typeof node.value === 'string') {
    /** @type {MdastContent} */
    const result = {type: 'text', value: wrapText(h, node.value)}

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }

  if ('children' in node) {
    return all(h, node)
  }
}
