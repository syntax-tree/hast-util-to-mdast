/**
 * @typedef {import('hast').Element} Element
 *
 * @typedef {import('../state.js').State} State
 */

// Fix to let VS Code see references to the above types.
''

/**
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
