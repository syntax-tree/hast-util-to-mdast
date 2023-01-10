/**
 * @typedef {import('mdast').Image} Image
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').H} H
 */

import {resolve} from '../util/resolve.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Image}
 *   mdast node.
 */
export function img(h, node) {
  const properties = node.properties || {}

  /** @type {Image} */
  const result = {
    type: 'image',
    url: resolve(h, String(properties.src || '') || null),
    title: properties.title ? String(properties.title) : null,
    alt: properties.alt ? String(properties.alt) : ''
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
