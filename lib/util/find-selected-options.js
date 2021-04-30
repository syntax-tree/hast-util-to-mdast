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
var option = convertElement('option')

/**
 * @param {H} h
 * @param {Element} node
 * @param {Properties} [properties]
 * @returns {Array.<[string, string|null]>}
 */
export function findSelectedOptions(h, node, properties) {
  var props = properties || node.properties
  var options = findOptions(node)
  var size =
    Math.min(Number.parseInt(String(props.size), 10), 0) ||
    (props.multiple ? 4 : 1)
  var index = -1
  /** @type {Array.<Element>} */
  var selectedOptions = []
  /** @type {Array.<[string, string|null]>} */
  var values = []
  /** @type {Element} */
  var option
  /** @type {Array.<Element>} */
  var list
  /** @type {string} */
  var content
  /** @type {string} */
  var label
  /** @type {string} */
  var value

  while (++index < options.length) {
    if (hasProperty(options[index], 'selected')) {
      selectedOptions.push(options[index])
    }
  }

  list = selectedOptions.length > 0 ? selectedOptions : options
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
  var children = node.children
  var index = -1
  /** @type {Array.<Element>} */
  var results = []
  /** @type {Child} */
  var child

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
