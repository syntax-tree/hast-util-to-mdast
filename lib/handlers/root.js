/**
 * @typedef {import('hast').Root} HastRoot
 * @typedef {import('mdast').Root} MdastRoot
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'
import {wrap, wrapNeeded} from '../util/wrap.js'

/**
 * @param {State} state
 *   State.
 * @param {HastRoot} node
 *   hast root to transform.
 * @returns {MdastRoot}
 *   mdast node.
 */
export function root(state, node) {
  let children = all(state, node)

  if (state.options.document || wrapNeeded(children)) {
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
