'use strict'

module.exports = q

var all = require('../all')

var quote = '"'

function q(h, node) {
  var contents = all(h, node)
  var head = contents[0]
  var tail = contents[contents.length - 1]

  if (head && head.type === 'text') {
    head.value = quote + head.value
  } else {
    contents.unshift({type: 'text', value: quote})
  }

  if (tail && tail.type === 'text') {
    tail.value += quote
  } else {
    contents.push({type: 'text', value: quote})
  }

  return contents
}
