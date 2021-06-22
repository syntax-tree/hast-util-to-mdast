/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Properties} Properties
 */

import {resolve} from '../util/resolve.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function img(h, node) {
  /** @type {Properties} */
  // @ts-expect-error: `props` are defined.
  const props = node.properties
  return h(node, 'image', {
    url: resolve(h, String(props.src || '') || null),
    title: props.title || null,
    alt: props.alt || ''
  })
}
