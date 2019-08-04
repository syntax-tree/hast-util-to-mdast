'use strict'

module.exports = table

var xtend = require('xtend')
var visit = require('unist-util-visit')
var all = require('../all')

function table(h, node) {
  var align = alignment(node)
  return h(node, 'table', {align: align}, toRows(all(h, node), align.length))
}

// Infer the alignment of the table.
function alignment(node) {
  var align = []

  visit(node, visitor)

  return align

  function visitor(child, index, parent) {
    var pos

    if (cell(child)) {
      pos = cellsBefore(parent, child)
      if (!align[pos]) {
        align[pos] = child.properties.align || null
      }
    }
  }
}

// Count cells in `parent` before `node`.
function cellsBefore(parent, node) {
  var children = parent.children
  var length = children.length
  var index = -1
  var child
  var pos = 0

  while (++index < length) {
    child = children[index]

    if (child === node) {
      break
    }

    /* istanbul ignore else - When proper HTML, should always be a cell */
    if (cell(child)) {
      pos++
    }
  }

  return pos
}

// Check if `node` is a cell.
function cell(node) {
  return node.tagName === 'th' || node.tagName === 'td'
}

// Ensure the amount of cells in a row matches `align.left`.
function toRows(rows, count) {
  var nodes = []
  var length = rows.length
  var index = -1
  var node
  var queue

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
      add({type: 'tableRow', children: queue})
      queue = undefined
    }
  }

  function add(node) {
    nodes.push(cells(node, count))
  }
}

function cells(row, count) {
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
  length = count + 1

  while (++index < length) {
    nodes.push({type: 'tableCell', children: []})
  }

  return xtend(row, {children: nodes})

  function flush() {
    if (queue) {
      nodes.push({type: 'tableCell', children: queue})
      queue = undefined
    }
  }
}
