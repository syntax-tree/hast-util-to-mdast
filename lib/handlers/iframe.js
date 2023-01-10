/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Link} Link
 * @typedef {import('../types.js').H} H
 */

import {resolve} from '../util/resolve.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Link | void}
 *   mdast node.
 */
export function iframe(h, node) {
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
      url: resolve(h, src),
      children: [{type: 'text', value: wrapText(h, title)}]
    }

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
  }
}
