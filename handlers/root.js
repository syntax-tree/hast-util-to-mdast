'use strict';

module.exports = root;

var all = require('../all');

function root(h, node) {
  return h(node, 'root', all(h, node));
}
