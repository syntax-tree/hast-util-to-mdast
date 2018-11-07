'use strict'

var fs = require('fs')
var path = require('path')
var u = require('unist-builder')
var h = require('hastscript')
var test = require('tape')
var hidden = require('is-hidden')
var negate = require('negate')
var unified = require('unified')
var markdown = require('remark-parse')
var html = require('rehype-parse')
var stringify = require('remark-stringify')
var assert = require('mdast-util-assert')
var remove = require('unist-util-remove-position')
var toMdast = require('..')

var fixtures = path.join(__dirname, 'fixtures')

test('core', function(t) {
  t.deepEqual(
    toMdast(u('root', [h('strong', 'Alpha')])),
    u('root', [u('strong', [u('text', 'Alpha')])]),
    'should transform hast to mdast'
  )

  t.deepEqual(
    toMdast(u('root', [u('unknown', 'text')])),
    u('root', [u('text', 'text')]),
    'should transform unknown texts to `text`'
  )

  t.deepEqual(
    toMdast(u('root', [u('unknown', [h('em')])])),
    u('root', [u('emphasis', [])]),
    'should unwrap unknown parents'
  )

  t.deepEqual(
    toMdast(u('root', [u('unknown')])),
    u('root', []),
    'should ignore unknown voids'
  )

  var pos = {
    left: {line: 1, column: 1, offset: 0},
    right: {line: 1, column: 6, offset: 5}
  }

  t.deepEqual(
    toMdast({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{type: 'text', value: 'Alpha', position: pos}],
          position: pos
        }
      ],
      position: pos
    }),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [{type: 'text', value: 'Alpha', position: pos}],
          position: pos
        }
      ],
      position: pos
    },
    'should ignore unknown voids'
  )

  t.end()
})

test('fixtures', function(t) {
  var remark = unified()
    .use(markdown)
    .use(stringify)

  fs.readdirSync(fixtures)
    .filter(negate(hidden))
    .forEach(check)

  t.end()

  function check(name) {
    var ignore = /^base\b/.test(name) && typeof URL === 'undefined'

    t.test(name, function(st) {
      var input = String(
        fs.readFileSync(path.join(fixtures, name, 'index.html'))
      )
      var output = String(
        fs.readFileSync(path.join(fixtures, name, 'index.md'))
      )
      var config

      try {
        config = String(
          fs.readFileSync(path.join(fixtures, name, 'index.json'))
        )
      } catch (error) {}

      if (config) {
        config = JSON.parse(config)
      }

      var fromHTML = unified()
        .use(html)
        .use(function() {
          return transformer
          function transformer(tree) {
            return toMdast(tree, config)
          }
        })
        .use(stringify)

      var tree = remove(fromHTML.runSync(fromHTML.parse(input)), true)

      /* Replace middots with spaces (useful for break nodes). */
      output = output.replace(/·/g, ' ')

      st.doesNotThrow(function() {
        assert(tree)
      }, 'should produce valid mdast nodes')

      if (ignore) {
        st.end()
        return
      }

      if (!config || config.stringify !== false) {
        st.deepEqual(
          remark.stringify(tree),
          output || '\n',
          'should produce the same documents'
        )
      }

      if (!config || config.tree !== false) {
        st.deepEqual(
          tree,
          remove(remark.runSync(remark.parse(output)), true),
          'should produce the same tree as remark'
        )
      }

      st.end()
    })
  }
})

test('handlers option', function(t) {
  var options = {
    handlers: {
      div: function(h, node) {
        node.children[0].value = 'Beta'
        node.type = 'paragraph'
        return h(node, 'paragraph', node.children)
      }
    }
  }

  t.deepEqual(
    toMdast(
      {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'div',
            properties: {},
            children: [
              {
                type: 'text',
                value: 'Alpha'
              }
            ]
          }
        ]
      },
      options
    ),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Beta'
            }
          ]
        }
      ]
    },
    'use handlers passed as option'
  )

  t.end()
})

test('document option', function(t) {
  var tree = u('root', [
    h('b', 'Importance'),
    u('text', ' and '),
    h('i', 'emphasis'),
    u('text', '.')
  ])

  t.deepEqual(
    toMdast(tree),
    u('root', [
      u('strong', [u('text', 'Importance')]),
      u('text', ' and '),
      u('emphasis', [u('text', 'emphasis')]),
      u('text', '.')
    ]),
    'should infer document if not needed'
  )

  t.deepEqual(
    toMdast(tree, {document: true}),
    u('root', [
      u('paragraph', [
        u('strong', [u('text', 'Importance')]),
        u('text', ' and '),
        u('emphasis', [u('text', 'emphasis')]),
        u('text', '.')
      ])
    ]),
    'should support an explitic `document: true`'
  )

  t.end()
})

test('newlines option', function(t) {
  t.deepEqual(
    toMdast({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [
            {
              type: 'text',
              value: 'Alpha\nBeta'
            }
          ]
        }
      ]
    }),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Alpha Beta'
            }
          ]
        }
      ]
    },
    'should collapse newline to a single space'
  )

  t.deepEqual(
    toMdast(
      {
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              {
                type: 'text',
                value: 'Alpha\nBeta'
              }
            ]
          }
        ]
      },
      {newlines: true}
    ),
    {
      type: 'root',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              type: 'text',
              value: 'Alpha\nBeta'
            }
          ]
        }
      ]
    },
    'should contain newlines'
  )

  t.end()
})
