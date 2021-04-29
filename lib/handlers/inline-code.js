import {toText} from 'hast-util-to-text'
import {wrapText} from '../util/wrap-text.js'

export function inlineCode(h, node) {
  return h(node, 'inlineCode', wrapText(h, toText(node)))
}
