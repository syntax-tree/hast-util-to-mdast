import {findSelectedOptions} from '../util/find-selected-options.js'
import {wrapText} from '../util/wrap-text.js'

export function select(h, node) {
  var values = findSelectedOptions(h, node)
  var index = -1
  var results = []
  var value

  while (++index < values.length) {
    value = values[index]
    results.push(value[1] ? value[1] + ' (' + value[0] + ')' : value[0])
  }

  if (results.length > 0) {
    return h(node, 'text', wrapText(h, results.join(', ')))
  }
}
