'use strict'

module.exports = comment

function comment(h, node) {
  return h(node, 'html', '<!--' + node.value + '-->')
}
