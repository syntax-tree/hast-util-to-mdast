'use strict';

module.exports = list;

var has = require('hast-util-has-property');
var all = require('../all');

function list(h, node) {
  var ordered = node.tagName === 'ol';
  var start = null;
  var loose = false;
  var content;
  var length;
  var index;

  if (ordered) {
    start = has(node, 'start') ? node.properties.start : 1;
  }

  content = all(h, node);
  length = content.length;
  index = -1;

  while (++index < length) {
    if (content[index].loose === true) {
      loose = true;
      break;
    }
  }

  return h(node, 'list', {
    ordered: ordered,
    start: start,
    loose: loose
  }, content);
}
