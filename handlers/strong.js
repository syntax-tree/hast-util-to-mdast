module.exports = strong

var u = require('unist-builder')
var all = require('../all')

function strong (h, node) {
  return h(node, 'strong', all(h, node))
}
