'use strict';

module.exports = one;

var has = require('has');
var all = require('./all');

function one(h, node, parent) {
  var fn = null;

  if (node.type === 'element' && has(h.handlers, node.tagName)) {
    fn = h.handlers[node.tagName];
  } else if (has(h.handlers, node.type)) {
    fn = h.handlers[node.type];
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent);
}

function unknown(h, node) {
  if (node.value) {
    return h.augment(node, {type: 'text', value: node.value});
  }

  return all(h, node);
}
