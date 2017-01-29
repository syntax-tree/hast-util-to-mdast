module.exports = emphasis

var u = require('unist-builder')
var all = require('../all')

function emphasis (h, node) {
  return h(node, 'emphasis', all(h, node))
}
