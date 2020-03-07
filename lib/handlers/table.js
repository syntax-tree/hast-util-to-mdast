'use strict'

module.exports = table

var xtend = require('xtend')
var visit = require('unist-util-visit')
var all = require('../all')

function table(h, node) {
  var info = inspect(node)
  return h(node, 'table', {align: info.align}, toRows(all(h, node), info))
}

// Infer whether the HTML table has a head and how it aligns.
function inspect(node) {
  var headless = true
  var align = []
  var rowIndex = 0
  var cellIndex = 0

  visit(node, 'element', visitor)

  return {align: align, headless: headless}

  function visitor(child) {
    var name = child.tagName

    // If there is a `thead`, assume there is a header row.
    if (name === 'thead') {
      headless = false
    } else if (name === 'tr') {
      rowIndex++
      cellIndex = 0
    } else if (name === 'th' || name === 'td') {
      if (!align[cellIndex]) {
        align[cellIndex] = child.properties.align || null
      }

      // If there is a th in the first row, assume there is a header row.
      if (headless && rowIndex < 2 && child.tagName === 'th') {
        headless = false
      }

      cellIndex++
    }
  }
}

// Ensure the rows are properly structured.
function toRows(rows, info) {
  var nodes = []
  var length = rows.length
  var index = -1
  var node
  var queue

  // Add an empty header row.
  if (info.headless) {
    add(tableRow([]))
  }

  while (++index < length) {
    node = rows[index]

    if (node.type === 'tableRow') {
      flush()
      add(node)
    } else {
      queue = (queue || []).concat(node)
    }
  }

  flush()

  return nodes

  function flush() {
    if (queue) {
      add(tableRow(queue))
      queue = undefined
    }
  }

  function add(node) {
    nodes.push(cells(node, info))
  }
}

// Ensure the cells in a row are properly structured.
function cells(row, info) {
  var columnCount = info.align.length
  var nodes = []
  var cells = row.children
  var length = cells.length
  var index = -1
  var node
  var queue

  while (++index < length) {
    node = cells[index]

    if (node.type === 'tableCell') {
      flush()
      nodes.push(node)
    } else {
      queue = (queue || []).concat(node)
    }
  }

  flush()

  index = nodes.length
  length = columnCount + 1

  while (++index < length) {
    nodes.push(tableCell([]))
  }

  return xtend(row, {children: nodes})

  function flush() {
    if (queue) {
      nodes.push(tableCell(queue))
      queue = undefined
    }
  }
}

function tableRow(children) {
  return {type: 'tableRow', children: children}
}

function tableCell(children) {
  return {type: 'tableCell', children: children}
}
