/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').State} State
 */

import {findSelectedOptions} from '../util/find-selected-options.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text | void}
 *   mdast node.
 */
export function select(state, node) {
  const values = findSelectedOptions(state, node)
  let index = -1
  /** @type {Array<string>} */
  const results = []

  while (++index < values.length) {
    const value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    /** @type {Text} */
    const result = {type: 'text', value: wrapText(state, results.join(', '))}

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }
}
