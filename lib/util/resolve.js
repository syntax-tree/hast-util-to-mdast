/**
 * @typedef {import('../types.js').H} H
 */

/**
 * @param {H} h
 *   Context.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
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
