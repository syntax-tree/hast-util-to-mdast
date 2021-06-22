/**
 * @typedef {import('../types.js').MdastListContent} MdastListContent
 */

/**
 * @param {Array.<MdastListContent>} children
 * @returns {boolean}
 */
export function listItemsSpread(children) {
  let index = -1

  if (children.length > 1) {
    while (++index < children.length) {
      if (children[index].spread) {
        return true
      }
    }
  }

  return false
}
