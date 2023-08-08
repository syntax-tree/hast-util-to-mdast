/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Text} Text
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
 * @returns {Text}
 *   mdast node.
 */
export function wbr(state, node) {
  /** @type {Text} */
  const result = {type: 'text', value: '\u200B'}
  state.patch(node, result)
  return result
}
