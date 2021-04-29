export function base(h, node) {
  if (!h.baseFound) {
    h.frozenBaseUrl = node.properties.href
    h.baseFound = true
  }
}
