'use strict'

var toText = require('hast-util-to-text')

module.exports = textarea

function textarea(h, node) {
  return h.augment(node, {type: 'text', value: toText(node)})
}
