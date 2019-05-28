'use strict'

module.exports = wrap

wrap.needed = needed

var extend = require('extend')
var phrasing = require('mdast-util-phrasing')

function wrap(nodes) {
  return runs(nodes, onphrasing)

  function onphrasing(nodes) {
    var head = nodes[0]

    if (
      nodes.length === 1 &&
      head.type === 'text' &&
      (head.value === ' ' || head.value === '\n')
    ) {
      return []
    }

    return {type: 'paragraph', children: nodes}
  }
}

// Wrap all runs of mdast phrasing content in `paragraph` nodes.
function runs(nodes, onphrasing, onnonphrasing) {
  var nonphrasing = onnonphrasing || identity
  var result = []
  var flattened = flatten(nodes)
  var length = flattened.length
  var index = -1
  var node
  var queue

  while (++index < length) {
    node = flattened[index]

    if (phrasing(node)) {
      if (queue === undefined) {
        queue = []
      }

      queue.push(node)
    } else {
      add()
      result = result.concat(nonphrasing(node))
    }
  }

  add()

  return result

  function add() {
    if (queue !== undefined) {
      result = result.concat(onphrasing(queue))
    }

    queue = undefined
  }
}

// Flatten a list of nodes.
function flatten(nodes) {
  var length = nodes.length
  var index = -1
  var flattened = []
  var node

  while (++index < length) {
    node = nodes[index]

    // Straddling: some elements are *weird*.
    // Namely: `map`, `ins`, `del`, and `a`, as they are hybrid elements.
    // See: <https://html.spec.whatwg.org/#paragraphs>.
    // Paragraphs are the weirdest of them all.
    // See the straddling fixture for more info!
    // `ins` is ignored in mdast, so we don’t need to worry about that.
    // `map` maps to its content, so we don’t need to worry about that either.
    // `del` maps to `delete` and `a` to `link`, so we do handle those.
    // What we’ll do is split `node` over each of its children.
    if (
      (node.type === 'delete' || node.type === 'link') &&
      needed(node.children)
    ) {
      flattened = flattened.concat(split(node))
    } else {
      flattened.push(node)
    }
  }

  return flattened
}

// Check if there are non-phrasing mdast nodes returned.
// This is needed if a fragment is given, which could just be a sentence, and
// doesn’t need a wrapper paragraph.
function needed(nodes) {
  var length = nodes.length
  var index = -1
  var node
  var children

  while (++index < length) {
    node = nodes[index]
    children = node.children

    if (!phrasing(node) || (children && needed(children))) {
      return true
    }
  }

  return false
}

function split(node) {
  return runs(node.children, onphrasing, onnonphrasing)

  // Use `child`, add `parent` as its first child, put the original children
  // into `parent`.
  function onnonphrasing(child) {
    var parent = extend(true, {}, shallow(node))
    var copy = shallow(child)

    copy.children = [parent]
    parent.children = child.children

    return copy
  }

  // Use `parent`, put the phrasing run inside it.
  function onphrasing(nodes) {
    var parent = extend(true, {}, shallow(node))
    parent.children = nodes
    return parent
  }
}

// Shallow copy of a node, excluding its children.
function shallow(node) {
  var copy = {}
  var key

  for (key in node) {
    if (key !== 'children') {
      copy[key] = node[key]
    }
  }

  return copy
}

function identity(n) {
  return n
}
