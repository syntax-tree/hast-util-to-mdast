'use strict'

var is = require('hast-util-is-element')
var has = require('hast-util-has-property')
var toText = require('hast-util-to-text')

module.exports = input

function input(h, node) {
  var byId = h.nodeById
  var props = node.properties
  var value = props.value || props.placeholder
  var list = props.list

  if (has(node, 'disabled') || props.type === 'hidden') {
    return
  }

  if (!value && list && list in byId && is(byId[list], 'datalist')) {
    value = findSelectedOptions(byId[list], props).join(', ')
  }

  if (value) {
    return h.augment(node, {type: 'text', value: value})
  }

  console.log('input: ', node)
}

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

  while (++index < length) {
    option = options[index]

    if (has(option, 'selected')) {
      selectedOptions.push(option)
    }
  }

  list = selectedOptions.length === 0 ? options : selectedOptions
  options = list.slice(0, size)
  length = options.length
  index = -1

  while (++index < length) {
    option = options[index]
    values.push(option.properties.value || toText(option))
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
