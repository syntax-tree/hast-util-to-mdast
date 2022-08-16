/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').Properties} Properties
 * @typedef {import('../types.js').MdastNode} MdastNode
 */

import {convertElement} from 'hast-util-is-element'
import {findSelectedOptions} from '../util/find-selected-options.js'
import {own} from '../util/own.js'
import {resolve} from '../util/resolve.js'
import {wrapText} from '../util/wrap-text.js'

const datalist = convertElement('datalist')

/**
 * @type {Handle}
 * @param {Element} node
 */
// eslint-disable-next-line complexity
export function input(h, node) {
  /** @type {Properties} */
  // @ts-expect-error: `props` are defined.
  const props = node.properties
  let value = String(props.value || props.placeholder || '')
  /** @type {Array<MdastNode>} */
  const results = []
  /** @type {Array<string>} */
  const texts = []
  /** @type {Array<[string, string|null]>} */
  let values = []
  let index = -1
  /** @type {string} */
  let list

  if (props.disabled || props.type === 'hidden' || props.type === 'file') {
    return
  }

  if (props.type === 'checkbox' || props.type === 'radio') {
    return h(
      node,
      'text',
      wrapText(h, h[props.checked ? 'checked' : 'unchecked'])
    )
  }

  if (props.type === 'image') {
    return props.alt || value
      ? h(node, 'image', {
          url: resolve(h, String(props.src || '') || null),
          title: wrapText(h, String(props.title || '')) || null,
          alt: wrapText(h, String(props.alt || value))
        })
      : []
  }

  if (value) {
    values = [[value, null]]
  } else if (
    // `list` is not supported on these types:
    props.type !== 'password' &&
    props.type !== 'file' &&
    props.type !== 'submit' &&
    props.type !== 'reset' &&
    props.type !== 'button' &&
    props.list
  ) {
    list = String(props.list).toUpperCase()

    if (own.call(h.nodeById, list) && datalist(h.nodeById[list])) {
      values = findSelectedOptions(h, h.nodeById[list], props)
    }
  }

  if (values.length === 0) {
    return
  }

  // Hide password value.
  if (props.type === 'password') {
    // Passwords don’t support `list`.
    values[0] = ['•'.repeat(values[0][0].length), null]
  }

  if (props.type === 'url' || props.type === 'email') {
    while (++index < values.length) {
      value = resolve(h, values[index][0])

      results.push(
        h(
          node,
          'link',
          {
            title: null,
            url: wrapText(h, props.type === 'email' ? 'mailto:' + value : value)
          },
          [{type: 'text', value: wrapText(h, values[index][1] || value)}]
        )
      )

      if (index !== values.length - 1) {
        results.push({type: 'text', value: ', '})
      }
    }

    return results
  }

  while (++index < values.length) {
    texts.push(
      values[index][1]
        ? values[index][1] + ' (' + values[index][0] + ')'
        : values[index][0]
    )
  }

  return h(node, 'text', wrapText(h, texts.join(', ')))
}
