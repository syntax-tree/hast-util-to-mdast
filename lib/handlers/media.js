/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Properties} Properties
 * @typedef {import('../types.js').ElementChild} ElementChild
 */

import {convertElement} from 'hast-util-is-element'
import {toString} from 'mdast-util-to-string'
import {visit, EXIT} from 'unist-util-visit'
import {all} from '../all.js'
import {resolve} from '../util/resolve.js'
import {wrapNeeded} from '../util/wrap.js'

const source = convertElement('source')
const video = convertElement('video')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function media(h, node) {
  let nodes = all(h, node)
  /** @type {Properties} */
  // @ts-expect-error: `props` are defined.
  const properties = node.properties
  const poster = video(node) && String(properties.poster || '')
  let src = String(properties.src || '')
  let index = -1
  /** @type {boolean} */
  let linkInFallbackContent = false
  /** @type {ElementChild} */
  let child

  visit({type: 'root', children: nodes}, 'link', findLink)

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || wrapNeeded(nodes)) {
    return nodes
  }

  // Find the source.
  while (!src && ++index < node.children.length) {
    child = node.children[index]
    if (source(child)) {
      // @ts-expect-error: `props` are defined.
      src = String(child.properties.src || '')
    }
  }

  // If there’s a poster defined on the video, create an image.
  if (poster) {
    nodes = [
      {
        type: 'image',
        title: null,
        url: resolve(h, poster),
        alt: toString({children: nodes})
      }
    ]
  }

  // Link to the media resource.
  return {
    type: 'link',
    // @ts-expect-error Types are broken.
    title: node.properties.title || null,
    url: resolve(h, src),
    // @ts-expect-error Assume phrasing content.
    children: nodes
  }

  function findLink() {
    linkInFallbackContent = true
    return EXIT
  }
}
