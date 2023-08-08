/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('mdast').Text} Text
 *
 * @typedef {import('../state.js').State} State
 */

import {findSelectedOptions} from '../util/find-selected-options.js'

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Text | undefined}
 *   mdast node.
 */
export function select(state, node) {
  const values = findSelectedOptions(node)
  let index = -1
  /** @type {Array<string>} */
  const results = []

  while (++index < values.length) {
    const value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    /** @type {Text} */
    const result = {type: 'text', value: results.join(', ')}
    state.patch(node, result)
    return result
  }
}
