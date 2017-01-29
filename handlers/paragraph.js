module.exports = p

var u = require('unist-builder')
var all = require('../all')


function p (h, node) {
  return h(node, 'paragraph', all(h, node))
}
