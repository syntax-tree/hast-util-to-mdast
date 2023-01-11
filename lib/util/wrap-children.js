/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('../types.js').State} State
 */

import {all} from '../all.js'
import {wrap} from './wrap.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   Element to transform.
 * @returns {Array<BlockContent>}
 *   Block content.
 */
export function wrapChildren(state, node) {
  // @ts-expect-error: improve `all`?
  return wrap(all(state, node))
}
