/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Handle} Handle
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 * @typedef {MdastRoot | MdastContent} MdastNode
 *
 * @typedef State
 *   Info passed around about the current state.
 * @property {PatchPosition} patch
 *   Copy a node’s positional info.
 * @property {All} all
 *   Transform the children of a hast parent to mdast.
 * @property {One} one
 *   Transform a hast node to mdast.
 * @property {Resolve} resolve
 *   Resolve a URL relative to a base.
 * @property {Options} options
 *   User configuration.
 * @property {Map<string, Element>} elementById
 *   Elements by their `id`.
 * @property {Record<string, Handle>} handlers
 *   Applied handlers.
 * @property {boolean} baseFound
 *   Whether a `<base>` element was seen.
 * @property {string | undefined} frozenBaseUrl
 *   `href` of `<base>`, if any.
 * @property {boolean} inTable
 *   Whether we’re in a table.
 * @property {number} qNesting
 *   Non-negative finite integer representing how deep we’re in `<q>`s.
 *
 * @callback PatchPosition
 *   Copy a node’s positional info.
 * @param {Node} origin
 *   hast node to copy from.
 * @param {MdastNode} node
 *   mdast node to copy into.
 * @returns {void}
 *   Nothing.
 *
 * @callback All
 *   Transform the children of a hast parent to mdast.
 * @param {Parent} parent
 *   Parent.
 * @returns {Array<MdastContent>}
 *   mdast children.
 *
 * @callback One
 *   Transform a hast node to mdast.
 * @param {Node} node
 *   Expected hast node.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast result.
 *
 * @callback Resolve
 *   Resolve a URL relative to a base.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 */

import {position} from 'unist-util-position'
import {handlers} from './handlers/index.js'

const own = {}.hasOwnProperty

/**
 * Create a state.
 *
 * @param {Options} options
 *   User configuration.
 * @returns {State}
 *   State.
 */
export function createState(options) {
  /** @type {State} */
  const state = {
    patch,
    resolve,
    all,
    one,
    options,
    elementById: new Map(),
    handlers: options.handlers ? {...handlers, ...options.handlers} : handlers,
    baseFound: false,
    inTable: false,
    frozenBaseUrl: undefined,
    qNesting: 0
  }

  return state
}

/**
 * Copy a node’s positional info.
 *
 * @param {Node} origin
 *   hast node to copy from.
 * @param {MdastNode} node
 *   mdast node to copy into.
 * @returns {void}
 *   Nothing.
 */
function patch(origin, node) {
  if (origin.position) node.position = position(origin)
}

/**
 * Transform a hast node to mdast.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Node} node
 *   hast node to transform.
 * @param {Parent | undefined} parent
 *   Parent of `node`.
 * @returns {MdastNode | Array<MdastNode> | void}
 *   mdast result.
 */
function one(node, parent) {
  /** @type {Handle | undefined} */
  let fn

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(this.handlers, node.tagName)) {
      fn = this.handlers[node.tagName]
    }
  } else if (own.call(this.handlers, node.type)) {
    fn = this.handlers[node.type]
  }

  if (typeof fn === 'function') {
    return fn(this, node, parent)
  }

  // Unknown literal.
  if ('value' in node && typeof node.value === 'string') {
    /** @type {MdastContent} */
    const result = {type: 'text', value: node.value}
    this.patch(node, result)
    return result
  }

  // Unknown parent.
  if ('children' in node) {
    return this.all(node)
  }
}

/**
 * Transform the children of a hast parent to mdast.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parent} parent
 *   Parent.
 * @returns {Array<MdastContent>}
 *   mdast children.
 */
function all(parent) {
  const children = parent.children || []
  /** @type {Array<MdastContent>} */
  const results = []
  let index = -1

  while (++index < children.length) {
    const child = children[index]
    const result = this.one(child, parent)

    if (Array.isArray(result)) {
      // @ts-expect-error: assume no `root`.
      results.push(...result)
    } else if (result) {
      // @ts-expect-error: assume no `root`.
      results.push(result)
    }
  }

  let start = 0
  let end = results.length

  while (start < end && results[start].type === 'break') {
    start++
  }

  while (end > start && results[end - 1].type === 'break') {
    end--
  }

  return start === 0 && end === results.length
    ? results
    : results.slice(start, end)
}

/**
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 */
export function resolve(url) {
  const base = this.frozenBaseUrl

  if (url === null || url === undefined) {
    return ''
  }

  if (base) {
    return String(new URL(url, base))
  }

  return url
}
