/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ThematicBreak} ThematicBreak
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {ThematicBreak}
 *   mdast node.
 */
export function hr(h, node) {
  /** @type {ThematicBreak} */
  const result = {type: 'thematicBreak'}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
