'use strict'

var findSelectedOptions = require('../util/find-selected-options')
var wrapText = require('../util/wrap-text')

module.exports = select

function select(h, node) {
  var values = findSelectedOptions(h, node)
  var length = values.length
  var index = -1
  var results = []
  var value

  while (++index < length) {
    value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length !== 0) {
    return h(node, 'text', wrapText(h, results.join(', ')))
  }
}
