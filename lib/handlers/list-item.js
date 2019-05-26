'use strict'

module.exports = listItem

var is = require('hast-util-is-element')
var wrapChildren = require('../util/wrap-children')

// eslint-disable-next-line complexity
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
      (checkbox.properties.type === 'checkbox' ||
        checkbox.properties.type === 'radio')
    ) {
      checked = Boolean(checkbox.properties.checked)
    }
  }

  content = wrapChildren(h, node)

  if (checked !== null) {
    grandchildren = content[0] && content[0].children

    // Remove text checkbox (enabled inputs are mapped to textual checkboxes).
    head = grandchildren && grandchildren[0]

    if (
      head &&
      head.type === 'text' &&
      head.value.length === 3 &&
      head.value.charAt(0) === '[' &&
      head.value.charAt(2) === ']'
    ) {
      grandchildren.shift()
    }

    // Remove initial spacing if we previously found a checkbox.
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

  return h(
    node,
    'listItem',
    {spread: content.length > 1, checked: checked},
    content
  )
}
