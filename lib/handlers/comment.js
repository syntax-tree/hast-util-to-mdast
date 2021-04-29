import {wrapText} from '../util/wrap-text.js'

export function comment(h, node) {
  return h(node, 'html', '<!--' + wrapText(h, node.value) + '-->')
}
