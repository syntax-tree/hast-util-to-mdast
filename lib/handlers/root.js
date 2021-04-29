import {all} from '../all.js'
import {wrap, wrapNeeded} from '../util/wrap.js'

export function root(h, node) {
  var children = all(h, node)

  if (h.document || wrapNeeded(children)) {
    children = wrap(children)
  }

  return h(node, 'root', children)
}
