'use strict';

module.exports = text;

function text(h, node) {
  return h.augment(node, {type: 'text', value: node.value});
}
