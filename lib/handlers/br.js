/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Break} Break
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Break | Text}
 *   mdast node.
 */
export function br(h, node) {
  /** @type {Break | Text} */
  const result = h.wrapText ? {type: 'break'} : {type: 'text', value: ' '}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
