/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Code} Code
 * @typedef {import('../types.js').H} H
 */

import {toText} from 'hast-util-to-text'
import {trimTrailingLines} from 'trim-trailing-lines'
import {wrapText} from '../util/wrap-text.js'

const prefix = 'language-'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Code}
 *   mdast node.
 */
export function code(h, node) {
  const children = node.children
  let index = -1
  /** @type {Array<string | number> | undefined} */
  let classList
  /** @type {string | undefined} */
  let lang

  if (node.tagName === 'pre') {
    while (++index < children.length) {
      const child = children[index]

      if (
        child.type === 'element' &&
        child.tagName === 'code' &&
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

  /** @type {Code} */
  const result = {
    type: 'code',
    lang: lang || null,
    meta: null,
    value: trimTrailingLines(wrapText(h, toText(node)))
  }

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}
