'use strict'

module.exports = zws

function zws(h, node) {
  return h.augment(node, {type: 'text', value: '\u200B'})
}
