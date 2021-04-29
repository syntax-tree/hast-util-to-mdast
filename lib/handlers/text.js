import {wrapText} from '../util/wrap-text.js'

export function text(h, node) {
  return h(node, 'text', wrapText(h, node.value))
}
