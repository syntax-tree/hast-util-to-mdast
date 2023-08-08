/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Break} Break
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
 * @returns {Break}
 *   mdast node.
 */
export function br(state, node) {
  /** @type {Break} */
  const result = {type: 'break'}
  state.patch(node, result)
  return result
}
