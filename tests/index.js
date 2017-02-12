'use strict';

var fs = require('fs');
var path = require('path');
var u = require('unist-builder');
var h = require('hastscript');
var test = require('tape');
var hidden = require('is-hidden');
var negate = require('negate');
var unified = require('unified');
var markdown = require('remark-parse');
var html = require('rehype-parse');
var stringify = require('remark-stringify');
var assert = require('mdast-util-assert');
var remove = require('unist-util-remove-position');
var toMDAST = require('..');

var fixtures = path.join(__dirname, 'fixtures');

test('core', function (t) {
  t.deepEqual(
    toMDAST(u('root', [h('strong', 'Alpha')])),
    u('root', [u('strong', [u('text', 'Alpha')])]),
    'should transform HAST to MDAST'
  );

  t.deepEqual(
    toMDAST(u('root', [u('unknown', 'text')])),
    u('root', [u('text', 'text')]),
    'should transform unknown texts to `text`'
  );

  t.deepEqual(
    toMDAST(u('root', [u('unknown', [h('em')])])),
    u('root', [u('emphasis', [])]),
    'should unwrap unknown parents'
  );

  t.deepEqual(
    toMDAST(u('root', [u('unknown')])),
    u('root', []),
    'should ignore unknown voids'
  );

  var pos = {
    left: {
      line: 1,
      column: 1,
      offset: 0
    },
    right: {
      line: 1,
      column: 6,
      offset: 5
    }
  };

  t.deepEqual(
    toMDAST({
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'p',
        properties: {},
        children: [{
          type: 'text',
          value: 'Alpha',
          position: pos
        }],
        position: pos
      }],
      position: pos
    }),
    {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          value: 'Alpha',
          position: pos
        }],
        position: pos
      }],
      position: pos
    },
    'should ignore unknown voids'
  );

  t.end();
});

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

      /* Replace middots with spaces (useful for break nodes). */
      output = output.replace(/·/g, ' ');

      st.doesNotThrow(
        function () {
          assert(tree);
        },
        'should produce valid MDAST nodes'
      );

      if (!config || config.stringify !== false) {
        st.deepEqual(remark.stringify(tree), output || '\n', 'should produce the same documents');
      }

      if (!config || config.tree !== false) {
        st.deepEqual(
          tree,
          remove(remark.run(remark.parse(output)), true),
          'should produce the same tree as remark'
        );
      }

      st.end();
    });
  }
});

test('handlers option', function (t) {
  var options = {
    handlers: {
      div: function (h, node) {
        node.children[0].value = 'Beta';
        node.type = 'paragraph';
        return h(node, 'paragraph', node.children);
      }
    }
  };

  t.deepEqual(
    toMDAST({
      type: 'root',
      children: [{
        type: 'element',
        tagName: 'div',
        properties: {},
        children: [{
          type: 'text',
          value: 'Alpha'
        }]
      }]
    }, options),
    {
      type: 'root',
      children: [{
        type: 'paragraph',
        children: [{
          type: 'text',
          value: 'Beta'
        }]
      }]
    },
    'use handlers passed as option'
  );

  t.end();
});
