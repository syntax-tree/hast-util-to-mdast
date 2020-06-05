'use strict'

module.exports = link

var all = require('../all')
var resolve = require('../util/resolve')

function link(h, node) {
  var props = {
    title: node.properties.title || null,
    url: resolve(h, node.properties.href)
  }

  return h(node, 'link', props, all(h, node))
}
