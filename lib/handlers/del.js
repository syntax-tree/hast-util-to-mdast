import {all} from '../all.js'

export function del(h, node) {
  return h(node, 'delete', all(h, node))
}
