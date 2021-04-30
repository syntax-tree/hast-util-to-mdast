/**
 * @typedef {import('../types.js').UnistNode} UnistNode
 */

/**
 * Shallow copy of a node, excluding its children.
 *
 * @template {UnistNode} T
 * @param {T} node
 * @returns {T & {children: undefined}}
 */
export function shallow(node) {
  return Object.assign({}, node, {children: undefined})
}
