import {all} from '../all.js'
import {resolve} from '../util/resolve.js'

export function a(h, node) {
  return h(
    node,
    'link',
    {
      title: node.properties.title || null,
      url: resolve(h, node.properties.href)
    },
    all(h, node)
  )
}
