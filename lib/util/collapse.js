/**
 * @import {Options} from 'collapse-white-space'
 */

import {collapseWhiteSpace} from 'collapse-white-space'

/** @type {Options} */
const options = {style: 'html', trim: true}

/**
 * Collapse whitespace in a value, like HTML.
 *
 * @param {unknown} value
 *   Value.
 * @returns {string}
 *   Collapsed value.
 */
export function collapse(value) {
  return collapseWhiteSpace(String(value || ''), options)
}
