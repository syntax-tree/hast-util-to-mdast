/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Emphasis} Emphasis
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
 * @returns {Emphasis}
 *   mdast node.
 */
export function em(state, node) {
  // Allow potentially “invalid” nodes, they might be unknown.
  // We also support straddling later.
  const children = /** @type {Array<PhrasingContent>} */ (state.all(node))

  /** @type {Emphasis} */
  const result = {type: 'emphasis', children}
  state.patch(node, result)
  return result
}
