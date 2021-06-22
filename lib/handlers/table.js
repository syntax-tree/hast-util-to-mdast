/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} MdastNode
 * @typedef {import('../types.js').MdastTableContent} MdastTableContent
 * @typedef {import('../types.js').MdastRowContent} MdastRowContent
 * @typedef {import('../types.js').MdastPhrasingContent} MdastPhrasingContent
 *
 * @typedef Info
 * @property {Array.<string|null>} align
 * @property {boolean} headless
 */

import {convertElement} from 'hast-util-is-element'
import {visit} from 'unist-util-visit'
import {all} from '../all.js'

/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'thead'}>} */
const thead = convertElement('thead')
/** @type {import('unist-util-is').AssertPredicate<Element & {tagName: 'tr'}>} */
const tr = convertElement('tr')
const cell = convertElement(['th', 'td'])

/**
 * @type {Handle}
 * @param {Element} node
 */
export function table(h, node) {
  const info = inspect(node)
  return h(node, 'table', {align: info.align}, toRows(all(h, node), info))
}

/**
 * Infer whether the HTML table has a head and how it aligns.
 *
 * @param {Element} node
 * @returns {Info}
 */
function inspect(node) {
  let headless = true
  let rowIndex = 0
  let cellIndex = 0
  /** @type {Array.<string|null>} */
  const align = [null]

  visit(node, 'element', visitor)

  return {align, headless}

  /** @type {import('unist-util-visit').Visitor<Element>} */
  function visitor(child) {
    // If there is a `thead`, assume there is a header row.
    if (thead(child)) {
      headless = false
    } else if (tr(child)) {
      rowIndex++
      cellIndex = 0
    } else if (cell(child)) {
      if (!align[cellIndex]) {
        // @ts-expect-error: `props` are defined.
        align[cellIndex] = String(child.properties.align || '') || null
      }

      // If there is a th in the first row, assume there is a header row.
      if (headless && rowIndex < 2 && child.tagName === 'th') {
        headless = false
      }

      cellIndex++
    }
  }
}

/**
 * Ensure the rows are properly structured.
 *
 * @param {Array.<MdastNode>} children
 * @param {Info} info
 * @returns {Array.<MdastTableContent>}
 */
function toRows(children, info) {
  /** @type {Array.<MdastTableContent>} */
  const nodes = []
  let index = -1
  /** @type {MdastNode} */
  let node
  /** @type {Array.<MdastRowContent>|undefined} */
  let queue

  // Add an empty header row.
  if (info.headless) {
    nodes.push({type: 'tableRow', children: []})
  }

  while (++index < children.length) {
    node = children[index]

    if (node.type === 'tableRow') {
      if (queue) {
        node.children.unshift(...queue)
        queue = undefined
      }

      nodes.push(node)
    } else {
      if (!queue) queue = []
      // @ts-expect-error Assume row content.
      queue.push(node)
    }
  }

  if (queue) {
    nodes[nodes.length - 1].children.push(...queue)
  }

  index = -1

  while (++index < nodes.length) {
    nodes[index].children = toCells(nodes[index].children, info)
  }

  return nodes
}

/**
 * Ensure the cells in a row are properly structured.
 *
 * @param {Array.<MdastNode>} children
 * @param {Info} info
 * @returns {Array.<MdastRowContent>}
 */
function toCells(children, info) {
  /** @type {Array.<MdastRowContent>} */
  const nodes = []
  let index = -1
  /** @type {MdastNode} */
  let node
  /** @type {Array.<MdastPhrasingContent>|undefined} */
  let queue

  while (++index < children.length) {
    node = children[index]

    if (node.type === 'tableCell') {
      if (queue) {
        node.children.unshift(...queue)
        queue = undefined
      }

      nodes.push(node)
    } else {
      if (!queue) queue = []
      // @ts-expect-error Assume phrasing content.
      queue.push(node)
    }
  }

  if (queue) {
    node = nodes[nodes.length - 1]

    if (!node) {
      node = {type: 'tableCell', children: []}
      nodes.push(node)
    }

    node.children.push(...queue)
  }

  index = nodes.length - 1

  while (++index < info.align.length) {
    nodes.push({type: 'tableCell', children: []})
  }

  return nodes
}
