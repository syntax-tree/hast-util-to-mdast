'use strict'

module.exports = iframe

var resolve = require('../util/resolve')

function iframe(h, node) {
  var src = node.properties.src
  var title = node.properties.title

  // Only create a link if there is a title.
  // We can’t use `content` because conforming HTML parsers treat it as text,
  // whereas legacy parsers treat it as HTML, so they will likely contain tags
  // that will show up in text.
  if (src && title) {
    return {
      type: 'link',
      title: null,
      url: resolve(h, src),
      children: [{type: 'text', value: title}]
    }
  }
}
