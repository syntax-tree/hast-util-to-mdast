/**
 * @import {State} from 'hast-util-to-mdast'
 * @import {Element} from 'hast'
 * @import {Heading, PhrasingContent} from 'mdast'
 */

import {dropSurroundingBreaks} from '../util/drop-surrounding-breaks.js'

/**
 * Turn a hast `h1` through `h6` element into an mdast heading.
 *
 * @param {State} state
 *   State.
 * @param {Readonly<Element>} node
 *   hast element to transform.
 * @returns {Heading}
 *   mdast node.
 */
export function heading(state, node) {
  const depth = /** @type {Heading['depth']} */ (
    /* c8 ignore next */
    Number(node.tagName.charAt(1)) || 1
  )
  const children = dropSurroundingBreaks(
    /** @type {Array<PhrasingContent>} */ (state.all(node))
  )

  /** @type {Heading} */
  const result = {type: 'heading', depth, children}
  state.patch(node, result)
  return result
}
