/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Paragraph} Paragraph
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 *
 * @typedef {import('../state.js').State} State
 */

// Fix to let VS Code see references to the above types.
''

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Paragraph | undefined}
 *   mdast node.
 */
export function p(state, node) {
  // Allow potentially “invalid” nodes, they might be unknown.
  // We also support straddling later.
  const children = /** @type {Array<PhrasingContent>} */ (state.all(node))

  if (children.length > 0) {
    /** @type {Paragraph} */
    const result = {type: 'paragraph', children}
    state.patch(node, result)
    return result
  }
}
