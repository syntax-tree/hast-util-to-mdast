import {convertElement} from 'hast-util-is-element'
import {toString} from 'mdast-util-to-string'
import {visit} from 'unist-util-visit'
import {all} from '../all.js'
import {resolve} from '../util/resolve.js'
import {wrapNeeded} from '../util/wrap.js'

var source = convertElement('source')
var video = convertElement('video')

export function media(h, node) {
  var nodes = all(h, node)
  var poster = video(node) && node.properties.poster
  var src = node.properties.src
  var index = -1
  var linkInFallbackContent

  visit({type: 'root', children: nodes}, 'link', findLink)

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || wrapNeeded(nodes)) {
    return nodes
  }

  // Find the source.
  while (!src && ++index < node.children.length) {
    if (source(node.children[index])) {
      src = node.children[index].properties.src
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
    title: node.properties.title || null,
    url: resolve(h, src),
    children: nodes
  }

  function findLink() {
    linkInFallbackContent = true
    return visit.EXIT
  }
}
