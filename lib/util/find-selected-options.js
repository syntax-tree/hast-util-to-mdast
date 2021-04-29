import {hasProperty} from 'hast-util-has-property'
import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {wrapText} from './wrap-text.js'

var option = convertElement('option')

export function findSelectedOptions(h, node, properties) {
  var props = properties || node.properties
  var options = findOptions(node)
  var size =
    Math.min(Number.parseInt(props.size, 10), 0) || (props.multiple ? 4 : 1)
  var index = -1
  var selectedOptions = []
  var values = []
  var option
  var list
  var content
  var label
  var value

  while (++index < options.length) {
    if (hasProperty(options[index], 'selected')) {
      selectedOptions.push(options[index])
    }
  }

  list = selectedOptions.length > 0 ? selectedOptions : options
  options = list.slice(0, size)
  index = -1

  while (++index < options.length) {
    option = options[index]
    content = wrapText(h, toText(option))
    label = content || option.properties.label
    value = option.properties.value || content

    values.push([value, label === value ? null : label])
  }

  return values
}

function findOptions(node) {
  var children = node.children
  var index = -1
  var results = []
  var child

  while (++index < children.length) {
    child = children[index]

    if (option(child)) {
      if (!hasProperty(child, 'disabled')) {
        results.push(child)
      }
    } else if (child.children) {
      results = results.concat(findOptions(child))
    }
  }

  return results
}
