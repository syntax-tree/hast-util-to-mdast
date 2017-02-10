'use strict';

module.exports = table;

var visit = require('unist-util-visit');
var all = require('../all');

function table(h, node) {
  var align = alignment(node);
  return h(node, 'table', {align: align}, patch(all(h, node), align.length));
}

/* Infer the alignment of the table. */
function alignment(node) {
  var align = [];

  visit(node, visitor);

  return align;

  function visitor(child, index, parent) {
    var pos;

    if (cell(child)) {
      pos = cellsBefore(parent, child);
      if (!align[pos]) {
        align[pos] = infer(child) || null;
      }
    }
  }
}

/* Get the alignment of a cell. */
function infer(node) {
  return node.properties.align;
}

/* Count cells in `parent` before `node`. */
function cellsBefore(parent, node) {
  var children = parent.children;
  var length = children.length;
  var index = -1;
  var child;
  var pos = 0;

  while (++index < length) {
    child = children[index];

    if (child === node) {
      break;
    }

    /* istanbul ignore else - When proper HTML, should always be a cell */
    if (cell(child)) {
      pos++;
    }
  }

  return pos;
}

/* Check if `node` is a cell. */
function cell(node) {
  return node.tagName === 'th' || node.tagName === 'td';
}

/* Ensure the amount of cells in a row matches `align.left`. */
function patch(rows, count) {
  var length = rows.length;
  var index = -1;

  while (++index < length) {
    one(rows[index], count);
  }

  return rows;
}

function one(row, count) {
  var children = row.children;
  var length = count + 1;
  var index = children.length;

  while (++index < length) {
    children.push({type: 'tableCell', children: []});
  }
}
