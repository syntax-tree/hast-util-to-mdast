'use strict';

var all = require('../all');
var wrapped = require('../wrap-children');

exports.root = require('./root');
exports.text = require('./text');
exports.comment = require('./comment');

exports.doctype = ignore;

exports.area =
exports.basefont =
exports.bgsound =
exports.caption =
exports.col =
exports.colgroup =
exports.command =
exports.content =
exports.datalist =
exports.dialog =
exports.head =
exports.input =
exports.keygen =
exports.link =
exports.map =
exports.math =
exports.menu =
exports.menuitem =
exports.meta =
exports.optgroup =
exports.option =
exports.script =
exports.select =
exports.shadow =
exports.spacer =
exports.style =
exports.svg =
exports.template =
exports.title = ignore;

exports.abbr =
exports.acronym =
exports.bdi =
exports.bdo =
exports.big =
exports.blink =
exports.cite =
exports.data =
exports.details =
exports.dfn =
exports.font =
exports.meter =
exports.nobr =
exports.output =
exports.progress =
exports.slot =
exports.small =
exports.span =
exports.sup =
exports.sub =
exports.thead =
exports.tbody =
exports.tfoot = children;

exports.address =
exports.article =
exports.aside =
exports.body =
exports.figcaption =
exports.figure =
exports.footer =
exports.header =
exports.hgroup =
exports.html =
exports.main =
exports.nav =
exports.section = wrapped;

exports.ol = exports.ul = require('./list');
exports.table = require('./table');
exports.tr = require('./table-row');
exports.th = exports.td = require('./table-cell');
exports.li = require('./list-item');
exports.strong = exports.b = require('./strong');
exports.em = exports.i = exports.u = require('./emphasis');
exports.del = exports.s = exports.strike = require('./delete');
exports.code = exports.kbd = exports.samp = exports.tt = exports.var = require('./inline-code');
exports.img = require('./image');
exports.br = require('./break');

exports.p = exports.summary = require('./paragraph');
exports.hr = require('./thematic-break');
exports.xmp = exports.pre = require('./code');
exports.blockquote = require('./blockquote');

exports.h1 =
exports.h2 =
exports.h3 =
exports.h4 =
exports.h5 =
exports.h6 = require('./heading');

exports.a = require('./link');

exports.wbr = require('./wbr');

exports.q = require('./q');

function ignore() {}

function children(h, node) {
  return all(h, node);
}
