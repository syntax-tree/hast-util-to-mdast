export function resolve(h, url) {
  if (url === null || url === undefined) {
    return ''
  }

  // Ignored for older Node
  /* istanbul ignore next */
  if (h.frozenBaseUrl && typeof URL !== 'undefined') {
    return String(new URL(url, h.frozenBaseUrl))
  }

  return url
}
