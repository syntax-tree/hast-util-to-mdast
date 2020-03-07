'use strict'

module.exports = one

var all = require('./all')
var wrapText = require('./util/wrap-text')

var own = {}.hasOwnProperty

function one(h, node, parent) {
  var fn = null

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(h.handlers, node.tagName)) {
      fn = h.handlers[node.tagName]
    }
  } else if (own.call(h.handlers, node.type)) {
    fn = h.handlers[node.type]
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

function unknown(h, node) {
  if (node.value) {
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
