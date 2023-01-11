/**
 * @typedef {import('hast').Text} HastText
 * @typedef {import('mdast').Text} MdastText
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {HastText} node
 *   hast element to transform.
 * @returns {MdastText}
 *   mdast node.
 */
export function text(state, node) {
  /** @type {MdastText} */
  const result = {type: 'text', value: node.value}
  state.patch(node, result)
  return result
}
