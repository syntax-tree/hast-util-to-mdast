'use strict';

module.exports = blockquote;

var all = require('../all');

function blockquote(h, node) {
  return h(node, 'blockquote', all(h, node));
}
