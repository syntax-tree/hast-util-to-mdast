import {one} from './one.js'

export function all(h, parent) {
  var nodes = parent.children || []
  var values = []
  var index = -1
  var result

  while (++index < nodes.length) {
    result = one(h, nodes[index], parent)

    if (result) {
      values = values.concat(result)
    }
  }

  return values
}
