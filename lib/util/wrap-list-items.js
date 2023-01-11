/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').ListContent} ListContent
 * @typedef {import('../state.js').State} State
 */

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   Element to transform.
 * @returns {Array<ListContent>}
 *   List items.
 */
export function wrapListItems(state, node) {
  const nodes = state.all(node)
  /** @type {Array<ListContent>} */
  const results = []
  let index = -1

  while (++index < nodes.length) {
    const child = nodes[index]

    if (child.type === 'listItem') {
      results.push(child)
    } else {
      results.push({
        type: 'listItem',
        spread: false,
        checked: null,
        // @ts-expect-error Assume `child` is block content.
        children: [child]
      })
    }
  }

  return results
}
