/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} Content
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Array<Content>}
 *   mdast node.
 */
export function q(h, node) {
  const expected = h.quotes[h.qNesting % h.quotes.length]

  h.qNesting++
  const contents = all(h, node)
  h.qNesting--

  contents.unshift({type: 'text', value: expected.charAt(0)})

  contents.push({
    type: 'text',
    value: expected.length > 1 ? expected.charAt(1) : expected
  })

  return contents
}
