'use strict'

var repeat = require('repeat-string')
var is = require('hast-util-is-element')
var resolve = require('../util/resolve')
var findSelectedOptions = require('../util/find-selected-options')
var wrapText = require('../util/wrap-text')

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
    return {
      type: 'text',
      value: wrapText(h, h[props.checked ? 'checked' : 'unchecked'])
    }
  }

  if (type === 'image' && props.alt) {
    values = [[props.alt]]
  } else if (value) {
    values = [[value]]
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
    values = findSelectedOptions(h, byId[list], props)
  }

  if (values.length === 0) {
    return
  }

  // Passwords don’t support `list`.
  if (type === 'password') {
    values[0] = [repeat('•', values[0][0].length)]
  }

  // Images don’t support `list`.
  if (type === 'image') {
    return h(node, 'image', {
      url: resolve(h, props.src),
      title: (props.title && wrapText(h, props.title)) || null,
      alt: wrapText(h, values[0][0])
    })
  }

  length = values.length
  index = -1
  results = []

  if (type !== 'url' && type !== 'email') {
    while (++index < length) {
      value = values[index]
      results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
    }

    return h(node, 'text', wrapText(h, results.join(', ')))
  }

  while (++index < length) {
    value = values[index]
    text = resolve(h, value[0])
    url = type === 'email' ? 'mailto:' + text : text

    results.push(
      h(node, 'link', {title: null, url: wrapText(h, url)}, [
        {type: 'text', value: wrapText(h, value[1] || text)}
      ])
    )

    if (index !== length - 1) {
      results.push({type: 'text', value: ', '})
    }
  }

  return results
}
