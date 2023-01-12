/**
 * @typedef {import('../index.js').Options} Options
 */

import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'tape'
import {isHidden} from 'is-hidden'
import {h} from 'hastscript'
import {fromHtml} from 'hast-util-from-html'
import {assert as mdastAssert} from 'mdast-util-assert'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {gfm} from 'micromark-extension-gfm'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'
import {toMdast} from '../index.js'
import * as mod from '../index.js'

test('core', (t) => {
  t.deepEqual(
    Object.keys(mod).sort(),
    ['defaultHandlers', 'defaultNodeHandlers', 'toMdast'],
    'should expose the public api'
  )

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
    // @ts-expect-error runtime.
    toMdast(u('root', [u('unknown', 'text')])),
    u('root', [u('text', 'text')]),
    'should transform unknown texts to `text`'
  )

  t.deepEqual(
    // @ts-expect-error runtime.
    toMdast(u('root', [u('unknown', [h('em')])])),
    u('root', [u('emphasis', [])]),
    'should unwrap unknown parents'
  )

  t.deepEqual(
    // @ts-expect-error runtime.
    toMdast(u('root', [u('unknown')])),
    u('root', []),
    'should ignore unknown voids'
  )

  const pos = {
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

  t.deepEqual(
    toMdast({type: 'element', tagName: 'a', children: []}),
    {type: 'link', url: '', title: null, children: []},
    'should support an `a` w/o `properties`'
  )

  t.deepEqual(
    toMdast({type: 'element', tagName: 'iframe', children: []}),
    {type: 'root', children: []},
    'should support an `iframe` w/o `properties`'
  )

  t.deepEqual(
    toMdast({type: 'element', tagName: 'img', children: []}),
    {type: 'image', url: '', title: null, alt: ''},
    'should support an `img` w/o `properties`'
  )

  t.deepEqual(
    toMdast({type: 'element', tagName: 'input', children: []}),
    {type: 'root', children: []},
    'should support an `input` w/o `properties`'
  )

  t.deepEqual(
    toMdast({type: 'element', tagName: 'select', children: []}),
    {type: 'root', children: []},
    'should support a `select` w/o `properties`'
  )

  t.deepEqual(
    toMdast({
      type: 'element',
      tagName: 'select',
      properties: {},
      children: [{type: 'element', tagName: 'option', children: []}]
    }),
    {type: 'text', value: ''},
    'should support an `option` w/o `properties`'
  )

  t.deepEqual(
    toMdast({type: 'element', tagName: 'video', children: []}),
    {type: 'link', title: null, url: '', children: []},
    'should support a `video` w/o `properties`'
  )

  t.deepEqual(
    // @ts-expect-error: `children` missing.
    toMdast({type: 'root'}),
    {type: 'root', children: []},
    'should support a `root` node w/o `children`'
  )

  t.deepEqual(
    // @ts-expect-error: `children` missing.
    toMdast({type: 'element', tagName: 'div'}),
    {type: 'root', children: []},
    'should support an `element` node w/o `children`'
  )

  t.deepEqual(
    toMdast(h(null, [h('div', 'Alpha')]), {
      handlers: {
        div() {
          return {type: 'paragraph', children: [{type: 'text', value: 'Beta'}]}
        }
      }
    }),
    u('root', [u('paragraph', [u('text', 'Beta')])]),
    'should support `handlers`'
  )

  t.deepEqual(
    toMdast(h(null, h('p', 'Alpha\nBeta'))),
    u('root', [u('paragraph', [u('text', 'Alpha Beta')])]),
    'should collapse newline to a single space'
  )

  t.deepEqual(
    toMdast(h(null, h('p', 'Alpha\nBeta')), {newlines: true}),
    u('root', [u('paragraph', [u('text', 'Alpha\nBeta')])]),
    'should support `newlines: true`'
  )

  const phrasingTree = h(null, [
    h('b', 'Importance'),
    ' and ',
    h('i', 'emphasis'),
    '.'
  ])

  t.deepEqual(
    toMdast(phrasingTree),
    u('root', [
      u('strong', [u('text', 'Importance')]),
      u('text', ' and '),
      u('emphasis', [u('text', 'emphasis')]),
      u('text', '.')
    ]),
    'should infer document if not needed'
  )

  t.deepEqual(
    toMdast(phrasingTree, {document: true}),
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

  const referenceTree = toMdast(h(null, ['some ', h('sup', 'test'), ' text']), {
    handlers: {
      // @ts-expect-error - custom node type
      sup(state, element) {
        return {
          type: 'superscript',
          data: {},
          children: state.all(element)
        }
      }
    }
  })
  const explicitTree = toMdast(h(null, ['some ', h('sup', 'test'), ' text']), {
    handlers: {
      // @ts-expect-error - custom node type
      sup(state, element) {
        return {
          type: 'superscript',
          data: {hName: 'sup'},
          children: state.all(element)
        }
      }
    }
  })

  // Reference check: `text`s are wrapped in `paragraph`s because the unknown
  // node is seen as “block”
  t.deepEqual(
    referenceTree.type === 'root' &&
      referenceTree.children.length === 3 &&
      referenceTree.children[0].type === 'paragraph',
    true,
    'should support `node.data.hName` to infer phrasing (1)'
  )

  // Actual check: no `paragraph` is added because `hName` is added.
  t.deepEqual(
    explicitTree.type === 'root' &&
      explicitTree.children.length === 3 &&
      explicitTree.children[0].type !== 'paragraph',
    true,
    'should support `node.data.hName` to infer phrasing (2)'
  )

  t.end()
})

test('fixtures', async (t) => {
  const fixtures = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(fixtures)

  for (const folder of folders) {
    if (isHidden(folder)) {
      continue
    }

    t.test(folder, async (t) => {
      const configUrl = new URL(folder + '/index.json', fixtures)
      const inputUrl = new URL(folder + '/index.html', fixtures)
      const expectedUrl = new URL(folder + '/index.md', fixtures)
      const input = String(await fs.readFile(inputUrl))
        // Replace middots with spaces (useful for trailing spaces).
        .replace(/·/g, ' ')
      /** @type {({stringify?: boolean, tree?: boolean} & Options) | undefined} */
      let config

      try {
        config = JSON.parse(String(await fs.readFile(configUrl)))
      } catch {}

      const hast = fromHtml(input)
      const mdast = toMdast(hast, config)
      removePosition(mdast, true)

      t.doesNotThrow(() => {
        mdastAssert(mdast)
      }, 'should produce valid mdast nodes')

      // Ignore the invalid base test.
      if (folder === 'base-invalid') {
        t.end()
        return
      }

      const actual = toMarkdown(mdast, {
        extensions: [gfmToMarkdown()],
        fences: true
      })
      /** @type {string} */
      let expected

      try {
        if ('UPDATE' in process.env) {
          throw new Error('Update!')
        }

        expected = String(await fs.readFile(expectedUrl))
      } catch {
        expected = actual
        await fs.writeFile(expectedUrl, actual)
      }

      if (!config || config.stringify !== false) {
        t.deepEqual(actual, expected, 'should produce the same documents')
      }

      if (!config || config.tree !== false) {
        const expectedMdast = fromMarkdown(expected, {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        })
        removePosition(expectedMdast, true)
        t.deepEqual(
          mdast,
          expectedMdast,
          'should produce the same tree as remark'
        )
      }

      t.end()
    })
  }

  t.end()
})
