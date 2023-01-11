/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Root} Root
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').Image} Image
 * @typedef {import('mdast').Content} MdastContent
 * @typedef {import('../state.js').State} State
 */

import {toString} from 'mdast-util-to-string'
import {visit, EXIT} from 'unist-util-visit'
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
  let nodes = state.all(node)

  /** @type {Root} */
  const fragment = {type: 'root', children: nodes}

  visit(fragment, function (node) {
    if (node.type === 'link') {
      linkInFallbackContent = true
      return EXIT
    }
  })

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
      url: state.resolve(poster),
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
    url: state.resolve(src),
    // @ts-expect-error: allow potentially “invalid” nodes, they might be unknown.
    // We also support straddling later.
    children: nodes
  }
  state.patch(node, result)
  return result
}
