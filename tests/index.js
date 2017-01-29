var fs = require('fs')
var path = require('path')

var test = require('tape')
var unified = require('unified')
var parse = require('rehype-parse')
var stringify = require('remark-stringify')
var toMDAST = require('../index')

var fixtures = path.join(__dirname, 'fixtures')

test('root', function (t) {
  var result = unified()
    .use(parse)
    .use(function () { return toMDAST })
    .use(stringify)
    .process('', { fragment: true }).contents

  t.ok(result)
  t.end()
})

test('paragraph', function (t) {
  var html = fs.readFileSync(path.join(fixtures, 'paragraph', 'index.html'), 'utf8')
  var md = fs.readFileSync(path.join(fixtures, 'paragraph', 'index.md'), 'utf8')

  var result = unified()
    .use(parse)
    .use(function () { return toMDAST })
    .use(stringify)
    .process(html, { fragment: true }).contents

  t.equal(result, md)
  t.end()
})

test('strong', function (t) {
  var html = fs.readFileSync(path.join(fixtures, 'strong', 'index.html'), 'utf8')
  var md = fs.readFileSync(path.join(fixtures, 'strong', 'index.md'), 'utf8')

  var result = unified()
    .use(parse)
    .use(function () { return toMDAST })
    .use(stringify)
    .process(html, { fragment: true }).contents

  t.equal(result, md)
  t.end()
})

test('heading', function (t) {
  var html = fs.readFileSync(path.join(fixtures, 'heading', 'index.html'), 'utf8')
  var md = fs.readFileSync(path.join(fixtures, 'heading', 'index.md'), 'utf8')

  var result = unified()
    .use(parse)
    .use(function () { return toMDAST })
    .use(stringify)
    .process(html, { fragment: true }).contents

  t.equal(result, md)
  t.end()
})
