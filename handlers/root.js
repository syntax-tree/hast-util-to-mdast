module.exports = root

var u = require('unist-builder')
var all = require('../all')

function root (h, node) {
  return h(node, 'root', all(h, node))
}
