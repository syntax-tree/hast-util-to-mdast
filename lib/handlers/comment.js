/**
 * @typedef {import('hast').Comment} Comment
 *
 * @typedef {import('mdast').Html} Html
 *
 * @typedef {import('../state.js').State} State
 */

// Fix to let VS Code see references to the above types.
''

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Comment>} node
 *   hast element to transform.
 * @returns {Html}
 *   mdast node.
 */
export function comment(state, node) {
  /** @type {Html} */
  const result = {
    type: 'html',
    value: '<!--' + node.value + '-->'
  }
  state.patch(node, result)
  return result
}
