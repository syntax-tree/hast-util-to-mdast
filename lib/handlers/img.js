/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Image} from 'mdast'
 */

import {collapse} from '../util/collapse.js'

/**
 * Turn a hast `img` element into an mdast image.
 *
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
    title: collapse(properties.title) || null,
    alt: collapse(properties.alt)
  }
  state.patch(node, result)
  return result
}
