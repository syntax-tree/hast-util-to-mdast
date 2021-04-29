import {all} from '../all.js'

export function tableCell(h, node) {
  var wrap = h.wrapText
  var result

  h.wrapText = false
  result = h(node, 'tableCell', all(h, node))
  h.wrapText = wrap

  return result
}
