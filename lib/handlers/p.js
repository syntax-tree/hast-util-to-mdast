/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Paragraph | void}
 *   mdast node.
 */
export function p(state, node) {
  const children = state.all(node)

  if (children.length > 0) {
    /** @type {Paragraph} */
    // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
    const result = {type: 'paragraph', children}
    state.patch(node, result)
    return result
  }
}
