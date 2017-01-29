'use strict';

var fs = require('fs');
var path = require('path');

var test = require('tape');
var hidden = require('is-hidden');
var negate = require('negate');
var unified = require('unified');
var markdown = require('remark-parse');
var html = require('rehype-parse');
var stringify = require('remark-stringify');
var assert = require('mdast-util-assert');
var remove = require('unist-util-remove-position');
var toMDAST = require('../');

var fixtures = path.join(__dirname, 'fixtures');

test('fixtures', function (t) {
  var fromHTML = unified()
    .use(html)
    .use(function () {
      return toMDAST;
    })
    .use(stringify);

  var remark = unified().use(markdown).use(stringify);

  fs
    .readdirSync(fixtures)
    .filter(negate(hidden))
    .forEach(check);

  t.end();

  function check(name) {
    t.test(name, function (st) {
      var input = fs.readFileSync(path.join(fixtures, name, 'index.html'), 'utf8');
      var output = fs.readFileSync(path.join(fixtures, name, 'index.md'), 'utf8');
      var config;

      try {
        config = fs.readFileSync(path.join(fixtures, name, 'index.json'), 'utf8');
      } catch (err) {}

      if (config) {
        config = JSON.parse(config);
      }

      var tree = remove(fromHTML.run(fromHTML.parse(input, config)), true);

      st.doesNotThrow(
        function () {
          assert(tree);
        },
        'should produce valid MDAST nodes'
      );

      st.deepEqual(remark.stringify(tree), output || '\n', 'should produce the same documents');

      st.deepEqual(
        tree,
        remove(remark.run(remark.parse(output)), true),
        'should produce the same tree as remark'
      );

      st.end();
    });
  }
});
