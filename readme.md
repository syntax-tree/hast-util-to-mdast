# hast-util-to-mdast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [HAST][] (HTML) to [MDAST][] (markdown).

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
var unified = require('unified');
var parse = require('rehype-parse');
var stringify = require('remark-stringify');
var vfile = require('to-vfile');
var toMDAST = require('hast-util-to-mdast');

var file = vfile.readSync('example.html');
var hast = unified().use(parse).parse(file);
var mdast = toMDAST(hast);
var doc = unified().use(stringify).stringify(mdast);

console.log(doc);
```

Now, running `node example.js` yields:

```markdown
## Hello **world!**
```

## API

### `toMDAST(node[, options])`

Transform the given [HAST][] tree to an [MDAST][] tree.

##### Options

###### `options.handlers`

Object mapping tag-names to functions handling those elements.
Take a look at [`handlers/`][handlers] for examples.

###### `options.document`

Whether the given tree is a complete document.  If `document: true`,
implicit paragraphs are added in the `root` node around inline MDAST nodes.
Otherwise, inline MDAST nodes are wrapped when needed.

##### Returns

[`MDASTNode`][mdast].

## Related

*   [`mdast-util-to-hast`][mdast-util-to-hast]

## Contribute

See [`contribute.md` in `syntax-tree/hast`][contribute] for ways to get
started.

This organisation has a [Code of Conduct][coc].  By interacting with this
repository, organisation, or community you agree to abide by its terms.

## License

[MIT][license] © [Titus Wormer][author]

<!-- Definitions -->

[travis-badge]: https://img.shields.io/travis/syntax-tree/hast-util-to-mdast.svg

[travis]: https://travis-ci.org/syntax-tree/hast-util-to-mdast

[codecov-badge]: https://img.shields.io/codecov/c/github/syntax-tree/hast-util-to-mdast.svg

[codecov]: https://codecov.io/github/syntax-tree/hast-util-to-mdast

[npm]: https://docs.npmjs.com/cli/install

[license]: LICENSE

[author]: http://wooorm.com

[mdast]: https://github.com/syntax-tree/mdast

[hast]: https://github.com/syntax-tree/hast

[mdast-util-to-hast]: https://github.com/syntax-tree/mdast-util-to-hast

[rehype-remark]: https://github.com/rehypejs/rehype-remark

[handlers]: https://github.com/syntax-tree/hast-util-to-mdast/tree/master/handlers

[contribute]: https://github.com/syntax-tree/hast/blob/master/contributing.md

[coc]: https://github.com/syntax-tree/hast/blob/master/code-of-conduct.md
