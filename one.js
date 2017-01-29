module.exports = one

var u = require('unist-builder')
var has = require('has')

var all = require('./all')
var handlers = require('./handlers')

function one (h, node, parent) {
  var fn = null

  var tagName = node && node.tagName && node.tagName !== undefined 
    ? node.tagName
    : null

  if (tagName && has(handlers, tagName)) {
    fn = has(handlers, tagName) ? handlers[tagName] : null
  } else if (tagName) {
    var matchHeader = tagName.match(/h([1-6?])/g)

    if (matchHeader) {
      var depth = tagName.split('h')[1]
      fn = handlers.heading(depth)
    }
  } else if (node.type && has(handlers, node.type)) {
    fn = handlers[node.type]
  }

  var val = (typeof fn === 'function' ? fn : unknown)(h, node, parent)
  return val
}

function unknown (h, node) {
  if (node.value) {
    return h.augment(node, u('text', node.value))
  }

  return h(node, all(h, node))
}
