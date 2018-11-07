'use strict'

module.exports = code

var is = require('hast-util-is-element')
var has = require('hast-util-has-property')
var toString = require('hast-util-to-string')
var trim = require('trim-trailing-lines')

var prefix = 'language-'

function code(h, node) {
  var children = node.children
  var length = children.length
  var index = -1
  var child
  var classList
  var className
  var lang

  if (node.tagName === 'pre') {
    while (++index < length) {
      child = children[index]

      if (is(child, 'code') && has(child, 'className')) {
        classList = child.properties.className
        break
      }
    }
  }

  if (classList) {
    length = classList.length
    index = -1

    while (++index < length) {
      className = classList[index]

      if (className.slice(0, prefix.length) === prefix) {
        lang = className.slice(prefix.length)
        break
      }
    }
  }

  return h(node, 'code', {lang: lang || null, meta: null}, trim(toString(node)))
}
