/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('../types.js').H} H
 */

import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Array<MdastContent>}
 *   mdast nodes.
 */
export function q(h, node) {
  h.qNesting++
  const contents = all(h, node)
  h.qNesting--

  const quote = h.quotes[h.qNesting % h.quotes.length]
  const head = contents[0]
  const tail = contents[contents.length - 1]
  const open = quote.charAt(0)
  const close = quote.length > 1 ? quote.charAt(1) : quote

  if (head && head.type === 'text') {
    head.value = open + head.value
  } else {
    contents.unshift({type: 'text', value: open})
  }

  if (tail && tail.type === 'text') {
    tail.value += close
  } else {
    contents.push({type: 'text', value: close})
  }

  return contents
}
