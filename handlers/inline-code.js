'use strict';

module.exports = inlineCode;

var toString = require('hast-util-to-string');

function inlineCode(h, node) {
  return h(node, 'inlineCode', toString(node));
}
