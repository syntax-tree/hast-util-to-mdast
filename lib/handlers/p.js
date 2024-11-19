/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Paragraph, PhrasingContent} from 'mdast'
 */

/**
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Paragraph | undefined}
 *   mdast node.
 */
export function p(state, node) {
  // Allow potentially “invalid” nodes, they might be unknown.
  // We also support straddling later.
  const children = /** @type {Array<PhrasingContent>} */ (state.all(node))

  if (children.length > 0) {
    /** @type {Paragraph} */
    const result = {type: 'paragraph', children}
    state.patch(node, result)
    return result
  }
}
