# hast-util-to-mdast [![Build Status][travis-badge]][travis] [![Coverage Status][codecov-badge]][codecov]

Transform [HAST][] (HTML) to [MDAST][] (markdown).

> This is stable in versioning now, but may change a bit in the future.
>
> See [GH-3][3] for progress.

## Installation

[npm][]:

```bash
npm install hast-util-to-mdast
```

## Usage

```javascript
var rehype = require('rehype');
var remark = require('remark');
var toMDAST = require('hast-util-to-mdast');

var hast = rehype().parse('<h2>Hello <strong>world!</strong></h2>');
var doc = remark().stringify(toMDAST(hast));
console.log(doc);
```

Yields:

```markdown
## Hello **world!**
```

## API

### `toMDAST(node[, options])`

Transform the given [HAST][] tree to an [MDAST][] tree.

###### `options.handlers`

Object mapping tag-names to functions handling those elements.
Take a look at [`handlers/`][handlers] for examples.

###### `options.document`

Whether the given tree is a complete document.  If `document: true`,
implicit paragraphs are added in the `root` node around inline MDAST nodes.
Otherwise, inline MDAST nodes are wrapped when needed.

## Related

*   [`mdast-util-to-hast`][mdast-util-to-hast]

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

[3]: https://github.com/syntax-tree/hast-util-to-mdast/issues/3

[handlers]: https://github.com/syntax-tree/hast-util-to-mdast/tree/master/handlers
