'use strict'

module.exports = list

var has = require('hast-util-has-property')
var wrapListItems = require('../util/wrap-list-items')
var spread = require('../util/list-items-spread')

function list(h, node) {
  var ordered = node.tagName === 'ol'
  var start = null
  var children

  if (ordered) {
    start = has(node, 'start') ? node.properties.start : 1
  }

  children = wrapListItems(h, node)

  return h(
    node,
    'list',
    {ordered: ordered, start: start, spread: spread(children)},
    children
  )
}
