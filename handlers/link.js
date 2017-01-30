'use strict';

module.exports = link;

var all = require('../all');

function link(h, node) {
  var props = {
    url: node.properties.href || '',
    title: node.properties.title || null
  };

  return h(node, 'link', props, all(h, node));
}
