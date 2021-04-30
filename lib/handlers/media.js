/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 */

import {convertElement} from 'hast-util-is-element'
import {toString} from 'mdast-util-to-string'
import {visit, EXIT} from 'unist-util-visit'
import {all} from '../all.js'
import {resolve} from '../util/resolve.js'
import {wrapNeeded} from '../util/wrap.js'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'source'}>} */
var source = convertElement('source')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'video'}>} */
var video = convertElement('video')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function media(h, node) {
  var nodes = all(h, node)
  var poster = video(node) && String(node.properties.poster || '')
  var src = String(node.properties.src || '')
  var index = -1
  /** @type {boolean} */
  var linkInFallbackContent
  /** @type {ElementChild} */
  var child

  visit({type: 'root', children: nodes}, 'link', findLink)

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || wrapNeeded(nodes)) {
    return nodes
  }

  // Find the source.
  while (!src && ++index < node.children.length) {
    child = node.children[index]
    if (source(child)) {
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
  // @ts-ignore Types are broken.
  return {
    type: 'link',
    title: node.properties.title || null,
    url: resolve(h, src),
    // @ts-ignore Assume phrasing content.
    children: nodes
  }

  function findLink() {
    linkInFallbackContent = true
    return EXIT
  }
}
