'use strict'

var toText = require('hast-util-to-text')
var wrapText = require('../util/wrap-text')

module.exports = textarea

function textarea(h, node) {
  return h(node, 'text', wrapText(h, toText(node)))
}
