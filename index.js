'use strict'

module.exports = toMdast

var minify = require('rehype-minify-whitespace')
var visit = require('unist-util-visit')
var xtend = require('xtend')
var one = require('./lib/one')
var handlers = require('./lib/handlers')

function toMdast(tree, options) {
  var settings = options || {}
  var byId = {}

  h.nodeById = byId
  h.baseFound = false
  h.frozenBaseUrl = null
  h.wrapText = true
  h.qNesting = 0

  h.handlers = xtend(handlers, settings.handlers || {})
  h.augment = augment

  h.document = settings.document
  h.checked = settings.checked || '[x]'
  h.unchecked = settings.unchecked || '[ ]'
  h.quotes = settings.quotes || ['"']

  visit(tree, onvisit)

  minify({newlines: settings.newlines === true})(tree)

  return one(h, tree, null)

  function h(node, type, props, children) {
    var result

    if (
      !children &&
      (typeof props === 'string' ||
        (typeof props === 'object' && 'length' in props))
    ) {
      children = props
      props = {}
    }

    result = xtend({type: type}, props)

    if (typeof children === 'string') {
      result.value = children
    } else if (children) {
      result.children = children
    }

    return augment(node, result)
  }

  // To do: inline in a future major.
  // `right` is the finalized mdast node, created from `left`, a hast node.
  function augment(left, right) {
    if (left.position) {
      right.position = left.position
    }

    return right
  }

  function onvisit(node) {
    var props = node.properties || {}
    var id = props.id

    if (id && !(id in node)) {
      byId[id] = node
    }
  }
}
