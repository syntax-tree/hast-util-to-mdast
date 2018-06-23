'use strict'

module.exports = resolve

function resolve(h, url) {
  if (url === null || url === undefined) {
    return ''
  }

  return h.frozenBaseURL ? String(new URL(url, h.frozenBaseURL)) : url
}
