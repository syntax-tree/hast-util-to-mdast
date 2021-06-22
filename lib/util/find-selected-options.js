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

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'option'}>} */
const option = convertElement('option')

/**
 * @param {H} h
 * @param {Element} node
 * @param {Properties} [properties]
 * @returns {Array.<[string, string|null]>}
 */
export function findSelectedOptions(h, node, properties) {
  const props = properties || node.properties
  let options = findOptions(node)
  const size =
    Math.min(Number.parseInt(String(props.size), 10), 0) ||
    (props.multiple ? 4 : 1)
  let index = -1
  /** @type {Array.<Element>} */
  const selectedOptions = []
  /** @type {Array.<[string, string|null]>} */
  const values = []
  /** @type {Element} */
  let option
  /** @type {string} */
  let content
  /** @type {string} */
  let label
  /** @type {string} */
  let value

  while (++index < options.length) {
    if (hasProperty(options[index], 'selected')) {
      selectedOptions.push(options[index])
    }
  }

  const list = selectedOptions.length > 0 ? selectedOptions : options
  options = list.slice(0, size)
  index = -1

  while (++index < options.length) {
    option = options[index]
    content = wrapText(h, toText(option))
    label = content || String(option.properties.label || '')
    value = String(option.properties.value || '') || content

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
  /** @type {Array.<Element>} */
  let results = []
  /** @type {Child} */
  let child

  while (++index < children.length) {
    child = children[index]

    if (Array.isArray(child.children)) {
      // @ts-ignore Looks like a parent.
      results = results.concat(findOptions(child))
    }

    if (option(child) && !hasProperty(child, 'disabled')) {
      results.push(child)
    }
  }

  return results
}
