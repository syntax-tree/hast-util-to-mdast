/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').Text} Text
 * @typedef {import('mdast').Link} Link
 * @typedef {import('mdast').Image} Image
 * @typedef {import('../types.js').State} State
 * @typedef {import('../util/find-selected-options.js').Options} Options
 */

import {findSelectedOptions} from '../util/find-selected-options.js'
import {resolve} from '../util/resolve.js'
import {wrapText} from '../util/wrap-text.js'

const defaultChecked = '[x]'
const defaultUnchecked = '[ ]'

/**
 * @param {State} state
 *   State.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Text | Image | Array<Link | Text> | void}
 *   mdast node.
 */
// eslint-disable-next-line complexity
export function input(state, node) {
  const properties = node.properties || {}
  const value = String(properties.value || properties.placeholder || '')

  if (
    properties.disabled ||
    properties.type === 'hidden' ||
    properties.type === 'file'
  ) {
    return
  }

  if (properties.type === 'checkbox' || properties.type === 'radio') {
    /** @type {Text} */
    const result = {
      type: 'text',
      value: wrapText(
        state,
        properties.checked
          ? state.options.checked || defaultChecked
          : state.options.unchecked || defaultUnchecked
      )
    }
    state.patch(node, result)
    return result
  }

  if (properties.type === 'image') {
    const alt = properties.alt || value

    if (alt) {
      /** @type {Image} */
      const result = {
        type: 'image',
        url: resolve(state, String(properties.src || '') || null),
        title: wrapText(state, String(properties.title || '')) || null,
        alt: wrapText(state, String(alt))
      }
      state.patch(node, result)
      return result
    }

    return
  }

  /** @type {Options} */
  let values = []

  if (value) {
    values = [[value, undefined]]
  } else if (
    // `list` is not supported on these types:
    properties.type !== 'password' &&
    properties.type !== 'file' &&
    properties.type !== 'submit' &&
    properties.type !== 'reset' &&
    properties.type !== 'button' &&
    properties.list
  ) {
    const list = String(properties.list).toUpperCase()
    const datalist = list in state.nodeById ? state.nodeById[list] : undefined

    if (datalist && datalist.tagName === 'datalist') {
      values = findSelectedOptions(state, datalist, properties)
    }
  }

  if (values.length === 0) {
    return
  }

  // Hide password value.
  if (properties.type === 'password') {
    // Passwords don’t support `list`.
    values[0] = ['•'.repeat(values[0][0].length), undefined]
  }

  if (properties.type === 'url' || properties.type === 'email') {
    /** @type {Array<Link | Text>} */
    const results = []
    let index = -1

    while (++index < values.length) {
      const value = resolve(state, values[index][0])
      /** @type {Link} */
      const result = {
        type: 'link',
        title: null,
        url: wrapText(
          state,
          properties.type === 'email' ? 'mailto:' + value : value
        ),
        children: [
          {type: 'text', value: wrapText(state, values[index][1] || value)}
        ]
      }

      results.push(result)

      if (index !== values.length - 1) {
        results.push({type: 'text', value: ', '})
      }
    }

    return results
  }

  /** @type {Array<string>} */
  const texts = []
  let index = -1

  while (++index < values.length) {
    texts.push(
      values[index][1]
        ? values[index][1] + ' (' + values[index][0] + ')'
        : values[index][0]
    )
  }

  /** @type {Text} */
  const result = {type: 'text', value: wrapText(state, texts.join(', '))}
  state.patch(node, result)
  return result
}
