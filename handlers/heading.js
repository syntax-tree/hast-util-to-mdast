module.exports = function (depth) {
  return heading(depth)
}

var u = require('unist-builder')
var all = require('../all')

function heading (depth) {
  return function (h, node) {
    return h(node, 'heading', { depth: depth }, all(h, node))
  }
}
