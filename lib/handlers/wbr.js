'use strict'

module.exports = zws

function zws(h, node) {
  return h(node, 'text', '\u200B')
}
