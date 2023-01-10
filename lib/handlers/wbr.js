/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text}
 *   mdast node.
 */
export function wbr(h, node) {
  /** @type {Text} */
  const result = {type: 'text', value: '\u200B'}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
