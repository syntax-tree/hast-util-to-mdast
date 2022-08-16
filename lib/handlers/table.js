/**
 * @typedef {import('../types.js').Handle} Handle
 * @typedef {import('../types.js').Element} Element
 * @typedef {import('../types.js').MdastNode} MdastNode
 * @typedef {import('../types.js').MdastTableContent} MdastTableContent
 * @typedef {import('../types.js').MdastRowContent} MdastRowContent
 * @typedef {import('../types.js').MdastPhrasingContent} MdastPhrasingContent
 *
 * @typedef Info
 * @property {Array<string|null>} align
 * @property {boolean} headless
 */

import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {visit, SKIP} from 'unist-util-visit'
import {wrapText} from '../util/wrap-text.js'
import {all} from '../all.js'

const thead = convertElement('thead')
const tr = convertElement('tr')
const cell = convertElement(['th', 'td'])

/**
 * @type {Handle}
 * @param {Element} node
 */
export function table(h, node) {
  if (h.inTable) {
    return h(node, 'text', wrapText(h, toText(node)))
  }

  h.inTable = true

  const {headless, align} = inspect(node)
  const rows = toRows(all(h, node), headless)
  let columns = 1
  let rowIndex = -1

  while (++rowIndex < rows.length) {
    const cells = rows[rowIndex].children
    let cellIndex = -1

    while (++cellIndex < cells.length) {
      const cell = cells[cellIndex]

      if (cell.data) {
        const colSpan = Number.parseInt(String(cell.data.colSpan), 10) || 1
        const rowSpan = Number.parseInt(String(cell.data.rowSpan), 10) || 1

        if (colSpan > 1 || rowSpan > 1) {
          let otherRowIndex = rowIndex - 1

          while (++otherRowIndex < rowIndex + rowSpan) {
            let colIndex = cellIndex - 1

            while (++colIndex < cellIndex + colSpan) {
              if (!rows[otherRowIndex]) {
                // Don’t add rows that don’t exist.
                // Browsers don’t render them either.
                break
              }

              /** @type {Array<MdastRowContent>} */
              const newCells = []

              if (otherRowIndex !== rowIndex || colIndex !== cellIndex) {
                newCells.push({type: 'tableCell', children: []})
              }

              rows[otherRowIndex].children.splice(colIndex, 0, ...newCells)
            }
          }
        }

        // Clean the data fields.
        if ('colSpan' in cell.data) delete cell.data.colSpan
        if ('rowSpan' in cell.data) delete cell.data.rowSpan
        if (Object.keys(cell.data).length === 0) delete cell.data
      }
    }

    if (cells.length > columns) columns = cells.length
  }

  // Add extra empty cells.
  rowIndex = -1

  while (++rowIndex < rows.length) {
    const cells = rows[rowIndex].children
    let cellIndex = cells.length - 1
    while (++cellIndex < columns) {
      cells.push({type: 'tableCell', children: []})
    }
  }

  let alignIndex = align.length - 1
  while (++alignIndex < columns) {
    align.push(null)
  }

  h.inTable = false

  return h(node, 'table', {align}, rows)
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
  /** @type {Array<string|null>} */
  const align = [null]

  visit(node, 'element', (child) => {
    if (child.tagName === 'table' && node !== child) {
      return SKIP
    }

    // If there is a `thead`, assume there is a header row.
    if (cell(child) && child.properties) {
      if (!align[cellIndex]) {
        align[cellIndex] = String(child.properties.align || '') || null
      }

      // If there is a th in the first row, assume there is a header row.
      if (headless && rowIndex < 2 && child.tagName === 'th') {
        headless = false
      }

      cellIndex++
    } else if (thead(child)) {
      headless = false
    } else if (tr(child)) {
      rowIndex++
      cellIndex = 0
    }
  })

  return {align, headless}
}

/**
 * Ensure the rows are properly structured.
 *
 * @param {Array<MdastNode>} children
 * @param {boolean} headless
 * @returns {Array<MdastTableContent>}
 */
function toRows(children, headless) {
  let index = -1
  /** @type {Array<MdastTableContent>} */
  const nodes = []
  /** @type {Array<MdastRowContent>|undefined} */
  let queue

  // Add an empty header row.
  if (headless) {
    nodes.push({type: 'tableRow', children: []})
  }

  while (++index < children.length) {
    const node = children[index]

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
    nodes[index].children = toCells(nodes[index].children)
  }

  return nodes
}

/**
 * Ensure the cells in a row are properly structured.
 *
 * @param {Array<MdastNode>} children
 * @returns {Array<MdastRowContent>}
 */
function toCells(children) {
  /** @type {Array<MdastRowContent>} */
  const nodes = []
  let index = -1
  /** @type {MdastNode} */
  let node
  /** @type {Array<MdastPhrasingContent>|undefined} */
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

  return nodes
}
