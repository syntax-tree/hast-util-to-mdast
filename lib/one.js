import {all} from './all.js'
import {own} from './util/own.js'
import {wrapText} from './util/wrap-text.js'

export function one(h, node, parent) {
  var fn

  if (node.type === 'element') {
    if (node.properties && node.properties.dataMdast === 'ignore') {
      return
    }

    if (own.call(h.handlers, node.tagName)) {
      fn = h.handlers[node.tagName]
    }
  } else if (own.call(h.handlers, node.type)) {
    fn = h.handlers[node.type]
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent)
}

function unknown(h, node) {
  if (node.value) {
    return h(node, 'text', wrapText(h, node.value))
  }

  return all(h, node)
}
