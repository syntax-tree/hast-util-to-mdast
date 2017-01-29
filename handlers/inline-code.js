module.exports = inlineCode

var toString = require('hast-util-to-string');
var u = require('unist-builder')
var all = require('../all')

function inlineCode (h, node) {
  return h(node, 'inlineCode', toString(node))
}
