/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} Content
 */

import {findSelectedOptions} from '../util/find-selected-options.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Content | void}
 *   mdast node.
 */
export function select(h, node) {
  const values = findSelectedOptions(h, node)
  let index = -1
  /** @type {Array<string>} */
  const results = []
  /** @type {[string, string|null]} */
  let value

  while (++index < values.length) {
    value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    return h(node, 'text', wrapText(h, results.join(', ')))
  }
}
