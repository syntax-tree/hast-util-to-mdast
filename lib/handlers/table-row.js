/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').TableRow} TableRow
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {TableRow}
 *   mdast node.
 */
export function tableRow(h, node) {
  /** @type {TableRow} */
  const result = {
    type: 'tableRow',
    // @ts-expect-error: assume valid children.
    children: all(h, node)
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
