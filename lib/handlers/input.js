'use strict'

var repeat = require('repeat-string')
var is = require('hast-util-is-element')
var resolve = require('../util/resolve')
var findSelectedOptions = require('../util/find-selected-options')

module.exports = input

// eslint-disable-next-line complexity
function input(h, node) {
  var byId = h.nodeById
  var props = node.properties
  var value = props.value || props.placeholder
  var list = props.list
  var type = props.type
  var values = []
  var length
  var index
  var results
  var url
  var text

  if (props.disabled || props.type === 'hidden' || props.type === 'file') {
    return
  }

  if (type === 'checkbox' || type === 'radio') {
    return {type: 'text', value: '[' + (props.checked ? 'x' : ' ') + ']'}
  }

  if (type === 'image' && props.alt) {
    values = [props.alt]
  } else if (value) {
    values = [value]
  } else if (
    list &&
    type !== 'password' && // `list` is not supported on `password`
    type !== 'file' && // …or `file`
    type !== 'submit' && // …or `submit`
    type !== 'reset' && // …or `reset`
    type !== 'button' && // …or `button`
    list in byId &&
    is(byId[list], 'datalist')
  ) {
    values = findSelectedOptions(byId[list], props)
  }

  if (values.length === 0) {
    return
  }

  if (type === 'password') {
    length = values.length
    index = -1

    while (++index < length) {
      values[index] = repeat('•', values[index].length)
    }
  }

  if (type === 'image') {
    return h(node, 'image', {
      url: resolve(h, props.src),
      title: props.title || null,
      alt: values[0]
    })
  }

  if (type !== 'url' && type !== 'email') {
    return h.augment(node, {type: 'text', value: values.join(', ')})
  }

  length = values.length
  index = -1
  results = []

  while (++index < length) {
    value = values[index]
    text = resolve(h, value)
    url = type === 'email' ? 'mailto:' + text : text

    results.push(
      h(node, 'link', {title: null, url: url}, [{type: 'text', value: text}])
    )

    if (index !== length - 1) {
      results.push({type: 'text', value: ', '})
    }
  }

  return results
}
