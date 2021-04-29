import {all} from '../all.js'

export function tableRow(h, node) {
  return h(node, 'tableRow', all(h, node))
}
