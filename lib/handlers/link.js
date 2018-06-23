'use strict'

module.exports = link

var all = require('../all')
var resolve = require('../util/resolve')

function link(h, node) {
  var props = {
    url: resolve(h, node.properties.href),
    title: node.properties.title || null
  }

  return h(node, 'link', props, all(h, node))
}
