/**
 * @import {Options as CollapseOptions} from 'collapse-white-space'
 * @import {Element} from 'hast'
 */

/**
 * @typedef {[string, Value]} Option
 *   Option, where the item at `0` is the label, the item at `1` the value.
 *
 * @typedef {Array<Option>} Options
 *   List of options.
 *
 * @typedef {string | undefined} Value
 *   `value` field of option.
 */

import {collapseWhiteSpace} from 'collapse-white-space'
import {toText} from 'hast-util-to-text'

/** @type {CollapseOptions} */
const collapseOptions = {style: 'html', trim: true}

/**
 * Find the selected options of a hast `datalist` or `select` element.
 *
 * @param {Readonly<Element>} node
 *   hast element to inspect.
 * @param {unknown} multiple
 *   Whether several options can be selected.
 * @param {unknown} [size]
 *   Number of visible rows.
 * @returns {Options}
 *   Options.
 */
export function findSelectedOptions(node, multiple, size) {
  const options = findOptions(node)
  /** @type {Array<Element>} */
  let list = []
  /** @type {Options} */
  const values = []
  let index = -1

  while (++index < options.length) {
    const option = options[index]

    if (option.properties && option.properties.selected) {
      list.push(option)
    }
  }

  // See: <https://html.spec.whatwg.org/multipage/form-elements.html#selectedness-setting-algorithm>.
  if (!multiple) {
    list = list.slice(-1)

    if (list.length === 0 && !(Number.parseInt(String(size), 10) > 1)) {
      list = options.slice(0, 1)
    }
  }

  index = -1

  while (++index < list.length) {
    const option = list[index]
    const properties = option.properties || {}
    const content = collapseWhiteSpace(toText(option), collapseOptions)
    const label =
      content ||
      collapseWhiteSpace(String(properties.label || ''), collapseOptions)
    const value =
      collapseWhiteSpace(String(properties.value || ''), collapseOptions) ||
      content
    values.push([value, label === value ? undefined : label])
  }

  return values
}

/**
 * Find the `option` elements in a hast parent.
 *
 * @param {Element} node
 *   Parent to find in.
 * @returns {Array<Element>}
 *   Option elements.
 */
function findOptions(node) {
  /** @type {Array<Element>} */
  const results = []
  let index = -1

  while (++index < node.children.length) {
    const child = node.children[index]

    if ('children' in child && Array.isArray(child.children)) {
      results.push(...findOptions(child))
    }

    if (
      child.type === 'element' &&
      child.tagName === 'option' &&
      (!child.properties || !child.properties.disabled)
    ) {
      results.push(child)
    }
  }

  return results
}
