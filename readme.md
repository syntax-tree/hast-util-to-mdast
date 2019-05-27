# hast-util-to-mdast

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Size][size-badge]][size]
[![Sponsors][sponsors-badge]][collective]
[![Backers][backers-badge]][collective]
[![Chat][chat-badge]][chat]

[**hast**][hast] utility to transform to [**mdast**][mdast].

> **Note**: You probably want to use [rehype-remark][].

## Install

[npm][]:

```sh
npm install hast-util-to-mdast
```

## Usage

Say we have the following `example.html`:

```html
<h2>Hello <strong>world!</strong></h2>
```

…and next to it, `example.js`:

```js
var unified = require('unified')
var parse = require('rehype-parse')
var stringify = require('remark-stringify')
var vfile = require('to-vfile')
var toMdast = require('hast-util-to-mdast')

var file = vfile.readSync('example.html')

var hast = unified()
  .use(parse)
  .parse(file)

var mdast = toMdast(hast)

var doc = unified()
  .use(stringify)
  .stringify(mdast)

console.log(doc)
```

Now, running `node example.js` yields:

```markdown
## Hello **world!**
```

## API

### `toMdast(tree[, options])`

Transform the given [**hast**][hast] [*tree*][tree] to [**mdast**][mdast].

##### Options

###### `options.handlers`

Object mapping tag names or [*types*][type] to functions handling those
[*elements*][element] or [*nodes*][hast-node].
See [`handlers/`][handlers] for examples.

###### `options.document`

Whether the given [*tree*][tree] is a complete document.
Applies if the given `tree` is a [`root`][hast-root].
First its [*children*][child] are transformed to [**mast**][mdast].
By default, if one or more of the new mdast children are [*phrasing*][phrasing]
nodes, and one or more are not, the phrasing nodes are wrapped in
[*paragraphs*][mdast-paragraph].
If `document: true`, all mdast phrasing children are wrapped in paragraphs.

###### `options.newlines`

Whether to collapse to a line feed (`\n`) instead of a single space (default) if
a streak of white-space in a text node contains a newline.

##### Returns

[`MdastNode`][mdast-node].

##### Notes

###### Implied paragraphs

The algorithm supports implicit and explicit paragraphs (see [HTML Standard,
A. van Kesteren; et al. WHATWG § 3.2.5.4 Paragraphs][spec]), such as:

```html
<article>
  An implicit paragraphs.
  <h1>An explicit paragraphs.</h1>
</article>
```

Yields:

```markdown
An implicit paragraphs.

# An explicit paragraphs.
```

###### Ignoring nodes

Some [*nodes*][hast-node] are ignored and their content will not be present in
the [**mdast**][mdast] [*tree*][tree].
To ignore nodes, configure a [handler][] for their tag name or [*type*][type]
that returns nothing.
For example, to ignore `em` [*elements*][element], pass `handlers: {'em':
function () {}}`:

```html
<p><strong>Importance</strong> and <em>emphasis</em>.</p>
```

Yields:

```markdown
**Importance** and .
```

To ignore a specific element from the HTML source, set `data-mdast` to
`ignore`:

```html
<p><strong>Importance</strong> and <em data-mdast="ignore">emphasis</em>.</p>
```

Yields:

```markdown
**Importance** and .
```

## Related

*   [`hast-util-to-nlcst`](https://github.com/syntax-tree/hast-util-to-nlcst)
    — Transform hast to nlcst
*   [`mdast-util-to-hast`](https://github.com/syntax-tree/mdast-util-to-hast)
    — Transform mdast to hast
*   [`mdast-util-to-nlcst`](https://github.com/syntax-tree/mdast-util-to-nlcst)
    — Transform mdast to nlcst
*   [`remark-rehype`](https://github.com/remarkjs/remark-rehype)
    — rehype support for remark
*   [`rehype-remark`](https://github.com/rehypejs/rehype-remark)
    — remark support for rehype

## Contribute

See [`contributing.md` in `syntax-tree/.github`][contributing] for ways to get
started.
See [`support.md`][support] for ways to get help.

This project has a [Code of Conduct][coc].
By interacting with this repository, organisation, or community you agree to
abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-to-mdast.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-to-mdast

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-mdast.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-mdast

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-mdast.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-mdast

[size-badge]: https://img.shields.io/bundlephobia/minzip/hast-util-to-mdast.svg

[size]: https://bundlephobia.com/result?p=hast-util-to-mdast

[sponsors-badge]: https://opencollective.com/unified/sponsors/badge.svg

[backers-badge]: https://opencollective.com/unified/backers/badge.svg

[collective]: https://opencollective.com/unified

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/syntax-tree

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[contributing]: https://github.com/syntax-tree/.github/blob/master/contributing.md

[support]: https://github.com/syntax-tree/.github/blob/master/support.md

[coc]: https://github.com/syntax-tree/.github/blob/master/code-of-conduct.md

[tree]: https://github.com/syntax-tree/unist#tree

[child]: https://github.com/syntax-tree/unist#child

[type]: https://github.com/syntax-tree/unist#type

[mdast]: https://github.com/syntax-tree/mdast

[mdast-paragraph]: https://github.com/syntax-tree/mdast#paragraph

[mdast-node]: https://github.com/syntax-tree/mdast#nodes

[phrasing]: https://github.com/syntax-tree/mdast#phrasingcontent

[hast]: https://github.com/syntax-tree/hast

[hast-node]: https://github.com/syntax-tree/hast#nodes

[hast-root]: https://github.com/syntax-tree/hast#root

[element]: https://github.com/syntax-tree/hast#element

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[handler]: #optionshandlers

[handlers]: https://github.com/syntax-tree/hast-util-to-mdast/tree/master/lib/handlers

[spec]: https://html.spec.whatwg.org/#paragraphs
