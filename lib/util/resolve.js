'use strict'

module.exports = resolve

function resolve(h, url) {
  if (url === null || url === undefined) {
    return ''
  }

  if (h.frozenBaseURL && typeof URL !== 'undefined') {
    return String(new URL(url, h.frozenBaseURL))
  }

  return url
}
