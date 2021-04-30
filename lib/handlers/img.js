/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {resolve} from '../util/resolve.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function img(h, node) {
  return h(node, 'image', {
    url: resolve(h, String(node.properties.src || '') || null),
    title: node.properties.title || null,
    alt: node.properties.alt || ''
  })
}
