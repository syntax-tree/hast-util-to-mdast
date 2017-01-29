# hast-util-to-mdast

Convert [HAST trees](https://github.com/syntax-tree/hast) to [MDAST trees](https://github.com/syntax-tree/mdast).

## About

Based on the code in [mdast-util-to-hast](https://github.com/wooorm/mdast-util-to-hast), this module provides a way to transform an HTML abstract syntax tree into a markdown abstract syntax tree.

Used with [rehype](https://npmjs.com/rehype) and [remark](https://npmjs.com/remark), this allows you to convert HTML into markdown.

### Work in progress

So far this only transforms a few HTML elements, and there's more work to do. To see what's been completed so far look at [the handlers directory](/handlers).

## Install

```sh
npm install --save hast-util-to-mdast
```

## Usage

```js
var unified = require('unified')
var parse = require('rehype-parse')
var stringify = require('remark-stringify')

var toMDAST = require('hast-util-to-mdast')

var result = unified()
  .use(parse)
  .use(function () { return toMDAST })
  .use(stringify)
  .process(html, { fragment: true })

console.log(result.contents)
```


## License

[MIT](LICENSE.md)
