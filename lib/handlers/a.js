/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Properties} Properties
 * @typedef {import('../types.js').MdastNode} Content
 */

import {all} from '../all.js'
import {resolve} from '../util/resolve.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function a(h, node) {
  /** @type {Properties} */
  // @ts-expect-error: `props` are defined.
  const props = node.properties
  return h(
    node,
    'link',
    {
      title: props.title || null,
      url: resolve(h, String(props.href || '') || null)
    },
    all(h, node)
  )
}
