import {all} from '../all.js'

export function wrapListItems(h, node) {
  var children = all(h, node)
  var index = -1

  while (++index < children.length) {
    if (children[index].type !== 'listItem') {
      children[index] = {
        type: 'listItem',
        spread: false,
        checked: null,
        children: [children[index]]
      }
    }
  }

  return children
}
