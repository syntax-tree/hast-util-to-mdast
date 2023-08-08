/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
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
 * @returns {ThematicBreak}
 *   mdast node.
 */
export function hr(state, node) {
  /** @type {ThematicBreak} */
  const result = {type: 'thematicBreak'}
  state.patch(node, result)
  return result
}
