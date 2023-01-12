/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('mdast').BlockContent} MdastBlockContent
 * @typedef {import('mdast').DefinitionContent} MdastDefinitionContent
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Handle} Handle
 * @typedef {import('./types.js').NodeHandle} NodeHandle
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 * @typedef {Extract<MdastNode, import('unist').Parent>} MdastParent
 * @typedef {MdastRoot | MdastContent} MdastNode
 * @typedef {MdastBlockContent | MdastDefinitionContent} MdastFlowContent
 *
 * @typedef State
 *   Info passed around about the current state.
 * @property {Patch} patch
 *   Copy a node’s positional info.
 * @property {One} one
 *   Transform a hast node to mdast.
 * @property {All} all
 *   Transform the children of a hast parent to mdast.
 * @property {ToFlow} toFlow
 *   Transform a list of mdast nodes to flow.
 * @property {<ChildType extends MdastNode, ParentType extends MdastParent & {'children': Array<ChildType>}>(nodes: Array<MdastContent>, build: (() => ParentType)) => Array<ParentType>} toSpecificContent
 *   Turn arbitrary content into a list of a particular node type.
 *
 *   This is useful for example for lists, which must have list items as
 *   content.
 *   in this example, when non-items are found, they will be queued, and
 *   inserted into an adjacent item.
 *   When no actual items exist, one will be made with `build`.
 * @property {Resolve} resolve
 *   Resolve a URL relative to a base.
 * @property {Options} options
 *   User configuration.
 * @property {Map<string, Element>} elementById
 *   Elements by their `id`.
 * @property {Record<string, Handle>} handlers
 *   Applied element handlers.
 * @property {Record<string, NodeHandle>} nodeHandlers
 *   Applied node handlers.
 * @property {boolean} baseFound
 *   Whether a `<base>` element was seen.
 * @property {string | undefined} frozenBaseUrl
 *   `href` of `<base>`, if any.
 * @property {boolean} inTable
 *   Whether we’re in a table.
 * @property {number} qNesting
 *   Non-negative finite integer representing how deep we’re in `<q>`s.
 *
 * @callback Patch
 *   Copy a node’s positional info.
 * @param {Node} from
 *   hast node to copy from.
 * @param {MdastNode} to
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
 * @callback ToFlow
 *   Transform a list of mdast nodes to flow.
 * @param {Array<MdastContent>} nodes
 *   mdast nodes.
 * @returns {Array<MdastFlowContent>}
 *   mdast flow children.
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
import {handlers, nodeHandlers} from './handlers/index.js'
import {wrap} from './util/wrap.js'

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
    toFlow,
    toSpecificContent,
    options,
    elementById: new Map(),
    nodeHandlers: {...nodeHandlers, ...options.nodeHandlers},
    handlers: {...handlers, ...options.handlers},
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
  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(this.handlers, node.tagName)) {
      return this.handlers[node.tagName](this, node, parent)
    }
  } else if (own.call(this.nodeHandlers, node.type)) {
    return this.nodeHandlers[node.type](this, node, parent)
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
 * You might want to combine this with `toFlow` or `toSpecificContent`.
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
 * Transform a list of mdast nodes to flow.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Array<MdastContent>} nodes
 *   Parent.
 * @returns {Array<MdastFlowContent>}
 *   mdast flow children.
 */
function toFlow(nodes) {
  return wrap(nodes)
}

/**
 * Turn arbitrary content into a particular node type.
 *
 * This is useful for example for lists, which must have list items as content.
 * in this example, when non-items are found, they will be queued, and
 * inserted into an adjacent item.
 * When no actual items exist, one will be made with `build`.
 *
 * @template {MdastNode} ChildType
 *   Node type of children.
 * @template {MdastParent & {'children': Array<ChildType>}} ParentType
 *   Node type of parent.
 * @param {Array<MdastContent>} nodes
 *   Nodes, which are either `ParentType`, or will be wrapped in one.
 * @param {() => ParentType} build
 *   Build a parent if needed (must have empty `children`).
 * @returns {Array<ParentType>}
 *   List of parents.
 */
function toSpecificContent(nodes, build) {
  const reference = build()
  /** @type {Array<ParentType>} */
  const results = []
  /** @type {Array<ChildType>} */
  let queue = []
  let index = -1

  while (++index < nodes.length) {
    const node = nodes[index]

    if (expectedParent(node)) {
      if (queue.length > 0) {
        node.children.unshift(...queue)
        queue = []
      }

      results.push(node)
    } else {
      // @ts-expect-error: assume `node` can be a child of `ParentType`.
      // If we start checking nodes, we’d run into problems with unknown nodes,
      // which we do want to support.
      queue.push(node)
    }
  }

  if (queue.length > 0) {
    let node = results[results.length - 1]

    if (!node) {
      node = build()
      results.push(node)
    }

    node.children.push(...queue)
    queue = []
  }

  return results

  /**
   * @param {MdastNode} node
   * @returns {node is ParentType}
   */
  function expectedParent(node) {
    return node.type === reference.type
  }
}

/**
 * @this {State}
 *   Info passed around about the current state.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 */
function resolve(url) {
  const base = this.frozenBaseUrl

  if (url === null || url === undefined) {
    return ''
  }

  if (base) {
    return String(new URL(url, base))
  }

  return url
}
