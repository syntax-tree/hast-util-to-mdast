/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').BlockContent} BlockContent
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'
import {wrap} from './wrap.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   Element to transform.
 * @returns {Array<BlockContent>}
 *   Block content.
 */
export function wrapChildren(h, node) {
  // @ts-expect-error: improve `all`?
  return wrap(all(h, node))
}
