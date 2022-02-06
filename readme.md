# hast-util-to-mdast

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[hast][] utility to transform to [mdast][].

## Contents

*   [What is this?](#what-is-this)
*   [When should I use this?](#when-should-i-use-this)
*   [Install](#install)
*   [Use](#use)
*   [API](#api)
    *   [`toMdast(tree[, options])`](#tomdasttree-options)
    *   [`defaultHandlers`](#defaulthandlers)
    *   [`all(h, parent)`](#allh-parent)
    *   [`one(h, node, parent)`](#oneh-node-parent)
*   [Examples](#examples)
    *   [Example: ignoring things](#example-ignoring-things)
    *   [Example: keeping some HTML](#example-keeping-some-html)
*   [Algorithm](#algorithm)
*   [Syntax](#syntax)
*   [Syntax tree](#syntax-tree)
*   [Types](#types)
*   [Compatibility](#compatibility)
*   [Security](#security)
*   [Related](#related)
*   [Contribute](#contribute)
*   [License](#license)

## What is this?

This package is a utility that takes a [hast][] (HTML) syntax tree as input and
turns it into an [mdast][] (markdown) syntax tree.

## When should I use this?

This project is useful when you want to turn HTML to markdown.

The mdast utility [`mdast-util-to-hast`][mdast-util-to-hast] does the inverse of
this utility.
It turns markdown into HTML.

The rehype plugin [`rehype-remark`][rehype-remark] wraps this utility to also
turn HTML to markdown at a higher-level (easier) abstraction.

## Install

This package is [ESM only][esm].
In Node.js (version 12.20+, 14.14+, or 16.0+), install with [npm][]:

```sh
npm install hast-util-to-mdast
```

In Deno with [Skypack][]:

```js
import {toMdast} from 'https://cdn.skypack.dev/hast-util-to-mdast@8?dts'
```

In browsers with [Skypack][]:

```html
<script type="module">
  import {toMdast} from 'https://cdn.skypack.dev/hast-util-to-mdast@8?min'
</script>
```

## Use

Say we have the following `example.html`:

```html
<h2>Hello <strong>world!</strong></h2>
```

…and next to it a module `example.js`:

```js
import {promises as fs} from 'node:fs'
import {parseFragment} from 'parse5'
import {fromParse5} from 'hast-util-from-parse5'
import {toMdast} from 'hast-util-to-mdast'
import {toMarkdown} from 'mdast-util-to-markdown'

main()

async function main() {
  const html = String(await fs.readFile('example.html'))
  const parse5 = parseFragment(html)
  const hast = fromParse5(parse5)
  const mdast = toMdast(hast)
  const markdown = toMarkdown(mdast)

  console.log(markdown)
}
```

…now running `node example.js` yields:

```markdown
## Hello **world!**
```

## API

This package exports the following identifiers: `toMdast`, `defaultHandlers`,
`all`, `one`.
There is no default export.

### `toMdast(tree[, options])`

Transform [hast][] to [mdast][].

##### `options`

Configuration (optional).

###### `options.newlines`

Keep line endings when collapsing whitespace (`boolean`, default: `false`).
The default collapses to a single space.

###### `options.checked`

Value to use for a checked checkbox or radio input (`string`, default: `[x]`).

###### `options.unchecked`

Value to use for an unchecked checkbox or radio input (`string`, default:
`[ ]`).

###### `options.quotes`

List of quotes to use (`Array<string>`, default: `['"']`).
Each value can be one or two characters.
When two, the first character determines the opening quote and the second the
closing quote at that level.
When one, both the opening and closing quote are that character.
The order in which the preferred quotes appear determines which quotes to use at
which level of nesting.
So, to prefer `‘’` at the first level of nesting, and `“”` at the second, pass
`['‘’', '“”']`.
If `<q>`s are nested deeper than the given amount of quotes, the markers wrap
around: a third level of nesting when using `['«»', '‹›']` should have double
guillemets, a fourth single, a fifth double again, etc.

###### `options.document`

Whether the given tree represents a complete document (`boolean?`, default:
`undefined`).
Applies when the `tree` is a `root` node.
When the tree represents a complete document, then things are wrapped in
paragraphs when needed, and otherwise they’re left as-is.
The default checks for whether there’s mixed content: some *[phrasing][]* nodes
*and* some non-phrasing nodes.

###### `options.handlers`

Object mapping tag names or node types to functions handling the corresponding
nodes.
See [`handlers/`][handlers] for examples.

In a handler, you have access to `h`, which should be used to create mdast nodes
from hast nodes.
On `h`, there are several fields that may be of interest.
Most interesting of them is `h.wrapText`, which is `true` if the mdast content
can include newlines, and `false` if not (such as in headings or table cells).

##### Returns

[`MdastNode`][mdast-node].

### `defaultHandlers`

Object mapping HTML tag names and node types to functions that can handle
them.
See [`lib/handlers/index.js`][default-handlers].

### `all(h, parent)`

Helper function for writing custom handlers passed to `options.handlers`.
Pass it `h` and a parent node (hast) and it will turn the node’s children into
an array of transformed nodes (mdast).

### `one(h, node, parent)`

Helper function for writing custom handlers passed to `options.handlers`.
Pass it `h`, a `node`, and its `parent` (hast) and it will turn `node` into
mdast content.

## Examples

### Example: ignoring things

It’s possible to exclude something from within HTML when turning it into
markdown, by wrapping it in an element with a `data-mdast` attribute set to
`'ignore'`.
For example:

```html
<p><strong>Strong</strong> and <em data-mdast="ignore">emphasis</em>.</p>
```

Yields:

```markdown
**Strong** and .
```

It’s also possible to pass a handler to ignore nodes.
For example, to ignore `em` elements, pass `handlers: {'em': function () {}}`:

```html
<p><strong>Strong</strong> and <em>emphasis</em>.</p>
```

Yields:

```markdown
**Strong** and .
```

### Example: keeping some HTML

The goal of this project is to map HTML to plain and readable markdown.
That means that certain elements are ignored (such as `<svg>`) or “downgraded”
(such as `<video>` to links).
You can change this by passing handlers.

Say we have the following file `example.html`:

```html
<p>
  Some text with
  <svg viewBox="0 0 1 1" width="1" height="1"><rect fill="black" x="0" y="0" width="1" height="1" /></svg>
  a graphic… Wait is that a dead pixel?
</p>
```

This can be achieved with `example.js` like so:

```js
import {promises as fs} from 'node:fs'
import {parseFragment} from 'parse5'
import {fromParse5} from 'hast-util-from-parse5'
import {toMdast} from 'hast-util-to-mdast'
import {toHtml} from 'hast-util-to-html'
import {toMarkdown} from 'mdast-util-to-markdown'

main()

async function main() {
  const html = String(await fs.readFile('example.html'))
  const parse5 = parseFragment(html)
  const hast = fromParse5(parse5)
  const mdast = toMdast(hast, {
    handlers: {
      svg(h, node) {
        return h(node, 'html', toHtml(node, {space: 'svg'}))
      }
    }
  })
  const markdown = toMarkdown(mdast)

  console.log(markdown)
}
```

Yields:

```markdown
Some text with <svg viewBox="0 0 1 1" width="1" height="1"><rect fill="black" x="0" y="0" width="1" height="1"></rect></svg> a graphic… Wait is that a dead pixel?
```

<!-- Old ID of this section. -->

<a name="implied-paragraphs"></a>

## Algorithm

The algorithm used in this project is very powerful.
It supports all HTML elements, including ancient elements (`xmp`) and obscure
ones (`base`).
It’s particularly good at forms, media, and around implicit and explicit
paragraphs (see [HTML Standard, A. van Kesteren; et al. WHATWG § 3.2.5.4
Paragraphs][html-paragraphs]), such as:

```html
<article>
  An implicit paragraph.
  <h1>An explicit paragraph.</h1>
</article>
```

Yields:

```markdown
An implicit paragraph.

# An explicit paragraph.
```

## Syntax

HTML is handled according to [WHATWG HTML][html] (the living standard), which is
also followed by browsers such as Chrome and Firefox.

This project creates markdown according to [GFM][], which is a standard that’s
based on [CommonMark][] but adds the strikethrough (`~like so~`) and tables
(`| Table header | …`) amongst some alternative syntaxes.

## Syntax tree

The input syntax tree format is [hast][].
Any HTML that can be represented in hast is accepted as input.
The input syntax tree format is [mdast][].
When `<table>` elements, or `<del>`, `<s>`, and `<strike>` exist in the
HTML, then the GFM nodes `table` and `delete` are used.
This utility does not generate definitions or references, or syntax extensions
such as footnotes, frontmatter, or math.

## Types

This package is fully typed with [TypeScript][].
The extra types `Options`, `Context`, `H`, and `Handle` are exported.

## Compatibility

Projects maintained by the unified collective are compatible with all maintained
versions of Node.js.
As of now, that is Node.js 12.20+, 14.14+, and 16.0+.
Our projects sometimes work with older versions, but this is not guaranteed.

## Security

Use of `hast-util-to-mdast` is safe by default.

## Related

*   [`hast-util-to-nlcst`](https://github.com/syntax-tree/hast-util-to-nlcst)
    — transform hast to nlcst
*   [`hast-util-to-xast`](https://github.com/syntax-tree/hast-util-to-xast)
    — transform hast to xast

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [code of conduct][coc].
By interacting with this repository, organization, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://github.com/syntax-tree/hast-util-to-mdast/workflows/main/badge.svg

[build]: https://github.com/syntax-tree/hast-util-to-mdast/actions

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-mdast.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-mdast

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-mdast.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-mdast

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-mdast.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-mdast

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/chat-discussions-success.svg

[chat]: https://github.com/syntax-tree/unist/discussions

[esm]: https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c

[npm]: https://docs.npmjs.com/cli/install

[skypack]: https://www.skypack.dev

[license]: license

[author]: https://wooorm.com

[typescript]: https://www.typescriptlang.org

[contributing]: https://github.com/syntax-tree/.github/blob/main/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/main/support.md

[coc]: https://github.com/syntax-tree/.github/blob/main/code-of-conduct.md

[mdast]: https://github.com/syntax-tree/mdast

[mdast-node]: https://github.com/syntax-tree/mdast#nodes

[phrasing]: https://github.com/syntax-tree/mdast#phrasingcontent

[hast]: https://github.com/syntax-tree/hast

[handlers]: https://github.com/syntax-tree/hast-util-to-mdast/tree/main/lib/handlers

[html]: https://html.spec.whatwg.org/multipage/

[gfm]: https://github.github.com/gfm/

[commonmark]: https://commonmark.org

[html-paragraphs]: https://html.spec.whatwg.org/#paragraphs

[default-handlers]: https://github.com/syntax-tree/hast-util-to-mdast/blob/main/lib/handlers/index.js

[mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast

[rehype-remark]: https://github.com/rehypejs/rehype-remark
