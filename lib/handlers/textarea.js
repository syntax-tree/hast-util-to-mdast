import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

export function textarea(h, node) {
  return h(node, 'text', wrapText(h, toText(node)))
}
