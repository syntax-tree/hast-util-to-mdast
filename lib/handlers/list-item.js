'use strict'

module.exports = listItem

var is = require('hast-util-is-element')
var wrapChildren = require('../util/wrap-children')

function listItem(h, node) {
  var children = node.children
  var head = children[0]
  var checked = null
  var checkbox
  var grandchildren
  var content

  // Check if this node starts with a checkbox.
  if (head && is(head, 'p')) {
    grandchildren = head.children
    checkbox = grandchildren[0]

    if (
      checkbox &&
      is(checkbox, 'input') &&
      checkbox.properties.type === 'checkbox'
    ) {
      checked = Boolean(checkbox.properties.checked)
    }
  }

  content = wrapChildren(h, node)

  // Remove initial spacing if we previously found a checkbox.
  if (checked !== null) {
    grandchildren = content[0] && content[0].children
    head = grandchildren && grandchildren[0]

    if (head && head.type === 'text' && head.value.charAt(0) === ' ') {
      // Remove text with one space, or remove that one initial space.
      if (head.value.length === 1) {
        content[0].children = grandchildren.slice(1)
      } else {
        head.value = head.value.slice(1)
      }
    }
  }

  // Drop empty paragraph.
  if (content.length === 1) {
    head = content[0]

    if (head.type === 'paragraph' && head.children.length === 0) {
      content = []
    }
  }

  return h(
    node,
    'listItem',
    {spread: content.length > 1, checked: checked},
    content
  )
}
