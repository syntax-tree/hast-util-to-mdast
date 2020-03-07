'use strict'

module.exports = heading

var all = require('../all')

function heading(h, node) {
  var rank = Number(node.tagName.charAt(1))
  var wrap = h.wrapText
  var result

  /* istanbul ignore next - `else` shouldn’t happen, of course… */
  rank = rank || 1

  h.wrapText = false
  result = h(node, 'heading', {depth: rank}, all(h, node))
  h.wrapText = wrap

  return result
}
