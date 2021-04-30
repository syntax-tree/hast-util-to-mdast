/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 */

import {hasProperty} from 'hast-util-has-property'
import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {trimTrailingLines} from 'trim-trailing-lines'
import {wrapText} from '../util/wrap-text.js'

var prefix = 'language-'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'pre'}>} */
var pre = convertElement('pre')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'code'}>} */
var isCode = convertElement('code')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function code(h, node) {
  var children = node.children
  var index = -1
  /** @type {Array.<string|number>} */
  var classList
  /** @type {string} */
  var lang
  /** @type {ElementChild} */
  var child

  if (pre(node)) {
    while (++index < children.length) {
      child = children[index]

      if (
        isCode(child) &&
        hasProperty(child, 'className') &&
        Array.isArray(child.properties.className)
      ) {
        classList = child.properties.className
        break
      }
    }
  }

  if (Array.isArray(classList)) {
    index = -1

    while (++index < classList.length) {
      if (String(classList[index]).slice(0, prefix.length) === prefix) {
        lang = String(classList[index]).slice(prefix.length)
        break
      }
    }
  }

  return h(
    node,
    'code',
    {lang: lang || null, meta: null},
    trimTrailingLines(wrapText(h, toText(node)))
  )
}
