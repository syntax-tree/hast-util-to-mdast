/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').H} H
 */

import {findSelectedOptions} from '../util/find-selected-options.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text | void}
 *   mdast node.
 */
export function select(h, node) {
  const values = findSelectedOptions(h, node)
  let index = -1
  /** @type {Array<string>} */
  const results = []

  while (++index < values.length) {
    const value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    /** @type {Text} */
    const result = {type: 'text', value: wrapText(h, results.join(', '))}

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }
}
