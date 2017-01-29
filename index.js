'use strict';

module.exports = toMDAST;

var xtend = require('xtend');
var one = require('./one');

h.augment = augment;

function toMDAST(tree) {
  return one(h, tree);
}

function h(node, type, props, children) {
  if (!children && ((typeof props === 'object' && 'length' in props) || typeof props === 'string')) {
    children = props;
    props = {};
  }

  var result = augment(node, {type: type});

  if (typeof children === 'string') {
    result.value = children;
  } else if (children) {
    result.children = children;
  }

  return xtend(result, props);
}

/* `right` is the finalized MDAST node,
 * created from `left`, a HAST node */
function augment(left, right) {
  if (left.value) {
    right.value = left.value;
  }

  return right;
}
