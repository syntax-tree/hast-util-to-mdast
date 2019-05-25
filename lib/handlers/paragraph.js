'use strict'

module.exports = paragraph

var all = require('../all')

function paragraph(h, node) {
  var children = node.children
  var nodes = all(h, node)

  if (children && children.length !== 0 && nodes.length === 0) {
    return
  }

  return h(node, 'paragraph', nodes)
}
