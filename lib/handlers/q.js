'use strict'

module.exports = q

var all = require('../all')

function q(h, node) {
  var expected = h.quotes[h.qNesting % h.quotes.length]
  var open = expected.length === 1 ? expected : expected.charAt(0)
  var close = expected.length === 1 ? expected : expected.charAt(1)
  var contents
  var head
  var tail

  h.qNesting++
  contents = all(h, node)
  h.qNesting--

  head = contents[0]
  tail = contents[contents.length - 1]

  if (head && head.type === 'text') {
    head.value = open + head.value
  } else {
    contents.unshift({type: 'text', value: open})
  }

  if (tail && tail.type === 'text') {
    tail.value += close
  } else {
    contents.push({type: 'text', value: close})
  }

  return contents
}
