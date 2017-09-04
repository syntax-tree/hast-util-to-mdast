'use strict';

module.exports = image;

function image(h, node) {
  var props = {
    url: node.properties.src || '',
    title: node.properties.title || null,
    alt: node.properties.alt || null
  };

  return h(node, 'image', props);
}
