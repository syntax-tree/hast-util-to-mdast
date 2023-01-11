/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').State} State
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
 * @param {State} state
 *   State.
 * @param {Node} node
 *   hast node to transform.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast results.
 */
export function one(state, node, parent) {
  /** @type {Handle | undefined} */
  let fn

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(state.handlers, node.tagName)) {
      fn = state.handlers[node.tagName]
    }
  } else if (own.call(state.handlers, node.type)) {
    fn = state.handlers[node.type]
  }

  if (typeof fn === 'function') {
    return fn(state, node, parent)
  }

  return unknown(state, node)
}

/**
 * @param {State} state
 *   State.
 * @param {Node} node
 *   hast element to transform.
 * @returns {MdastContent | Array<MdastContent> | void}
 *   mdast results.
 */
function unknown(state, node) {
  if ('value' in node && typeof node.value === 'string') {
    /** @type {MdastContent} */
    const result = {type: 'text', value: wrapText(state, node.value)}
    state.patch(node, result)
    return result
  }

  if ('children' in node) {
    return all(state, node)
  }
}
