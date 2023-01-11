/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').State} State
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {Extract<Node, import('unist').Parent>} Parent
 * @typedef {MdastRoot | MdastContent} MdastNode
 */

import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import {position} from 'unist-util-position'
import {visit} from 'unist-util-visit'
import {handlers} from './handlers/index.js'
import {one} from './one.js'
import {all} from './all.js'

export {one} from './one.js'

/**
 * Transform hast to mdast.
 *
 * @param {Node} tree
 *   hast tree to transform.
 * @param {Options | null | undefined} [options]
 *   Configuration (optional).
 * @returns {MdastNode}
 *   mdast tree.
 */
export function toMdast(tree, options) {
  const options_ = options || {}
  /** @type {Record<string, Element>} */
  const byId = Object.create(null)
  /** @type {State} */
  const state = {
    patch,
    all: allBound,
    options: options_,
    nodeById: byId,
    handlers: options_.handlers
      ? {...handlers, ...options_.handlers}
      : handlers,
    baseFound: false,
    inTable: false,
    frozenBaseUrl: undefined,
    qNesting: 0
  }
  /** @type {MdastNode | MdastRoot} */
  let mdast

  visit(tree, 'element', (node) => {
    const id =
      node.properties &&
      'id' in node.properties &&
      String(node.properties.id).toUpperCase()

    if (id && !(id in byId)) {
      byId[id] = node
    }
  })

  // To do: clone the tree.
  // @ts-expect-error: does return a transformer, that does accept any node.
  rehypeMinifyWhitespace({newlines: options_.newlines === true})(tree)

  const result = one(state, tree, undefined)

  if (!result) {
    mdast = {type: 'root', children: []}
  } else if (Array.isArray(result)) {
    // @ts-expect-error: assume no `root` in `children`.
    mdast = {type: 'root', children: result}
  } else {
    mdast = result
  }

  visit(mdast, 'text', ontext)

  return mdast

  /**
   * Collapse text nodes, and fix whitespace.
   * Most of this is taken care of by `rehype-minify-whitespace`, but
   * we’re generating some whitespace too, and some nodes are in the end
   * ignored.
   * So clean up.
   *
   * @type {import('unist-util-visit/complex-types.js').BuildVisitor<MdastRoot, 'text'>}
   */
  function ontext(node, index, parent) {
    /* c8 ignore next 3 */
    if (index === null || !parent) {
      return
    }

    const previous = parent.children[index - 1]

    if (previous && previous.type === node.type) {
      previous.value += node.value
      parent.children.splice(index, 1)

      if (previous.position && node.position) {
        previous.position.end = node.position.end
      }

      // Iterate over the previous node again, to handle its total value.
      return index - 1
    }

    node.value = node.value.replace(/[\t ]*(\r?\n|\r)[\t ]*/, '$1')

    // We don’t care about other phrasing nodes in between (e.g., `[ asd ]()`),
    // as there the whitespace matters.
    if (
      parent &&
      (parent.type === 'heading' ||
        parent.type === 'paragraph' ||
        parent.type === 'root')
    ) {
      if (!index) {
        node.value = node.value.replace(/^[\t ]+/, '')
      }

      if (index === parent.children.length - 1) {
        node.value = node.value.replace(/[\t ]+$/, '')
      }
    }

    if (!node.value) {
      parent.children.splice(index, 1)
      return index
    }
  }
}

export {handlers as defaultHandlers} from './handlers/index.js'

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
 * Transform the children of a hast parent to mdast.
 *
 * @this {State}
 *   Info passed around about the current state.
 * @param {Parent} parent
 *   Parent.
 * @returns {Array<MdastContent>}
 *   mdast children.
 */
function allBound(parent) {
  return all(this, parent)
}
