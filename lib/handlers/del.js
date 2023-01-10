/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Delete} Delete
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Delete}
 *   mdast node.
 */
export function del(h, node) {
  /** @type {Delete} */
  const result = {
    type: 'delete',
    // @ts-expect-error: assume valid children.
    children: all(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
