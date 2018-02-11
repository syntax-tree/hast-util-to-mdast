'use strict';

module.exports = toMDAST;

var rehypeMinifyWhitespace = require('rehype-minify-whitespace');
var xtend = require('xtend');
var one = require('./lib/one');
var handlers = require('./lib/handlers');

function toMDAST(tree, options) {
  var settings = options || {};
  var minify = rehypeMinifyWhitespace({
    newlines: typeof settings.newlines === 'boolean' ? settings.newlines : false
  });

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
