/**
 * @typedef {import('hast').Comment} Comment
 * @typedef {import('mdast').HTML} HTML
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Comment} node
 *   hast element to transform.
 * @returns {HTML}
 *   mdast node.
 */
export function comment(state, node) {
  /** @type {HTML} */
  const result = {
    type: 'html',
    value: '<!--' + node.value + '-->'
  }
  state.patch(node, result)
  return result
}
