/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 */

/**
 * Handle a hast `base` element: use the first one’s `href` as base URL.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {undefined}
 *   Nothing.
 */
export function base(state, node) {
  if (!state.baseFound) {
    state.frozenBaseUrl =
      String((node.properties && node.properties.href) || '') || undefined
    state.baseFound = true
  }
}
