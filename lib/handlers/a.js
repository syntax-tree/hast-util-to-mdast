/**
 * @typedef {import('mdast').Link} Link
 * @typedef {import('hast').Element} Element
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'
import {resolve} from '../util/resolve.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Link}
 *   mdast node.
 */
export function a(h, node) {
  const properties = node.properties || {}

  /** @type {Link} */
  const result = {
    type: 'link',
    url: resolve(h, String(properties.href || '') || null),
    title: properties.title ? String(properties.title) : null,
    // @ts-expect-error: assume valid children.
    children: all(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
