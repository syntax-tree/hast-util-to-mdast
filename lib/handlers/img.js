import {resolve} from '../util/resolve.js'

export function img(h, node) {
  return h(node, 'image', {
    url: resolve(h, node.properties.src),
    title: node.properties.title || null,
    alt: node.properties.alt || ''
  })
}
