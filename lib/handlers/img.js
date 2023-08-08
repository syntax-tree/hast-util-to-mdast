/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Image} Image
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
 * @returns {Image}
 *   mdast node.
 */
export function img(state, node) {
  const properties = node.properties || {}

  /** @type {Image} */
  const result = {
    type: 'image',
    url: state.resolve(String(properties.src || '') || null),
    title: properties.title ? String(properties.title) : null,
    alt: properties.alt ? String(properties.alt) : ''
  }
  state.patch(node, result)
  return result
}
