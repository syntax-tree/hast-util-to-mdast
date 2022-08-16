/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').ElementChild} ElementChild
 */

import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {trimTrailingLines} from 'trim-trailing-lines'
import {wrapText} from '../util/wrap-text.js'

const prefix = 'language-'

const pre = convertElement('pre')
const isCode = convertElement('code')

/**
 * @type {Handle}
 * @param {Element} node
 */
export function code(h, node) {
  const children = node.children
  let index = -1
  /** @type {Array<string|number>|undefined} */
  let classList
  /** @type {string|undefined} */
  let lang

  if (pre(node)) {
    while (++index < children.length) {
      const child = children[index]

      if (
        isCode(child) &&
        child.properties &&
        child.properties.className &&
        Array.isArray(child.properties.className)
      ) {
        classList = child.properties.className
        break
      }
    }
  }

  if (classList) {
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
