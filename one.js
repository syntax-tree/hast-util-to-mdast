'use strict';

module.exports = one;

var has = require('has');
var all = require('./all');
var handlers = require('./handlers');

function one(h, node, parent) {
  var fn = null;

  if (node.type === 'element' && has(handlers, node.tagName)) {
    fn = handlers[node.tagName];
  } else if (has(handlers, node.type)) {
    fn = handlers[node.type];
  }

  return (typeof fn === 'function' ? fn : unknown)(h, node, parent);
}

function unknown(h, node) {
  if (node.value) {
    return h.augment(node, {type: 'text', value: node.value});
  }

  return all(h, node);
}
