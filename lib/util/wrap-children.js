import {all} from '../all.js'
import {wrap} from './wrap.js'

export function wrapChildren(h, node) {
  return wrap(all(h, node))
}
