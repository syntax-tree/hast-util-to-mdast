/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'
import {wrap, wrapNeeded} from '../util/wrap.js'

// To do: fix `h`, because the return value isn’t a `Content`.
/**
 * @param {H} h
 *   Context.
 * @param {HastRoot} node
 *   hast root to transform.
 * @returns {MdastRoot}
 *   mdast node.
 */
export function root(h, node) {
  let children = all(h, node)

  if (h.document || wrapNeeded(children)) {
    // @ts-expect-error: improve `all`?
    children = wrap(children)
  }

  /** @type {MdastRoot} */
  const result = {type: 'root', children}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
