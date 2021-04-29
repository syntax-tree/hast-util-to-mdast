import {wrapChildren} from '../util/wrap-children.js'

export function blockquote(h, node) {
  return h(node, 'blockquote', wrapChildren(h, node))
}
