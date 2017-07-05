'use strict';

module.exports = toMDAST;

var minify = require('rehype-minify-whitespace')();
var xtend = require('xtend');
var one = require('./one');
var handlers = require('./handlers');

function toMDAST(tree, options) {
  var settings = options || {};

  h.handlers = xtend(handlers, settings.handlers || {});
  h.augment = augment;
  h.document = settings.document;

  return one(h, minify(tree), null);

  function h(node, type, props, children) {
    var result;

    if (!children && ((typeof props === 'object' && 'length' in props) || typeof props === 'string')) {
      children = props;
      props = {};
    }

    result = xtend({type: type}, props);

    if (typeof children === 'string') {
      result.value = children;
    } else if (children) {
      result.children = children;
    }

    return augment(node, result);
  }

  /* `right` is the finalized MDAST node,
   * created from `left`, a HAST node */
  function augment(left, right) {
    if (left.position) {
      right.position = left.position;
    }

    return right;
  }
}
