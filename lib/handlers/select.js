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
  var values = findSelectedOptions(h, node)
  var index = -1
  /** @type {Array.<string>} */
  var results = []
  /** @type {[string, string|null]} */
  var value

  while (++index < values.length) {
    value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    return h(node, 'text', wrapText(h, results.join(', ')))
  }
}
