'use strict'

module.exports = media

var visit = require('unist-util-visit')
var is = require('hast-util-is-element')
var toString = require('mdast-util-to-string')
var all = require('../all')
var resolve = require('../util/resolve')
var needed = require('../util/wrap').needed

function media(h, node) {
  var nodes = all(h, node)
  var title = node.properties.title
  var poster = is(node, 'video') ? node.properties.poster : null
  var src = node.properties.src
  var children = node.children
  var length = children.length
  var index = -1
  var linkInFallbackContent = false
  var child

  // Find the source.
  while (!src && ++index < length) {
    child = children[index]

    if (is(child, 'source')) {
      src = child.properties.src
    }
  }

  visit({type: 'root', children: nodes}, 'link', findLink)

  // If the content links to something, or if it’s not phrasing…
  if (linkInFallbackContent || needed(nodes)) {
    return nodes
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
    title: title || null,
    url: resolve(h, src),
    children: nodes
  }

  function findLink() {
    linkInFallbackContent = true
    return visit.EXIT
  }
}
