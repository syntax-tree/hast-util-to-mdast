'use strict';

module.exports = all;

var one = require('./one');

function all(h, parent, options) {
  var nodes = parent.children || [];
  var length = nodes.length;
  var values = [];
  var index = -1;
  var result;

  while (++index < length) {
    result = one(h, nodes[index], parent, options);

    if (result) {
      values = values.concat(result);
    }
  }

  return values;
}
