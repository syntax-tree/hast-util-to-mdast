'use strict';

module.exports = root;

var all = require('../all');
var wrap = require('../wrap');

function root(h, node) {
  return h(node, 'root', wrap.optional(all(h, node)));
}
