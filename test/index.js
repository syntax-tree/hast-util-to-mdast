/**
 * @typedef {import('hast-util-to-mdast').Options} Options
 */

/**
 * @typedef {ConfigFields & Options} Config
 *
 * @typedef ConfigFields
 *   Options for a fixture.
 * @property {boolean} stringify
 * @property {boolean} tree
 */

import assert from 'node:assert/strict'
import fs from 'node:fs/promises'
import process from 'node:process'
import test from 'node:test'
import {h} from 'hastscript'
import {fromHtml} from 'hast-util-from-html'
import {toMdast} from 'hast-util-to-mdast'
import {isHidden} from 'is-hidden'
import {assert as mdastAssert} from 'mdast-util-assert'
import {fromMarkdown} from 'mdast-util-from-markdown'
import {gfmFromMarkdown, gfmToMarkdown} from 'mdast-util-gfm'
import {toMarkdown} from 'mdast-util-to-markdown'
import {gfm} from 'micromark-extension-gfm'
import {u} from 'unist-builder'
import {removePosition} from 'unist-util-remove-position'

test('core', async function (t) {
  await t.test('should expose the public api', async function () {
    assert.deepEqual(Object.keys(await import('hast-util-to-mdast')).sort(), [
      'defaultHandlers',
      'defaultNodeHandlers',
      'toMdast'
    ])
  })

  await t.test('should transform hast to mdast', async function () {
    assert.deepEqual(
      toMdast(u('root', [h('strong', 'Alpha')])),
      u('root', [u('strong', [u('text', 'Alpha')])])
    )
  })

  await t.test(
    'should transform a node w/o mdast representation to an empty root',
    async function () {
      assert.deepEqual(toMdast(u('doctype', {name: 'html'})), u('root', []))
    }
  )

  await t.test(
    'should transform a node w/o multiple representations to a root',
    async function () {
      assert.deepEqual(toMdast(h('q', 'things')), {
        type: 'root',
        children: [{type: 'text', value: '"things"'}]
      })
    }
  )

  await t.test('should transform unknown texts to `text`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles an unknown literal.
        u('root', [u('unknown', 'text')])
      ),
      u('root', [u('text', 'text')])
    )
  })

  await t.test('should unwrap unknown parents', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles an unknown parent.
        u('root', [u('unknown', [h('em')])])
      ),
      u('root', [u('emphasis', [])])
    )
  })

  await t.test('should ignore unknown voids', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles an unknown void.
        u('root', [u('unknown')])
      ),
      u('root', [])
    )
  })

  const examplePosition = {
    start: {line: 1, column: 1, offset: 0},
    end: {line: 1, column: 6, offset: 5}
  }

  await t.test('should support positional information', async function () {
    assert.deepEqual(
      toMdast({
        type: 'root',
        children: [
          {
            type: 'element',
            tagName: 'p',
            properties: {},
            children: [
              {type: 'text', value: 'Alpha', position: examplePosition}
            ],
            position: examplePosition
          }
        ],
        position: examplePosition
      }),
      {
        type: 'root',
        children: [
          {
            type: 'paragraph',
            children: [
              {type: 'text', value: 'Alpha', position: examplePosition}
            ],
            position: examplePosition
          }
        ],
        position: examplePosition
      }
    )
  })

  await t.test('should support an `a` w/o `properties`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles missing `properties`.
        {type: 'element', tagName: 'a', children: []}
      ),
      {type: 'link', url: '', title: null, children: []}
    )
  })

  await t.test(
    'should support an `iframe` w/o `properties`',
    async function () {
      assert.deepEqual(
        toMdast(
          // @ts-expect-error: check how the runtime handles missing `properties`.
          {type: 'element', tagName: 'iframe', children: []}
        ),
        {type: 'root', children: []}
      )
    }
  )

  await t.test('should support an `img` w/o `properties`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles missing `properties`.
        {type: 'element', tagName: 'img', children: []}
      ),
      {type: 'image', url: '', title: null, alt: ''}
    )
  })

  await t.test('should support an `input` w/o `properties`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles missing `properties`.
        {type: 'element', tagName: 'input', children: []}
      ),
      {type: 'root', children: []}
    )
  })

  await t.test('should support a `select` w/o `properties`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles missing `properties`.
        {type: 'element', tagName: 'select', children: []}
      ),
      {type: 'root', children: []}
    )
  })

  await t.test(
    'should support an `option` w/o `properties`',
    async function () {
      assert.deepEqual(
        toMdast({
          type: 'element',
          tagName: 'select',
          properties: {},
          children: [
            // @ts-expect-error: check how the runtime handles missing `properties`.
            {type: 'element', tagName: 'option', children: []}
          ]
        }),
        {type: 'text', value: ''}
      )
    }
  )

  await t.test('should support a `video` w/o `properties`', async function () {
    assert.deepEqual(
      toMdast(
        // @ts-expect-error: check how the runtime handles missing `properties`.
        {type: 'element', tagName: 'video', children: []}
      ),
      {type: 'link', title: null, url: '', children: []}
    )
  })

  await t.test(
    'should support a `root` node w/o `children`',
    async function () {
      assert.deepEqual(
        // @ts-expect-error: check how the runtime handles `children` missing.
        toMdast({type: 'root'}),
        {type: 'root', children: []}
      )
    }
  )

  await t.test(
    'should support an `element` node w/o `children`',
    async function () {
      assert.deepEqual(
        // @ts-expect-error: check how the runtime handles `children` missing.
        toMdast({type: 'element', tagName: 'div'}),
        {type: 'root', children: []}
      )
    }
  )

  await t.test('should support `handlers`', async function () {
    assert.deepEqual(
      toMdast(h(null, [h('div', 'Alpha')]), {
        handlers: {
          div() {
            return {
              type: 'paragraph',
              children: [{type: 'text', value: 'Beta'}]
            }
          }
        }
      }),
      u('root', [u('paragraph', [u('text', 'Beta')])])
    )
  })

  await t.test('should collapse newline to a single space', async function () {
    assert.deepEqual(
      toMdast(h(null, h('p', 'Alpha\nBeta'))),
      u('root', [u('paragraph', [u('text', 'Alpha Beta')])])
    )
  })

  await t.test('should support `newlines: true`', async function () {
    assert.deepEqual(
      toMdast(h(null, h('p', 'Alpha\nBeta')), {newlines: true}),
      u('root', [u('paragraph', [u('text', 'Alpha\nBeta')])])
    )
  })

  const phrasingTree = h(null, [
    h('b', 'Importance'),
    ' and ',
    h('i', 'emphasis'),
    '.'
  ])

  await t.test('should infer document if not needed', async function () {
    assert.deepEqual(
      toMdast(phrasingTree),
      u('root', [
        u('strong', [u('text', 'Importance')]),
        u('text', ' and '),
        u('emphasis', [u('text', 'emphasis')]),
        u('text', '.')
      ])
    )
  })

  await t.test(
    'should support an explicit `document: true`',
    async function () {
      assert.deepEqual(
        toMdast(phrasingTree, {document: true}),
        u('root', [
          u('paragraph', [
            u('strong', [u('text', 'Importance')]),
            u('text', ' and '),
            u('emphasis', [u('text', 'emphasis')]),
            u('text', '.')
          ])
        ])
      )
    }
  )

  const referenceTree = toMdast(h(null, ['some ', h('sup', 'test'), ' text']), {
    handlers: {
      // @ts-expect-error: check how a custom node type is handled.
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
      // @ts-expect-error: check how a custom node type is handled.
      sup(state, element) {
        return {
          type: 'superscript',
          data: {hName: 'sup'},
          children: state.all(element)
        }
      }
    }
  })

  await t.test(
    'should support `node.data.hName` to infer phrasing (1)',
    async function () {
      // Reference check: `text`s are wrapped in `paragraph`s because the unknown
      // node is seen as “block”
      assert.deepEqual(
        referenceTree.type === 'root' &&
          referenceTree.children.length === 3 &&
          referenceTree.children[0].type === 'paragraph',
        true
      )
    }
  )

  await t.test(
    'should support `node.data.hName` to infer phrasing (2)',
    async function () {
      // Actual check: no `paragraph` is added because `hName` is added.
      assert.deepEqual(
        explicitTree.type === 'root' &&
          explicitTree.children.length === 3 &&
          explicitTree.children[0].type !== 'paragraph',
        true
      )
    }
  )
})

