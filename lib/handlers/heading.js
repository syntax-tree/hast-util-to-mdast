/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Heading} Heading
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
 * @returns {Heading}
 *   mdast node.
 */
export function heading(state, node) {
  const depth = /** @type {Heading['depth']} */ (
    /* c8 ignore next */
    Number(node.tagName.charAt(1)) || 1
  )
  const children = /** @type {Array<PhrasingContent>} */ (state.all(node))

  /** @type {Heading} */
  const result = {type: 'heading', depth, children}
  state.patch(node, result)
  return result
}
