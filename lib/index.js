/**
 * @typedef {import('./types.js').Node} Node
 * @typedef {import('./types.js').Element} Element
 * @typedef {import('./types.js').Options} Options
 * @typedef {import('./types.js').Properties} Properties
 * @typedef {import('./types.js').H} H
 * @typedef {import('./types.js').HWithoutProps} HWithoutProps
 * @typedef {import('./types.js').HWithProps} HWithProps
 * @typedef {import('./types.js').MdastNode} MdastNode
 * @typedef {import('./types.js').MdastRoot} MdastRoot
 */

import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import {convert} from 'unist-util-is'
import {visit} from 'unist-util-visit'
import {one} from './one.js'
import {handlers} from './handlers/index.js'
import {own} from './util/own.js'

export {one} from './one.js'
export {all} from './all.js'

const block = convert(['heading', 'paragraph', 'root'])

/**
 * Transform hast to mdast.
 *
 * @param {Node} tree
 *   Tree (hast).
 * @param {Options} [options]
 *   Configuration (optional).
 */
export function toMdast(tree, options = {}) {
  /** @type {Record<string, Element>} */
  const byId = {}
  /** @type {MdastNode|MdastRoot} */
  let mdast

  /**
   * @type {H}
   */
  const h = Object.assign(
    /**
     * @type {HWithProps & HWithoutProps}
     */
    (
      /**
       * @param {Node} node
       * @param {string} type
       * @param {Properties|string|Array<Node>} [props]
       * @param {string|Array<Node>} [children]
       */
      (node, type, props, children) => {
        /** @type {Properties|undefined} */
        let properties

        if (typeof props === 'string' || Array.isArray(props)) {
          children = props
          properties = {}
        } else {
          properties = props
        }

        /** @type {Node} */
        // @ts-expect-error Assume valid `type` and `children`/`value`.
        const result = {type, ...properties}

        if (typeof children === 'string') {
          // @ts-expect-error: Looks like a literal.
          result.value = children
        } else if (children) {
          // @ts-expect-error: Looks like a parent.
          result.children = children
        }

        if (node.position) {
          result.position = node.position
        }

        return result
      }
    ),
    {
      nodeById: byId,
      baseFound: false,
      inTable: false,
      wrapText: true,
      /** @type {string|null} */
      frozenBaseUrl: null,
      qNesting: 0,
      handlers: options.handlers
        ? {...handlers, ...options.handlers}
        : handlers,
      document: options.document,
      checked: options.checked || '[x]',
      unchecked: options.unchecked || '[ ]',
      quotes: options.quotes || ['"']
    }
  )

  visit(tree, 'element', (node) => {
    const id =
      node.properties &&
      'id' in node.properties &&
      String(node.properties.id).toUpperCase()

    if (id && !own.call(byId, id)) {
      byId[id] = node
    }
  })

  // @ts-expect-error: does return a transformer, that does accept any node.
  rehypeMinifyWhitespace({newlines: options.newlines === true})(tree)

  const result = one(h, tree, undefined)

  if (!result) {
    mdast = {type: 'root', children: []}
  } else if (Array.isArray(result)) {
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
   * @type {import('unist-util-visit/complex-types').BuildVisitor<MdastRoot, 'text'>}
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
    if (parent && block(parent)) {
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
