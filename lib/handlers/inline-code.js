'use strict'

module.exports = inlineCode

var toText = require('hast-util-to-text')

function inlineCode(h, node) {
  return h(node, 'inlineCode', toText(node))
}
