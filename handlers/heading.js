'use strict';

module.exports = heading;

var all = require('../all');

function heading(h, node) {
  var depth = Number(node.tagName.charAt(1));

  /* istanbul ignore next - `else` shouldn’t happen, of course… */
  depth = depth || 1;

  return h(node, 'heading', {depth: depth}, all(h, node));
}
