/**
 * @import {Options} from 'hast-util-to-mdast'
 * @import {Nodes} from 'hast'
 * @import {
 *   Nodes as MdastNodes,
 *   Parents as MdastParents,
 *   RootContent as MdastRootContent,
 * } from 'mdast'
 */

import structuredClone from '@ungap/structured-clone'
import rehypeMinifyWhitespace from 'rehype-minify-whitespace'
import {visit} from 'unist-util-visit'
import {createState} from './state.js'

/** @type {Readonly<Options>} */
const emptyOptions = {}

/**
 * Transform hast to mdast.
 *
 * @param {Readonly<Nodes>} tree
 *   hast tree to transform.
 * @param {Readonly<Options> | null | undefined} [options]
 *   Configuration (optional).
 * @returns {MdastNodes}
 *   mdast tree.
 */
export function toMdast(tree, options) {
  // We have to clone, cause we’ll use `rehype-minify-whitespace` on the tree,
  // which modifies.
  const cleanTree = structuredClone(tree)
  const settings = options || emptyOptions
  const transformWhitespace = rehypeMinifyWhitespace({
    newlines: settings.newlines === true
  })
  const state = createState(settings)
  /** @type {MdastNodes} */
  let mdast

  // @ts-expect-error: fine to pass an arbitrary node.
  transformWhitespace(cleanTree)

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
    // Assume content.
    const children = /** @type {Array<MdastRootContent>} */ (result)
    mdast = {type: 'root', children}
  } else {
    mdast = result
  }

  visit(mdast, {exit})

  return mdast
}

/**
 * Clean up: merge adjacent nodes, drop empty nodes, and fix whitespace.
 *
 * Most whitespace is taken care of by `rehype-minify-whitespace` but
 * we’re generating some whitespace too and some nodes are in the end
 * ignored.
 *
 * Empty inline code or text, and adjacent delete or inline code, cannot be
 * represented in markdown.
 * Emphasis or strong can be represented using different markers but there is
 * no good reason to have it, so we merge them too.
 *
 * @param {MdastNodes} node
 *   mdast node.
 * @param {number | undefined} index
 *   Index of `node` in `parent`.
 * @param {MdastParents | undefined} parent
 *   Parent of `node`.
 * @returns {number | undefined}
 *   Index to continue at.
 */
function exit(node, index, parent) {
  if (
    node.type === 'heading' ||
    node.type === 'paragraph' ||
    node.type === 'root'
  ) {
    const head = node.children[0]

    if (head && head.type === 'text') {
      head.value = head.value.replace(/^[\t ]+/, '')
      if (!head.value) node.children.shift()
    }

    const tail = node.children.at(-1)

    if (tail && tail.type === 'text') {
      tail.value = tail.value.replace(/[\t ]+$/, '')
      if (!tail.value) node.children.pop()
    }
  }

  if (node.type === 'text') {
    node.value = node.value.replace(/[\t ]*(\r?\n|\r)[\t ]*/g, '$1')
  }

  if (parent && index !== undefined) {
    const previous = parent.children[index - 1]

    if (
      node.type === 'delete' ||
      node.type === 'emphasis' ||
      node.type === 'strong'
    ) {
      if (node.children.length === 0) {
        parent.children.splice(index, 1)
        return index
      }

      if (previous && previous.type === node.type) {
        previous.children.push(...node.children)
        if (previous.position && node.position) {
          previous.position.end = node.position.end
        }

        parent.children.splice(index, 1)
        return index - 1
      }
    }

    if (node.type === 'inlineCode' || node.type === 'text') {
      if (node.value === '') {
        parent.children.splice(index, 1)
        return index
      }

      if (previous && previous.type === node.type) {
        previous.value += node.value
        if (previous.position && node.position)
          previous.position.end = node.position.end

        parent.children.splice(index, 1)
        return index - 1
      }
    }
  }
}
