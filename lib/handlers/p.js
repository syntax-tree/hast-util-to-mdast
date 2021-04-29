import {all} from '../all.js'

export function p(h, node) {
  var nodes = all(h, node)

  if (nodes.length > 0) {
    return h(node, 'paragraph', nodes)
  }
}
