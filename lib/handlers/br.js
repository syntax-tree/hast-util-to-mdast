export function br(h, node) {
  return h.wrapText ? h(node, 'break') : h(node, 'text', ' ')
}
