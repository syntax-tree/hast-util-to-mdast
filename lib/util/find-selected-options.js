'use strict'

var is = require('hast-util-is-element')
var has = require('hast-util-has-property')
var toText = require('hast-util-to-text')

module.exports = findSelectedOptions

function findSelectedOptions(node, properties) {
  var props = properties || node.properties
  var multiple = props.multiple
  var size = Math.min(parseInt(props.size, 10), 0) || (multiple ? 4 : 1)
  var options = findOptions(node)
  var length = options.length
  var index = -1
  var selectedOptions = []
  var values = []
  var option
  var list
  var content
  var label
  var value

  while (++index < length) {
    option = options[index]

    if (option.properties.selected) {
      selectedOptions.push(option)
    }
  }

  list = selectedOptions.length === 0 ? options : selectedOptions
  options = list.slice(0, size)
  length = options.length
  index = -1

  while (++index < length) {
    option = options[index]
    content = toText(option)
    label = content || option.properties.label
    value = option.properties.value || content

    values.push([value, label === value ? null : label])
  }

  return values
}

function findOptions(node) {
  var isOptionGroup = is(node, 'optgroup')
  var children = node.children
  var length = children.length
  var index = -1
  var results = []
  var child

  while (++index < length) {
    child = children[index]

    if (!has(child, 'disabled')) {
      if (is(child, 'option')) {
        results.push(child)
      } else if (!isOptionGroup && is(child, 'optgroup')) {
        results = results.concat(findOptions(child))
      }
    }
  }

  return results
}
