'use strict'

module.exports = toMDAST

var minify = require('rehype-minify-whitespace')
var xtend = require('xtend')
var one = require('./lib/one')
var handlers = require('./lib/handlers')

function toMDAST(tree, options) {
  var settings = options || {}

  h.baseFound = false
  h.frozenBaseURL = null

  h.handlers = xtend(handlers, settings.handlers || {})
  h.augment = augment
  h.document = settings.document

  return one(
    h,
    minify({
      newlines: settings.newlines === true
    })(tree),
    null
  )

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

  /* `right` is the finalized MDAST node,
   * created from `left`, a HAST node */
  function augment(left, right) {
    if (left.position) {
      right.position = left.position
    }

    return right
  }
}
