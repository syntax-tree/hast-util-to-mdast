# hast-util-to-mdast

[![Build][build-badge]][build]
[![Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![Chat][chat-badge]][chat]

Transform [hast][] (HTML) to [mdast][] (markdown).

> **Note**: You probably want to use [rehype-remark][].

## Installation

[npm][]:

```bash
npm install hast-util-to-mdast
```

## Usage

Say we have the following `example.html`:

```html
<h2>Hello <strong>world!</strong></h2>
```

…and next to it, `example.js`:

```javascript
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

### `toMdast(node[, options])`

Transform the given [hast][] tree to [mdast][].

##### Options

###### `options.handlers`

Object mapping tag-names to functions handling those elements.
Take a look at [`handlers/`][handlers] for examples.

###### `options.document`

Whether the given tree is a complete document.  If `document: true`,
implicit paragraphs are added in the `root` node around inline mdast nodes.
Otherwise, inline mdast nodes are wrapped when needed.

###### `options.newlines`

Whether to collapse to a newline (`\n`) instead of a single space (default) if
a streak of white-space in a text node contains a newline.

##### Returns

[`MDASTNode`][mdast].

##### Notes

###### Implied sentences

The algorithm supports implicit and explicit paragraphs, such as:

```html
<article>
  An implicit sentence.
  <h1>An explicit sentence.</h1>
</article>
```

Yields:

```markdown
An implicit sentence.

# An explicit sentence.
```

###### Ignoring nodes

Some nodes are ignored and their content will not be present in mdast.
To ignore custom elements, configure a handler for their tag-name or type that
returns nothing.
For example, to ignore `em` elements, pass `handlers: {'em': function () {}}`:

```html
<p><strong>Importance</strong> and <em>emphasis</em>.</p>
```

Yields:

```markdown
**Importance** and .
```

To ignore a specific element from HTML, set `data-mdast` to `ignore`:

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

See [`contributing.md` in `syntax-tree/hast`][contributing] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[build-badge]: https://img.shields.io/travis/syntax-tree/hast-util-to-mdast.svg

[build]: https://travis-ci.org/syntax-tree/hast-util-to-mdast

[coverage-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-mdast.svg

[coverage]: https://codecov.io/github/syntax-tree/hast-util-to-mdast

[downloads-badge]: https://img.shields.io/npm/dm/hast-util-to-mdast.svg

[downloads]: https://www.npmjs.com/package/hast-util-to-mdast

[chat-badge]: https://img.shields.io/badge/join%20the%20community-on%20spectrum-7b16ff.svg

[chat]: https://spectrum.chat/unified/rehype

[npm]: https://docs.npmjs.com/cli/install

[license]: license

[author]: https://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[handlers]: https://github.com/syntax-tree/hast-util-to-mdast/tree/master/lib/handlers

[contributing]: https://github.com/syntax-tree/hast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/hast/blob/master/code-of-conduct.md
