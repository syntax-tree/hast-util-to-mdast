'use strict';

module.exports = cell;

var all = require('../all');

function cell(h, node) {
  return h(node, 'tableCell', all(h, node));
}
