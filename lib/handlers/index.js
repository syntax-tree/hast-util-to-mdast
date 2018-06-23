'use strict'

var all = require('../all')
var wrapped = require('../util/wrap-children')

exports.root = require('./root')
exports.text = require('./text')
exports.comment = require('./comment')

exports.doctype = ignore

exports.area = ignore
exports.basefont = ignore
exports.bgsound = ignore
exports.caption = ignore
exports.col = ignore
exports.colgroup = ignore
exports.command = ignore
exports.content = ignore
exports.datalist = ignore
exports.dialog = ignore
exports.input = ignore
exports.keygen = ignore
exports.link = ignore
exports.map = ignore
exports.math = ignore
exports.menu = ignore
exports.menuitem = ignore
exports.meta = ignore
exports.noscript = ignore
exports.optgroup = ignore
exports.option = ignore
exports.script = ignore
exports.select = ignore
exports.shadow = ignore
exports.spacer = ignore
exports.style = ignore
exports.svg = ignore
exports.template = ignore
exports.title = ignore

exports.abbr = all
exports.acronym = all
exports.bdi = all
exports.bdo = all
exports.big = all
exports.blink = all
exports.cite = all
exports.data = all
exports.details = all
exports.dfn = all
exports.font = all
exports.meter = all
exports.nobr = all
exports.output = all
exports.progress = all
exports.slot = all
exports.small = all
exports.span = all
exports.sup = all
exports.sub = all
exports.thead = all
exports.tbody = all
exports.tfoot = all

exports.address = wrapped
exports.article = wrapped
exports.aside = wrapped
exports.body = wrapped
exports.center = wrapped
exports.div = wrapped
exports.figcaption = wrapped
exports.figure = wrapped
exports.footer = wrapped
exports.header = wrapped
exports.hgroup = wrapped
exports.html = wrapped
exports.main = wrapped
exports.nav = wrapped
exports.section = wrapped

exports.base = require('./base')
exports.ol = exports.ul = exports.dir = require('./list')
exports.table = require('./table')
exports.tr = require('./table-row')
exports.th = exports.td = require('./table-cell')
exports.li = require('./list-item')
exports.strong = exports.b = require('./strong')
exports.em = exports.i = exports.u = exports.mark = require('./emphasis')
exports.del = exports.s = exports.strike = require('./delete')
exports.code = exports.kbd = exports.samp = exports.tt = exports.var = require('./inline-code')
exports.img = exports.image = require('./image')
exports.br = require('./break')
exports.a = require('./link')
exports.wbr = require('./wbr')
exports.q = require('./q')

exports.p = exports.summary = require('./paragraph')
exports.hr = require('./thematic-break')
exports.pre = exports.listing = exports.plaintext = exports.xmp = require('./code')
exports.blockquote = require('./blockquote')
exports.h1 = exports.h2 = exports.h3 = exports.h4 = exports.h5 = exports.h6 = require('./heading')

function ignore() {}
