module.exports = all

var trim = require('trim')
var one = require('./one')

function all (h, parent) {
  var nodes = parent.children || []
  var length = nodes.length
  var values = []
  var index = -1
  var result
  var head

  while (++index < length) {
    result = one(h, nodes[index], parent)
    if (result) {
      values = values.concat(result)
    }
  }

  return values
}
