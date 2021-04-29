import {own} from './own.js'

// Shallow copy of a node, excluding its children.
export function shallow(node) {
  var copy = {}
  var key

  for (key in node) {
    if (own.call(node, key) && key !== 'children') {
      copy[key] = node[key]
    }
  }

  return copy
}
