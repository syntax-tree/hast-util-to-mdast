/**
 * @typedef {import('../types.js').H} H
 * @typedef {import('../types.js').Parent} Parent
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Child} Child
 * @typedef {import('../types.js').Properties} Properties
 */

import {hasProperty} from 'hast-util-has-property'
import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {wrapText} from './wrap-text.js'

const option = convertElement('option')

/**
 * @param {H} h
 * @param {Element} node
 * @param {Properties} [properties]
 * @returns {Array<[string, string|null]>}
 */
export function findSelectedOptions(h, node, properties) {
  /** @type {Properties} */
  // @ts-expect-error: `props` exist.
  const props = properties || node.properties
  let options = findOptions(node)
  const size =
    Math.min(Number.parseInt(String(props.size), 10), 0) ||
    (props.multiple ? 4 : 1)
  let index = -1
  /** @type {Array<Element>} */
  const selectedOptions = []
  /** @type {Array<[string, string|null]>} */
  const values = []

  while (++index < options.length) {
    if (hasProperty(options[index], 'selected')) {
      selectedOptions.push(options[index])
    }
  }

  const list = selectedOptions.length > 0 ? selectedOptions : options
  options = list.slice(0, size)
  index = -1

  while (++index < options.length) {
    const option = options[index]
    const content = wrapText(h, toText(option))
    /** @type {Properties} */
    // @ts-expect-error: `props` exist.
    const props = option.properties
    const label = content || String(props.label || '')
    const value = String(props.value || '') || content
    values.push([value, label === value ? null : label])
  }

  return values
}

/**
 * @param {Parent} node
 */
function findOptions(node) {
  const children = node.children
  let index = -1
  /** @type {Array<Element>} */
  let results = []
  /** @type {Child} */
  let child

  while (++index < children.length) {
    child = children[index]

    // @ts-expect-error Looks like a parent.
    if (Array.isArray(child.children)) {
      // @ts-expect-error Looks like a parent.
      results = results.concat(findOptions(child))
    }

    if (option(child) && !hasProperty(child, 'disabled')) {
      results.push(child)
    }
  }

  return results
}
