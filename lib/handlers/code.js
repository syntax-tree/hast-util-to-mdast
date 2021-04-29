import {hasProperty} from 'hast-util-has-property'
import {convertElement} from 'hast-util-is-element'
import {toText} from 'hast-util-to-text'
import {trimTrailingLines} from 'trim-trailing-lines'
import {wrapText} from '../util/wrap-text.js'

var prefix = 'language-'

var pre = convertElement('pre')
var isCode = convertElement('code')

export function code(h, node) {
  var children = node.children
  var index = -1
  var classList
  var lang

  if (pre(node)) {
    while (++index < children.length) {
      if (
        isCode(children[index]) &&
        hasProperty(children[index], 'className')
      ) {
        classList = children[index].properties.className
        break
      }
    }
  }

  if (classList) {
    index = -1

    while (++index < classList.length) {
      if (classList[index].slice(0, prefix.length) === prefix) {
        lang = classList[index].slice(prefix.length)
        break
      }
    }
  }

  return h(
    node,
    'code',
    {lang: lang || null, meta: null},
    trimTrailingLines(wrapText(h, toText(node)))
  )
}
