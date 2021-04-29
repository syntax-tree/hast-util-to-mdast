export function wrapText(h, value) {
  return h.wrapText ? value : value.replace(/\r?\n|\r/g, ' ')
}
