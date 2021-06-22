/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 */

import {resolve} from '../util/resolve.js'
import {wrapText} from '../util/wrap-text.js'

/**
 * @type {Handle}
 * @param {Element} node
 */
export function iframe(h, node) {
  const src = String(node.properties.src || '')
  const title = String(node.properties.title || '')

  // Only create a link if there is a title.
  // We can’t use the content of the frame because conforming HTML parsers treat
  // it as text, whereas legacy parsers treat it as HTML, so it will likely
  // contain tags that will show up in text.
  if (src && title) {
    return {
      type: 'link',
      title: null,
      url: resolve(h, src),
      children: [{type: 'text', value: wrapText(h, title)}]
    }
  }
}
