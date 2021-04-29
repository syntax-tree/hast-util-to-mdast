import {all} from '../all.js'

export function em(h, node) {
  return h(node, 'emphasis', all(h, node))
}
