/**
 * @typedef {import('../lib/types.js').Node} Node
 * @typedef {import('../lib/types.js').Options} Options
 * @typedef {import('../lib/types.js').Handle} Handle
 */

import fs from 'fs'
import path from 'path'
import test from 'tape'
import {u} from 'unist-builder'
import {h} from 'hastscript'
import {isHidden} from 'is-hidden'
import negate from 'negate'
import unified from 'unified'
import remarkParse from 'remark-parse'
import remarkGfm from 'remark-gfm'
import rehypeStringify from 'rehype-parse'
import remarkStringify from 'remark-stringify'
import assert from 'mdast-util-assert'
import {removePosition} from 'unist-util-remove-position'
import {one, all, toMdast} from '../index.js'

var fixtures = path.join('test', 'fixtures')

test('exports', function (t) {
  t.assert(
    one,
    'should export `one`'
  )

  t.assert(
    all,
    'should export `all`'
  )

  t.end()
})

test('core', function (t) {
  t.deepEqual(
    toMdast(u('root', [h('strong', 'Alpha')])),
    u('root', [u('strong', [u('text', 'Alpha')])]),
    'should transform hast to mdast'
  )

  t.deepEqual(
    toMdast(u('doctype', {name: 'html'})),
    u('root', []),
    'should transform a node w/o mdast representation to an empty root'
  )

  t.deepEqual(
    toMdast(h('q', 'things')),
    {type: 'root', children: [{type: 'text', value: '"things"'}]},
    'should transform a node w/o multiple representations to a root'
  )

  t.deepEqual(
    // @ts-ignore runtime.
    toMdast(u('root', [u('unknown', 'text')])),
    u('root', [u('text', 'text')]),
    'should transform unknown texts to `text`'
  )

  t.deepEqual(
    // @ts-ignore runtime.
    toMdast(u('root', [u('unknown', [h('em')])])),
    u('root', [u('emphasis', [])]),
    'should unwrap unknown parents'
  )

  t.deepEqual(
    // @ts-ignore runtime.
    toMdast(u('root', [u('unknown')])),
    u('root', []),
    'should ignore unknown voids'
  )

  var pos = {
    start: {line: 1, column: 1, offset: 0},
    end: {line: 1, column: 6, offset: 5}
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
    'should support positional information'
  )

  t.end()
})

test('fixtures', function (t) {
  var remark = unified().use(remarkParse).use(remarkGfm).use(remarkStringify)

  fs.readdirSync(fixtures)
    .filter(negate(isHidden))
    // eslint-disable-next-line unicorn/no-array-for-each
    .forEach((d) => check(d))

  t.end()

  function check(/** @type {string} */ name) {
    var ignore = /^base\b/.test(name)

    t.test(name, function (st) {
      var input = String(
        fs.readFileSync(path.join(fixtures, name, 'index.html'))
      )
      var output = String(
        fs.readFileSync(path.join(fixtures, name, 'index.md'))
      )
      /** @type {{stringify?: boolean, tree?: boolean} & Options} */
      var config

      try {
        config = JSON.parse(
          String(fs.readFileSync(path.join(fixtures, name, 'index.json')))
        )
      } catch {}

      var fromHtml = unified()
        .use(rehypeStringify)
        .use(function () {
          return transformer
          function transformer(/** @type {Node} */ tree) {
            return toMdast(tree, config)
          }
        })
        .use(remarkStringify)

      var tree = removePosition(fromHtml.runSync(fromHtml.parse(input)), true)

      // Replace middots with spaces (useful for trailing spaces).
      output = output.replace(/·/g, ' ')

      st.doesNotThrow(function () {
        assert(tree)
      }, 'should produce valid mdast nodes')

      if (ignore) {
        st.end()
        return
      }

      if (!config || config.stringify !== false) {
        st.deepEqual(
          // @ts-ignore Types are wrong.
          remark.stringify(tree),
          output,
          'should produce the same documents'
        )
      }

      if (!config || config.tree !== false) {
        st.deepEqual(
          tree,
          removePosition(remark.runSync(remark.parse(output)), true),
          'should produce the same tree as remark'
        )
      }

      st.end()
    })
  }
})

test('handlers option', function (t) {
  /** @type {Options} */
  var options = {
    handlers: {
      div(h, node) {
        node.children[0].value = 'Beta'
        // @ts-ignore only a text.
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
            children: [{type: 'text', value: 'Alpha'}]
          }
        ]
      },
      options
    ),
    {
      type: 'root',
      children: [{type: 'paragraph', children: [{type: 'text', value: 'Beta'}]}]
    },
    'use handlers passed as option'
  )

  t.end()
})

test('document option', function (t) {
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
    'should support an explicit `document: true`'
  )

  t.end()
})

test('newlines option', function (t) {
  t.deepEqual(
    toMdast({
      type: 'root',
      children: [
        {
          type: 'element',
          tagName: 'p',
          properties: {},
          children: [{type: 'text', value: 'Alpha\nBeta'}]
        }
      ]
    }),
    {
      type: 'root',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'Alpha Beta'}]}
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
            children: [{type: 'text', value: 'Alpha\nBeta'}]
          }
        ]
      },
      {newlines: true}
    ),
    {
      type: 'root',
      children: [
        {type: 'paragraph', children: [{type: 'text', value: 'Alpha\nBeta'}]}
      ]
    },
    'should contain newlines'
  )

  t.end()
})
