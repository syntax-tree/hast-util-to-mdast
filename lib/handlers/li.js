import {convertElement} from 'hast-util-is-element'
import {shallow} from '../util/shallow.js'
import {wrapChildren} from '../util/wrap-children.js'

var p = convertElement('p')
var input = convertElement('input')

export function li(h, node) {
  var head = node.children[0]
  var checked = null
  var content
  var checkbox
  var clone
  var headClone

  // Check if this node starts with a checkbox.
  if (p(head)) {
    checkbox = head.children[0]

    if (
      input(checkbox) &&
      (checkbox.properties.type === 'checkbox' ||
        checkbox.properties.type === 'radio')
    ) {
      checked = Boolean(checkbox.properties.checked)
      headClone = shallow(head)
      headClone.children = head.children.slice(1)
      clone = shallow(node)
      clone.children = [headClone].concat(node.children.slice(1))
    }
  }

  content = wrapChildren(h, clone || node)

  return h(node, 'listItem', {spread: content.length > 1, checked}, content)
}
