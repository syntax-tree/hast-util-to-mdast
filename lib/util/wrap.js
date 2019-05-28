'use strict'

module.exports = wrap

wrap.needed = needed

var extend = require('extend')
var phrasing = require('mdast-util-phrasing')

// Wrap all runs of mdast phrasing content in `paragraph` nodes.
function wrap(nodes) {
  var result = []
  var length = nodes.length
  var index = -1
  var flattened = []
  var node
  var queue

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

  // Wrap in paragraphs.
  index = -1
  length = flattened.length

  while (++index < length) {
    node = flattened[index]

    if (phrasing(node)) {
      if (queue === undefined) {
        queue = []
      }

      queue.push(node)
    } else {
      flush()
      result.push(node)
    }
  }

  flush()

  return result

  function flush() {
    var head

    if (queue !== undefined) {
      head = queue[0]

      if (
        queue.length !== 1 ||
        head.type !== 'text' ||
        (head.value !== ' ' && head.value !== '\n')
      ) {
        result.push({type: 'paragraph', children: queue})
      }
    }

    queue = undefined
  }
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

// Split `node` over each of its children.
function split(node) {
  var children = node.children
  var length = children.length
  var index = -1
  var result = []
  var child
  var copy
  var parent

  while (++index < length) {
    child = children[index]
    parent = extend(true, {}, shallow(node))

    if (phrasing(child)) {
      // Use `parent`, put `child` inside it.
      parent.children = [shallow(child)]
      result[index] = parent
    } else {
      // Use `child`, add `parent` as its first child, put the original children
      // into `parent`.
      parent.children = child.children
      copy = shallow(child)
      copy.children = [parent]
      result[index] = copy
    }
  }

  return result
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
