'use strict';

module.exports = wrap;

wrap.needed = needed;

var is = require('unist-util-is');

/* https://github.com/syntax-tree/mdast */
var inline = [
  'inlineCode',
  'emphasis',
  'break',
  'strong',
  'delete',
  'link',
  'image',
  'footnote',
  'linkReference',
  'imageReference',
  'footnoteReference',
  'text'
];

/* Wrap all inline runs of MDAST content in `paragraph` nodes. */
function wrap(nodes) {
  var result = [];
  var length = nodes.length;
  var index = -1;
  var node;
  var queue;

  while (++index < length) {
    node = nodes[index];

    if (is(inline, node)) {
      if (queue === undefined) {
        queue = [];
      }

      queue.push(node);
    } else {
      if (queue !== undefined) {
        result.push({type: 'paragraph', children: queue});
        queue = undefined;
      }

      result.push(node);
    }
  }

  if (queue !== undefined) {
    result.push({type: 'paragraph', children: queue});
  }

  return result;
}

/* Check if there are non-inline MDAST nodes returned.
 * This is needed if a fragment is given, which could just be
 * a sentence, and doesn’t need a wrapper paragraph. */
function needed(nodes) {
  var length = nodes.length;
  var index = -1;

  while (++index < length) {
    if (!is(inline, nodes[index])) {
      return true;
    }
  }

  return false;
}
