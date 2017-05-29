'use strict';

module.exports = blockquote;

var all = require('../all');
var wrap = require('../wrap');

function blockquote(h, node) {
  return h(node, 'blockquote', wrap(all(h, node)));
}
