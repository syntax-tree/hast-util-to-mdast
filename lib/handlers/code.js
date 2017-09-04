'use strict';

module.exports = code;

var is = require('hast-util-is-element');
var has = require('hast-util-has-property');
var toString = require('hast-util-to-string');

var prefix = 'language-';

function code(h, node) {
  var values = node.children;
  var length = values.length;
  var index = -1;
  var value;
  var classList;
  var lang;

  while (++index < length) {
    value = values[index];
    if (is(value, 'code') && has(value, 'className')) {
      classList = value.properties.className;
      break;
    }
  }

  if (classList) {
    length = classList.length;
    index = -1;

    while (++index < length) {
      value = classList[index];

      if (value.slice(0, prefix.length) === prefix) {
        lang = value.slice(prefix.length);
        break;
      }
    }
  }

  return h(node, 'code', {lang: lang || null}, toString(node));
}
