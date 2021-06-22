/**
 * @typedef {import('./lib/types.js').Node} Node
 * @typedef {import('./lib/types.js').Element} Element
 * @typedef {import('./lib/types.js').Text} Text
 * @typedef {import('./lib/types.js').Options} Options
 * @typedef {import('./lib/types.js').Context} Context
 * @typedef {import('./lib/types.js').Properties} Properties
 * @typedef {import('./lib/types.js').H} H
 * @typedef {import('./lib/types.js').HWithoutProps} HWithoutProps
 * @typedef {import('./lib/types.js').HWithProps} HWithProps
 * @typedef {import('./lib/types.js').MdastNode} MdastNode
 * @typedef {import('./lib/types.js').MdastRoot} MdastRoot
 */

import {hasProperty} from 'hast-util-has-property'
import minifyWhitespace from 'rehype-minify-whitespace'
import {convert} from 'unist-util-is'
import {visit} from 'unist-util-visit'
import {one} from './lib/one.js'
import {handlers} from './lib/handlers/index.js'
import {own} from './lib/util/own.js'

export {one} from './lib/one.js'
export {all} from './lib/all.js'

const block = convert(['heading', 'paragraph', 'root'])

/**
 * @param {Node} tree
 * @param {Options} [options]
 */
export function toMdast(tree, options = {}) {
  /** @type {Object.<string, Element>} */
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
       * @param {Properties|string|Array.<Node>} [props]
       * @param {string|Array.<Node>} [children]
       */
      (node, type, props, children) => {
        /** @type {Properties} */
        let properties

        if (typeof props === 'string' || Array.isArray(props)) {
          children = props
          properties = {}
        } else {
          properties = props
        }

        /** @type {Node} */
        // @ts-ignore Assume valid `type` and `children`/`value`.
        const result = {type, ...properties}

        if (typeof children === 'string') {
          result.value = children
        } else if (children) {
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

  visit(tree, 'element', onelement)

  minifyWhitespace({newlines: options.newlines === true})(tree)

  const result = one(h, tree, null)

  if (!result) {
    mdast = {type: 'root', children: []}
  } else if (Array.isArray(result)) {
    mdast = {type: 'root', children: result}
  } else {
    mdast = result
  }

  visit(mdast, 'text', ontext)

  return mdast

  /** @type {import('unist-util-visit').Visitor<Element>} */
  function onelement(node) {
    const id =
      hasProperty(node, 'id') && String(node.properties.id).toUpperCase()

    if (id && !own.call(byId, id)) {
      byId[id] = node
    }
  }

  /**
   * Collapse text nodes, and fix whitespace.
   * Most of this is taken care of by `rehype-minify-whitespace`, but
   * we’re generating some whitespace too, and some nodes are in the end
   * ignored.
   * So clean up.
   *
   * @type {import('unist-util-visit').Visitor<Text>}
   */
  function ontext(node, index, parent) {
    const previous = parent.children[index - 1]

    if (previous && node.type === previous.type) {
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
    if (block(parent)) {
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
