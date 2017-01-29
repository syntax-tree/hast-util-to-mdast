module.exports = one

var u = require('unist-builder')
var has = require('has')

var all = require('./all')
var handlers = require('./handlers')

function one (h, node, parent) {
  var fn = null
  if (node.type === 'element' && has(handlers, node.tagName)) {
    fn = handlers[node.tagName]
  } else if (has(handlers, node.type)) {
    fn = handlers[node.type]
  }

  var val = (typeof fn === 'function' ? fn : unknown)(h, node, parent)
  return val
}

function unknown (h, node) {
  if (node.value) {
    return h.augment(node, u('text', node.value))
  }

  return all(h, node)
}
