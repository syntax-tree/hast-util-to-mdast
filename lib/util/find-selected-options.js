'use strict'

var is = require('hast-util-is-element')
var has = require('hast-util-has-property')
var toText = require('hast-util-to-text')
var wrapText = require('./wrap-text')

module.exports = findSelectedOptions

function findSelectedOptions(h, node, properties) {
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
    content = wrapText(h, toText(option))
    label = content || option.properties.label
    value = option.properties.value || content

    values.push([value, label === value ? null : label])
  }

  return values
}

function findOptions(node) {
  var children = node.children
  var length = children.length
  var index = -1
  var results = []
  var child

  while (++index < length) {
    child = children[index]

    if (is(child, 'option')) {
      if (!has(child, 'disabled')) {
        results.push(child)
      }
    } else if ('children' in child) {
      results = results.concat(findOptions(child))
    }
  }

  return results
}
