/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {findSelectedOptions} from '../util/find-selected-options.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function select(h, node) {
  const values = findSelectedOptions(h, node)
  let index = -1
  /** @type {Array.<string>} */
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
