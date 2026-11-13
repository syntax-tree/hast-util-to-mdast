/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Text} from 'mdast'
 */

import {findSelectedOptions} from '../util/find-selected-options.js'

/**
 * Turn a hast `select` element into mdast text of its selected options.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Text | undefined}
 *   mdast node.
 */
export function select(state, node) {
  const properties = node.properties || {}
  const values = findSelectedOptions(node, properties.multiple, properties.size)
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
