/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Heading} Heading
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Heading}
 *   mdast node.
 */
export function heading(state, node) {
  /* c8 ignore next */
  const depth = Number(node.tagName.charAt(1)) || 1

  /** @type {Heading} */
  const result = {
    type: 'heading',
    // @ts-expect-error: fine.
    depth,
    // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
