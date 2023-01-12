/**
 * @typedef {import('hast').Root} Root
 * @typedef {import('hast').Content} Content
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('./types.js').Options} Options
 */

/**
 * @typedef {Root | Content} Node
 * @typedef {MdastRoot | MdastContent} MdastNode
 */

import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import {visit} from 'unist-util-visit'
import {createState} from './state.js'

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
  // We have to clone, cause we’ll use `rehype-minify-whitespace` on the tree,
  // which modifies
  /** @type {Node} */
  const cleanTree = JSON.parse(JSON.stringify(tree))
  const options_ = options || {}
  const state = createState(options_)
  /** @type {MdastNode | MdastRoot} */
  let mdast

  // @ts-expect-error: does return a transformer, that does accept any node.
  rehypeMinifyWhitespace({newlines: options_.newlines === true})(cleanTree)
  visit(cleanTree, function (node) {
    if (node && node.type === 'element' && node.properties) {
      const id = String(node.properties.id || '') || undefined

      if (id && !state.elementById.has(id)) {
        state.elementById.set(id, node)
      }
    }
  })

  const result = state.one(cleanTree, undefined)

  if (!result) {
    mdast = {type: 'root', children: []}
  } else if (Array.isArray(result)) {
    // @ts-expect-error: assume no `root` in `children`.
    mdast = {type: 'root', children: result}
  } else {
    mdast = result
  }

  // Collapse text nodes, and fix whitespace.
  //
  // Most of this is taken care of by `rehype-minify-whitespace`, but
  // we’re generating some whitespace too, and some nodes are in the end
  // ignored.
  // So clean up.
  visit(mdast, function (node, index, parent) {
    if (node.type === 'text' && index !== null && parent) {
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
  })

  return mdast
}