test('fixtures', async function (t) {
  const fixtures = new URL('fixtures/', import.meta.url)
  const folders = await fs.readdir(fixtures)

  for (const folder of folders) {
    if (isHidden(folder)) {
      continue
    }

    await t.test(folder, async function () {
      const configUrl = new URL(folder + '/index.json', fixtures)
      const inputUrl = new URL(folder + '/index.html', fixtures)
      const expectedUrl = new URL(folder + '/index.md', fixtures)
      const input = String(await fs.readFile(inputUrl))
        // Replace middots with spaces (useful for trailing spaces).
        .replace(/·/g, ' ')
      /** @type {Config | undefined} */
      let config

      try {
        config = JSON.parse(String(await fs.readFile(configUrl)))
      } catch {}

      const hast = fromHtml(input)
      const mdast = toMdast(hast, config)
      removePosition(mdast, {force: true})

      mdastAssert(mdast)

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
        assert.deepEqual(actual, expected)
      }

      if (!config || config.tree !== false) {
        const expectedMdast = fromMarkdown(expected, {
          extensions: [gfm()],
          mdastExtensions: [gfmFromMarkdown()]
        })
        removePosition(expectedMdast, {force: true})
        assert.deepEqual(mdast, expectedMdast)
      }
    })
  }
})
