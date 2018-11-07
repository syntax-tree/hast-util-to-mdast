'use strict'

module.exports = spread

function spread(children) {
  var length = children.length
  var index = -1

  if (length > 1) {
    while (++index < length) {
      if (children[index].spread) {
        return true
      }
    }
  }

  return false
}
