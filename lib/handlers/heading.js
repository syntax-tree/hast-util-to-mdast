import {all} from '../all.js'

export function heading(h, node) {
  // `else` shouldn’t happen, of course…
  /* c8 ignore next */
  var depth = Number(node.tagName.charAt(1)) || 1
  var wrap = h.wrapText
  var result

  h.wrapText = false
  result = h(node, 'heading', {depth}, all(h, node))
  h.wrapText = wrap

  return result
}
