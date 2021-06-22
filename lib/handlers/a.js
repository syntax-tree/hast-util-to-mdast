/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Properties} Properties
 */

import {all} from '../all.js'
import {resolve} from '../util/resolve.js'

/**
 * @type {Handle}
 * @param {Element} node
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
