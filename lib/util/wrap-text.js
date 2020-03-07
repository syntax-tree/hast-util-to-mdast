'use strict'

module.exports = wrapText

var re = /\r?\n|\r/g

function wrapText(h, value) {
  return h.wrapText ? value : value.replace(re, ' ')
}
