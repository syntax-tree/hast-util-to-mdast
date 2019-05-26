'use strict'

var findSelectedOptions = require('../util/find-selected-options')

module.exports = select

function select(h, node) {
  var values = findSelectedOptions(node)

  if (values.length !== 0) {
    return h.augment(node, {type: 'text', value: values.join(', ')})
  }
}
