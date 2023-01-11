/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('hast').Element} Element
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Link}
 *   mdast node.
 */
export function a(state, node) {
  const properties = node.properties || {}

  /** @type {Link} */
  const result = {
    type: 'link',
    url: state.resolve(String(properties.href || '') || null),
    title: properties.title ? String(properties.title) : null,
    // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    children: state.all(node)
  }
  state.patch(node, result)
  return result
}
