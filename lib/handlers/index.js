'use strict';

var all = require('../all');

exports.root = require('./root');
exports.text = require('./text');
exports.comment = require('./comment');

exports.caption =
exports.colgroup =
exports.head =
exports.math =
exports.script =
exports.style =
exports.svg =
exports.template =
exports.title = ignore;

exports.thead =
exports.tbody =
exports.tfoot = children;

exports.ol = exports.ul = require('./list');
exports.table = require('./table');
exports.tr = require('./table-row');
exports.th = exports.td = require('./table-cell');
exports.li = require('./list-item');
exports.strong = exports.b = require('./strong');
exports.em = exports.i = require('./emphasis');
exports.del = exports.s = exports.strike = require('./delete');
exports.code = exports.kbd = exports.samp = exports.var = require('./inline-code');
exports.img = require('./image');
exports.br = require('./break');

exports.p = require('./paragraph');
exports.hr = require('./thematic-break');
exports.pre = require('./code');
exports.blockquote = require('./blockquote');

exports.h1 = exports.h2 = exports.h3 =
  exports.h4 = exports.h5 = exports.h6 = require('./heading');

exports.a = require('./link');

function ignore() {}

function children(h, node) {
  return all(h, node);
}
