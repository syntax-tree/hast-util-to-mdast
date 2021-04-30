/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {all} from '../all.js'
import {resolve} from '../util/resolve.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function a(h, node) {
  return h(
    node,
    'link',
    {
      title: node.properties.title || null,
      url: resolve(h, String(node.properties.href || '') || null)
    },
    all(h, node)
  )
}
