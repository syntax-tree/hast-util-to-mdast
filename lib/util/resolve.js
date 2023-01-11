/**
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {string | null | undefined} url
 *   Possible URL value.
 * @returns {string}
 *   URL, resolved to a `base` element, if any.
 */
export function resolve(state, url) {
  if (url === null || url === undefined) {
    return ''
  }

  if (state.frozenBaseUrl) {
    return String(new URL(url, state.frozenBaseUrl))
  }

  return url
}
