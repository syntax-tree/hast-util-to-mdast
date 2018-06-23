'use strict'

module.exports = loose

function loose(children) {
  var length = children.length
  var index = -1

  while (++index < length) {
    if (children[index].loose) {
      return true
    }
  }

  return false
}
