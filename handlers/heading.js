'use strict';

module.exports = heading;

var all = require('../all');

function heading(h, node) {
  var depth = Number(node.tagName.charAt(1)) || 1;
  return h(node, 'heading', {depth: depth}, all(h, node));
}
