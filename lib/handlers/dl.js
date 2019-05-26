'use strict'

module.exports = dataList

var is = require('hast-util-is-element')
var wrapListItems = require('../util/wrap-list-items')
var spread = require('../util/list-items-spread')

function dataList(h, node) {
  var children = node.children
  var length = children.length
  var index = -1
  var clean = []
  var groups = []
  var content
  var breakpoint
  var title
  var child
  var group = {titles: [], definitions: []}

  // Unwrap `<div>`s
  while (++index < length) {
    child = children[index]
    clean = clean.concat(is(child, 'div') ? child.children : child)
  }

  length = clean.length
  index = -1

  // Group titles and definitions.
  while (++index < length) {
    child = clean[index]
    title = is(child, 'dt')

    if (title && breakpoint) {
      groups.push(group)
      group = {titles: [], definitions: []}
    }

    group[title ? 'titles' : 'definitions'].push(child)
    breakpoint = is(child, 'dd')
  }

  groups.push(group)

  // Group titles and definitions.
  length = groups.length
  index = -1
  content = []

  while (++index < length) {
    group = groups[index]
    group = handle(h, group.titles).concat(handle(h, group.definitions))

    if (group.length !== 0) {
      content.push({
        type: 'listItem',
        spread: group.length > 1,
        checked: null,
        children: group
      })
    }
  }

  // Create a list if there are items.
  if (content.length !== 0) {
    return h(
      node,
      'list',
      {ordered: false, start: null, spread: spread(content)},
      content
    )
  }
}

function handle(h, category) {
  var nodes = wrapListItems(h, {children: category})

  if (nodes.length === 0) {
    return []
  }

  if (nodes.length === 1) {
    return nodes[0].children
  }

  return [
    {
      type: 'list',
      ordered: false,
      start: null,
      spread: spread(nodes),
      children: nodes
    }
  ]
}
