/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} Content
 */

import {all} from '../all.js'
import {wrap, wrapNeeded} from '../util/wrap.js'

// To do: fix `h`, because the return value isn’t a `Content`.
/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content}
 *   mdast node.
 */
export function root(h, node) {
  let children = all(h, node)

  if (h.document || wrapNeeded(children)) {
    children = wrap(children)
  }

  return h(node, 'root', children)
}
