/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('../types.js').State} State
 */

import {toString} from 'mdast-util-to-string'
import {visit, EXIT} from 'unist-util-visit'
import {all} from '../all.js'
import {resolve} from '../util/resolve.js'
import {wrapNeeded} from '../util/wrap.js'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Link | Array<MdastContent>}
 *   mdast node.
 */
export function media(state, node) {
  const properties = node.properties || {}
  const poster = node.tagName === 'video' ? String(properties.poster || '') : ''
  let src = String(properties.src || '')
  let index = -1
  let linkInFallbackContent = false
  let nodes = all(state, node)

  visit({type: 'root', children: nodes}, 'link', findLink)

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || wrapNeeded(nodes)) {
    return nodes
  }

  // Find the source.
  while (!src && ++index < node.children.length) {
    const child = node.children[index]

    if (
      child.type === 'element' &&
      child.tagName === 'source' &&
      child.properties
    ) {
      src = String(child.properties.src || '')
    }
  }

  // If there’s a poster defined on the video, create an image.
  if (poster) {
    /** @type {Image} */
    const image = {
      type: 'image',
      title: null,
      url: resolve(state, poster),
      alt: toString(nodes)
    }
    state.patch(node, image)
    nodes = [image]
  }

  // Link to the media resource.
  /** @type {Link} */
  const result = {
    type: 'link',
    title: properties.title ? String(properties.title) : null,
    url: resolve(state, src),
    // @ts-expect-error Assume phrasing content.
    children: nodes
  }
  state.patch(node, result)
  return result

  function findLink() {
    linkInFallbackContent = true
    return EXIT
  }
}
