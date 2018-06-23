'use strict'

module.exports = paragraph

var all = require('../all')

function paragraph(h, node) {
  return h(node, 'paragraph', all(h, node))
}
