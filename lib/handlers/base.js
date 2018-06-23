'use strict'

module.exports = base

function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseURL = node.properties.href || null
    h.baseFound = true
  }
}
