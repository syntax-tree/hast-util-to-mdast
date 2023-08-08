/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Blockquote} Blockquote
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
 * @returns {Blockquote}
 *   mdast node.
 */
export function blockquote(state, node) {
  /** @type {Blockquote} */
  const result = {type: 'blockquote', children: state.toFlow(state.all(node))}
  state.patch(node, result)
  return result
}
