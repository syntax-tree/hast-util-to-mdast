/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Break, Text} from 'mdast'
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {toText} from 'hast-util-to-text'

/**
 * Turn a hast `textarea` element into mdast text and breaks.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Array<Break | Text>}
 *   mdast nodes.
 */
export function textarea(state, node) {
  const value = toText(node)
  /** @type {Array<Break | Text>} */
  const results = []
  let blank = false
  let start = 0
  let cr = value.indexOf('\r')
  let lf = value.indexOf('\n')

  while (start <= value.length) {
    if (cr !== -1 && cr < start) cr = value.indexOf('\r', start)
    if (lf !== -1 && lf < start) lf = value.indexOf('\n', start)

    const end = Math.min(
      cr === -1 ? value.length : cr,
      lf === -1 ? value.length : lf
    )
    const line = collapseWhiteSpace(value.slice(start, end), {
      style: 'html',
      trim: true
    })

    if (line) {
      if (results.length > 0) {
        results.push({type: 'break'})
        if (blank) results.push({type: 'break'})
      }

      results.push({type: 'text', value: line})
      blank = false
    } else {
      blank = true
    }

    start = end + (end === cr && lf === cr + 1 ? 2 : 1)
  }

  return results
}
