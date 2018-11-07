'use strict'

module.exports = wrapped

var all = require('../all')

function wrapped(h, node) {
  var children = all(h, node)
  var length = children.length
  var index = -1
  var child

  while (++index < length) {
    child = children[index]

    if (child.type !== 'listItem') {
      children[index] = {
        type: 'listItem',
        spread: false,
        checked: null,
        children: [child]
      }
    }
  }

  return children
}
