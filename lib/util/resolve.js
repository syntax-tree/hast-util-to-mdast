/**
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 * @param {string|null|undefined} url
 * @returns {string}
 */
export function resolve(h, url) {
  if (url === null || url === undefined) {
    return ''
  }

  if (h.frozenBaseUrl) {
    return String(new URL(url, h.frozenBaseUrl))
  }

  return url
}
