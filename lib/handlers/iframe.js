/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Link} Link
 * @typedef {import('../types.js').State} State
 */

import {resolve} from '../util/resolve.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Link | void}
 *   mdast node.
 */
export function iframe(state, node) {
  const properties = node.properties || {}
  const src = String(properties.src || '')
  const title = String(properties.title || '')

  // Only create a link if there is a title.
  // We can’t use the content of the frame because conforming HTML parsers treat
  // it as text, whereas legacy parsers treat it as HTML, so it will likely
  // contain tags that will show up in text.
  if (src && title) {
    /** @type {Link} */
    const result = {
      type: 'link',
      title: null,
      url: resolve(state, src),
      children: [{type: 'text', value: wrapText(state, title)}]
    }

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }
}
