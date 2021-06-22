/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Root} Root
 */

import {all} from '../all.js'
import {wrap, wrapNeeded} from '../util/wrap.js'

/**
 * @type {Handle}
 * @param {Root} node
 */
export function root(h, node) {
  let children = all(h, node)

  if (h.document || wrapNeeded(children)) {
    children = wrap(children)
  }

  return h(node, 'root', children)
}
