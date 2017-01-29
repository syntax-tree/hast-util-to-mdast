var u = require('unist-builder')
var xtend = require('xtend')

var one = require('./one')

module.exports = function toMDAST (tree, options) {
  var h = factory(tree, options)
  var node = one(h, tree)

  return node
}

function factory (tree, options) {
  var settings = options || {}
  h.augment = augment

  return h

  function h (node, type, props, children) {
    if (!children && ((typeof props === 'object' && 'length' in props) || typeof props === 'string')) {
      children = props
      props = {}
    }

    var result = augment(node, {type: type})

    if (typeof children === 'string') {
      result.value = children;
    } else if (children) {
      result.children = children;
    }

    return xtend(result, props)
  }

  /* `right` is the finalized MDAST node,
  created from `left`, a HAST node */
  function augment (left, right) {
    var data
    var ctx

    if (left.value) {
      right.value = left.value
    }

    return right
  }
}
