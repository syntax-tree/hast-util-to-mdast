/**
 * @typedef {import('hast').Element} Element
 * @typedef {import('mdast').AlignType} AlignType
 * @typedef {import('mdast').Content} Content
 * @typedef {import('mdast').PhrasingContent} PhrasingContent
 * @typedef {import('mdast').RowContent} RowContent
 * @typedef {import('mdast').Table} Table
 * @typedef {import('mdast').TableContent} TableContent
 * @typedef {import('mdast').Text} Text
 * @typedef {import('../types.js').H} H
 *
 * @typedef Info
 *   Inferred info on a table.
 * @property {Array<AlignType>} align
 *   Alignment.
 * @property {boolean} headless
 *   Whether a `thead` is missing.
 */

import {toText} from 'hast-util-to-text'
import {visit, SKIP} from 'unist-util-visit'
import {wrapText} from '../util/wrap-text.js'
import {all} from '../all.js'

/**
 * @param {H} h
 *   Context.
 * @param {Element} node
 *   hast element to transform.
 * @returns {Table | Text}
 *   mdast node.
 */
// eslint-disable-next-line complexity
export function table(h, node) {
  // Ignore nested tables.
  if (h.inTable) {
    /** @type {Text} */
    const result = {type: 'text', value: wrapText(h, toText(node))}

    // To do: clean.
    if (node.position) {
      result.position = node.position
    }

    return result
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
        const colSpan =
          Number.parseInt(
            String(cell.data.hastUtilToMdastTemporaryColSpan),
            10
          ) || 1
        const rowSpan =
          Number.parseInt(
            String(cell.data.hastUtilToMdastTemporaryRowSpan),
            10
          ) || 1

        if (colSpan > 1 || rowSpan > 1) {
          let otherRowIndex = rowIndex - 1

          // eslint-disable-next-line max-depth
          while (++otherRowIndex < rowIndex + rowSpan) {
            let colIndex = cellIndex - 1

            // eslint-disable-next-line max-depth
            while (++colIndex < cellIndex + colSpan) {
              // eslint-disable-next-line max-depth
              if (!rows[otherRowIndex]) {
                // Don’t add rows that don’t exist.
                // Browsers don’t render them either.
                break
              }

              /** @type {Array<RowContent>} */
              const newCells = []

              // eslint-disable-next-line max-depth
              if (otherRowIndex !== rowIndex || colIndex !== cellIndex) {
                newCells.push({type: 'tableCell', children: []})
              }

              rows[otherRowIndex].children.splice(colIndex, 0, ...newCells)
            }
          }
        }

        // Clean the data fields.
        if ('hastUtilToMdastTemporaryColSpan' in cell.data)
          delete cell.data.hastUtilToMdastTemporaryColSpan
        if ('hastUtilToMdastTemporaryRowSpan' in cell.data)
          delete cell.data.hastUtilToMdastTemporaryRowSpan
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

  /** @type {Table} */
  const result = {type: 'table', align, children: rows}

  // To do: clean.
  if (node.position) {
    result.position = node.position
  }

  return result
}

/**
 * Infer whether the HTML table has a head and how it aligns.
 *
 * @param {Element} node
 *   Table element to check.
 * @returns {Info}
 *   Info.
 */
function inspect(node) {
  /** @type {Info} */
  const info = {align: [null], headless: true}
  let rowIndex = 0
  let cellIndex = 0

  visit(node, 'element', (child) => {
    // Don’t enter nested tables.
    if (child.tagName === 'table' && node !== child) {
      return SKIP
    }

    if (
      (child.tagName === 'th' || child.tagName === 'td') &&
      child.properties
    ) {
      if (!info.align[cellIndex]) {
        const value = String(child.properties.align || '') || null

        if (
          value === null ||
          value === 'left' ||
          value === 'center' ||
          value === 'right'
        ) {
          info.align[cellIndex] = value
        }
      }

      // If there is a `th` in the first row, assume there is a header row.
      if (info.headless && rowIndex < 2 && child.tagName === 'th') {
        info.headless = false
      }

      cellIndex++
    }
    // If there is a `thead`, assume there is a header row.
    else if (child.tagName === 'thead') {
      info.headless = false
    } else if (child.tagName === 'tr') {
      rowIndex++
      cellIndex = 0
    }
  })

  return info
}

/**
 * Ensure the rows are properly structured.
 *
 * @param {Array<Content>} children
 * @param {boolean} headless
 * @returns {Array<TableContent>}
 */
function toRows(children, headless) {
  /** @type {Array<TableContent>} */
  const nodes = []
  /** @type {Array<RowContent>} */
  let queue = []
  let index = -1

  // Add an empty header row.
  if (headless) {
    nodes.push({type: 'tableRow', children: []})
  }

  while (++index < children.length) {
    const node = children[index]

    if (node.type === 'tableRow') {
      if (queue.length > 0) {
        node.children.unshift(...queue)
        queue = []
      }

      nodes.push(node)
    } else {
      // @ts-expect-error Assume row content.
      queue.push(node)
    }
  }

  if (queue.length > 0) {
    nodes[nodes.length - 1].children.push(...queue)
    queue = []
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
 * @param {Array<Content>} children
 * @returns {Array<RowContent>}
 */
function toCells(children) {
  /** @type {Array<RowContent>} */
  const nodes = []
  /** @type {Array<PhrasingContent>} */
  let queue = []
  let index = -1

  while (++index < children.length) {
    const node = children[index]

    if (node.type === 'tableCell') {
      if (queue.length > 0) {
        node.children.unshift(...queue)
        queue = []
      }

      nodes.push(node)
    } else {
      // @ts-expect-error Assume phrasing content.
      queue.push(node)
    }
  }

  if (queue.length > 0) {
    let node = nodes[nodes.length - 1]

    if (!node) {
      node = {type: 'tableCell', children: []}
      nodes.push(node)
    }

    node.children.push(...queue)
    queue = []
  }

  return nodes
}
