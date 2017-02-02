'use strict';

module.exports = listItem;

var is = require('hast-util-is-element');
var all = require('../all');

function listItem(h, node, parent) {
  var children = node.children;
  var tail = !parent || parent.children[parent.children.length - 1] === node;
  var head = children[0];
  var checked = null;
  var loose = false;
  var checkbox;
  var grandchildren;
  var content;

  /* Check if this node starts with a checkbox. */
  if (head && is(head, 'p')) {
    grandchildren = head.children;
    checkbox = grandchildren[0];

    if (checkbox && is(checkbox, 'input') && checkbox.properties.type === 'checkbox') {
      checked = Boolean(checkbox.properties.checked);
    } else {
      checkbox = null;
    }
  }

  content = all(h, node);

  /* Remove initial spacing if we previously found a checkbox. */
  if (checked !== null) {
    grandchildren = content[0] && content[0].children;
    head = grandchildren && grandchildren[0];

    if (head && head.type === 'text' && head.value.charAt(0) === ' ') {
      /* Remove text with one space, or remove that one initial space */
      if (head.value.length === 1) {
        content[0].children = grandchildren.slice(1);
      } else {
        head.value = head.value.slice(1);
      }
    }
  }

  if (content.length > 1) {
    /* More than one node is always loose. */
    loose = true;
  } else if (content.length === 1) {
    head = content[0];

    if (head.type === 'text') {
      /* Wrap `text` in `paragraph` (always tight). */
      content = [{type: 'paragraph', children: content}];
      loose = false;
    } else if (head.type === 'paragraph') {
      /* One `paragraph`, always tight. Ensure it isn’t empty. */
      loose = false;

      if (head.children.length === 0) {
        content = [];
      }
    }
  }

  /* Last list-item is never loose. */
  if (tail) {
    loose = false;
  }

  return h(node, 'listItem', {loose: loose, checked: checked}, content);
}
