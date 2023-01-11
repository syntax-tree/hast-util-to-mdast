/**
 * @typedef {import('mdast').Image} Image
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').State} State
 */

import {resolve} from '../util/resolve.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Image}
 *   mdast node.
 */
export function img(state, node) {
  const properties = node.properties || {}

  /** @type {Image} */
  const result = {
    type: 'image',
    url: resolve(state, String(properties.src || '') || null),
    title: properties.title ? String(properties.title) : null,
    alt: properties.alt ? String(properties.alt) : ''
  }
  state.patch(node, result)
  return result
}
