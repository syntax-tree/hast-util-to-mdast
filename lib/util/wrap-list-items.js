/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Child} Child
 * @typedef {import('../types.js').MdastListContent} MdastListContent
 */

import {all} from '../all.js'

/**
 * @param {H} h
 * @param {Child} node
 * @returns {Array.<MdastListContent>}
 */
export function wrapListItems(h, node) {
  const children = all(h, node)
  let index = -1

  while (++index < children.length) {
    if (children[index].type !== 'listItem') {
      // @ts-expect-error Assume `children[index]` is block content.
      children[index] = {
        type: 'listItem',
        spread: false,
        checked: null,
        children: [children[index]]
      }
    }
  }

  // @ts-expect-error Assume all `listItem`s
  return children
}
